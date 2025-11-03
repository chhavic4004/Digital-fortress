/**
 * Sanitization utility for deception events
 * Removes sensitive data: IPs, URLs, PII, user identities
 */

/**
 * Remove IP addresses from text
 */
export function removeIPs(text) {
  if (!text) return '';
  // Match IPv4 and IPv6 patterns
  const ipv4Pattern = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
  const ipv6Pattern = /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g;
  return text
    .replace(ipv4Pattern, '[IP REMOVED]')
    .replace(ipv6Pattern, '[IP REMOVED]');
}

/**
 * Remove URLs from text, but keep domain type info if safe
 */
export function sanitizeURLs(text) {
  if (!text) return '';
  // Match URLs
  const urlPattern = /https?:\/\/[^\s]+/gi;
  return text.replace(urlPattern, (url) => {
    try {
      const urlObj = new URL(url);
      // Only keep TLD info, remove everything else
      const tld = urlObj.hostname.split('.').slice(-2).join('.');
      return `[${tld} domain]`;
    } catch {
      return '[URL REMOVED]';
    }
  });
}

/**
 * Remove email addresses
 */
export function removeEmails(text) {
  if (!text) return '';
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  return text.replace(emailPattern, '[EMAIL REMOVED]');
}

/**
 * Remove phone numbers
 */
export function removePhoneNumbers(text) {
  if (!text) return '';
  const phonePattern = /\b(?:\+91[\s-]?)?[6-9]\d{9}\b/g;
  return text.replace(phonePattern, '[PHONE REMOVED]');
}

/**
 * Remove any patterns that look like personal identifiers
 */
export function removePII(text) {
  if (!text) return '';
  // Remove Aadhaar-like patterns
  text = text.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[ID REMOVED]');
  // Remove PAN-like patterns
  text = text.replace(/\b[A-Z]{5}\d{4}[A-Z]\b/g, '[ID REMOVED]');
  return text;
}

/**
 * Main sanitization function
 */
export function sanitizeDeception(deception) {
  const sanitized = { ...deception._doc || deception };

  // Sanitize threat_source
  if (sanitized.threat_source) {
    let sanitizedSource = sanitized.threat_source;
    sanitizedSource = removeIPs(sanitizedSource);
    sanitizedSource = sanitizeURLs(sanitizedSource);
    sanitizedSource = removeEmails(sanitizedSource);
    sanitizedSource = removePhoneNumbers(sanitizedSource);
    sanitizedSource = removePII(sanitizedSource);
    sanitized.threat_source = sanitizedSource || 'Unknown Source';
  }

  // Sanitize summary
  if (sanitized.summary) {
    sanitized.summary = removeIPs(sanitized.summary);
    sanitized.summary = sanitizeURLs(sanitized.summary);
    sanitized.summary = removeEmails(sanitized.summary);
    sanitized.summary = removePhoneNumbers(sanitized.summary);
    sanitized.summary = removePII(sanitized.summary);
  }

  // Sanitize timeline details
  if (sanitized.timeline) {
    if (sanitized.timeline.attacker_interaction?.details) {
      let details = sanitized.timeline.attacker_interaction.details;
      details = removeIPs(details);
      details = sanitizeURLs(details);
      details = removeEmails(details);
      details = removePhoneNumbers(details);
      details = removePII(details);
      sanitized.timeline.attacker_interaction.details = details;
    }

    if (sanitized.timeline.deception_deployed?.action) {
      sanitized.timeline.deception_deployed.action = sanitizeURLs(
        sanitized.timeline.deception_deployed.action
      );
    }
  }

  // Remove user reference for public feed
  if (sanitized.metadata) {
    sanitized.metadata.reported_by = null;
  }

  // Mark as sanitized
  sanitized.metadata = {
    ...sanitized.metadata,
    sanitized: true,
  };

  return sanitized;
}

/**
 * Sanitize array of deceptions
 */
export function sanitizeDeceptions(deceptions) {
  return deceptions.map(deception => sanitizeDeception(deception));
}

