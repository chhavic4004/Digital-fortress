import { AlertTriangle, CreditCard, ShieldAlert, Wifi, LifeBuoy } from "lucide-react";
import type { EmergencyFlow, EmergencyOption } from "./types";

export const emergencyOptions: EmergencyOption[] = [
  {
    domain: "scam_phishing",
    label: "Scam / Phishing",
    description: "Fake links, login pages, OTP bait, suspicious messages",
    icon: ShieldAlert,
  },
  {
    domain: "account_compromise",
    label: "Account Compromise",
    description: "Email, social, or bank account may be taken over",
    icon: CreditCard,
  },
  {
    domain: "fraud_upi",
    label: "Fraud / UPI",
    description: "Money sent, unauthorized transfer, card or UPI abuse",
    icon: CreditCard,
  },
  {
    domain: "unsafe_wifi",
    label: "Unsafe Wi‑Fi",
    description: "Public Wi‑Fi, captive portal, insecure connection",
    icon: Wifi,
  },
  {
    domain: "general_help",
    label: "General Panic / Help",
    description: "Not sure what happened, need calm step-by-step support",
    icon: LifeBuoy,
  },
];

export const emergencyFlows: Record<string, EmergencyFlow> = {
  scam_phishing: {
    domain: "scam_phishing",
    title: "Scam / Phishing Response",
    subtitle: "Stop the scam, secure your accounts, and report the source.",
    prompt: "You may have clicked a fake link, entered credentials, or received an OTP scam.",
    immediateAction: "Stop interacting with the message or page right now. Do not enter more details.",
    badges: ["Fake login", "Suspicious link", "OTP scam"],
    steps: [
      {
        title: "Cut off the attacker",
        details: ["Close the website or message thread.", "Do not click any more links.", "Do not share OTP, password, or card details."],
      },
      {
        title: "Change passwords from a safe device",
        details: ["Use a trusted phone or laptop.", "Change email first, then other important accounts.", "Turn on 2FA wherever possible."],
      },
      {
        title: "Report and block",
        details: ["Report the sender / site as phishing.", "Block the number, account, or domain.", "Save screenshots for evidence."],
      },
    ],
    contacts: [
      { label: "Cybercrime Helpline", value: "1930", href: "tel:1930", description: "Report financial phishing immediately" },
      { label: "National Cybercrime Portal", value: "cybercrime.gov.in", href: "https://cybercrime.gov.in", description: "File an online complaint" },
    ],
  },
  account_compromise: {
    domain: "account_compromise",
    title: "Account Compromise Response",
    subtitle: "Recover access and lock the account before damage spreads.",
    prompt: "Someone may have accessed your email, social account, or bank account.",
    immediateAction: "Secure your primary email and revoke all active sessions now.",
    badges: ["Hacked account", "Unauthorized login", "Session theft"],
    steps: [
      {
        title: "Reset the primary account",
        details: ["Change password from a clean device.", "Log out of all other sessions.", "Review recovery email and phone number."],
      },
      {
        title: "Protect connected accounts",
        details: ["Change passwords for accounts using the same email.", "Revoke app permissions and unknown devices.", "Check for forwarding rules or unknown recovery settings."],
      },
      {
        title: "Contact support",
        details: ["Use the platform’s official recovery path.", "If money is involved, inform the bank immediately.", "Keep a timeline of what changed and when."],
      },
    ],
    contacts: [
      { label: "Cybercrime Helpline", value: "1930", href: "tel:1930", description: "If the compromised account caused financial loss" },
      { label: "Police Emergency", value: "100", href: "tel:100", description: "If personal safety is at risk" },
    ],
  },
  fraud_upi: {
    domain: "fraud_upi",
    title: "Fraud / UPI Response",
    subtitle: "Act quickly to reduce loss and start recovery steps.",
    prompt: "A payment, UPI transfer, or card transaction looks unauthorized or fraudulent.",
    immediateAction: "Block your card or UPI access immediately and call the fraud helpline.",
    badges: ["UPI fraud", "Card fraud", "Unauthorized transfer"],
    steps: [
      {
        title: "Block payment access",
        details: ["Call your bank or use the app to block card/UPI.", "Disable netbanking if needed.", "Change your banking passwords from a safe device."],
      },
      {
        title: "Report instantly",
        details: ["Call 1930 as soon as possible.", "File a complaint at cybercrime.gov.in.", "Note transaction ID, amount, time, and recipient details."],
      },
      {
        title: "Preserve evidence",
        details: ["Screenshot SMS, UPI app, or bank alerts.", "Keep bank statement and receipts.", "Avoid deleting chats or notifications."],
      },
    ],
    contacts: [
      { label: "Cybercrime Helpline", value: "1930", href: "tel:1930", description: "First call for financial fraud" },
      { label: "Police Emergency", value: "100", href: "tel:100", description: "If you feel threatened or need urgent help" },
    ],
  },
  unsafe_wifi: {
    domain: "unsafe_wifi",
    title: "Unsafe Wi‑Fi Response",
    subtitle: "Get off the risky network and protect exposed data.",
    prompt: "You are on public Wi‑Fi, captive portal, or a connection that looks unsafe.",
    immediateAction: "Disconnect now and switch to mobile data or a trusted VPN-protected connection.",
    badges: ["Public Wi‑Fi", "Captive portal", "Insecure connection"],
    steps: [
      {
        title: "Leave the network",
        details: ["Turn off Wi‑Fi or disconnect from the hotspot.", "Avoid logging into banking or OTP apps.", "Do not keep entering credentials."],
      },
      {
        title: "Check device safety",
        details: ["Review recent app installs and permissions.", "Forget suspicious saved networks.", "Restart the device if you suspect interception."],
      },
      {
        title: "Use safer access",
        details: ["Use mobile data or a trusted VPN.", "Enable HTTPS-only browsing if available.", "Change passwords if you already typed them on the unsafe network."],
      },
    ],
    contacts: [
      { label: "Cybercrime Helpline", value: "1930", href: "tel:1930", description: "If unsafe Wi‑Fi led to fraud or theft" },
      { label: "Police Emergency", value: "100", href: "tel:100", description: "If you suspect active danger" },
    ],
  },
  general_help: {
    domain: "general_help",
    title: "General Panic / Help",
    subtitle: "Start with calm triage and choose the right emergency path.",
    prompt: "You are not sure what happened yet, but you need immediate guidance.",
    immediateAction: "Pause for 10 seconds, breathe, and choose the closest issue from the options below.",
    badges: ["Not sure", "Need guidance", "Calm triage"],
    steps: [
      {
        title: "Identify the main symptom",
        details: ["Was money moved?", "Was an account accessed?", "Did you click a link or use unsafe Wi‑Fi?"],
      },
      {
        title: "Pick the closest domain",
        details: ["Scam / phishing if a link or message tricked you.", "Account compromise if login access changed.", "Fraud / UPI if money or card details were involved."],
      },
      {
        title: "Escalate if needed",
        details: ["Use 1930 for financial loss.", "Use 100 if safety is at risk.", "Use cybercrime.gov.in to file the report."],
      },
    ],
    contacts: [
      { label: "Cybercrime Helpline", value: "1930", href: "tel:1930", description: "Default first response for fraud" },
      { label: "Police Emergency", value: "100", href: "tel:100", description: "Use if the situation feels urgent or unsafe" },
    ],
  },
};
