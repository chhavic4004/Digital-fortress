import type { LucideIcon } from "lucide-react";

export type EmergencyDomain =
  | "scam_phishing"
  | "account_compromise"
  | "fraud_upi"
  | "unsafe_wifi"
  | "general_help";

export type EmergencyStep = {
  title: string;
  details: string[];
};

export type EmergencyContact = {
  label: string;
  value: string;
  href: string;
  description?: string;
};

export type EmergencyFlow = {
  domain: EmergencyDomain;
  title: string;
  subtitle: string;
  prompt: string;
  immediateAction: string;
  badges: string[];
  steps: EmergencyStep[];
  contacts: EmergencyContact[];
};

export type EmergencyOption = {
  domain: EmergencyDomain;
  label: string;
  description: string;
  icon: LucideIcon;
};
