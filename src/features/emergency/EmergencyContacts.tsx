import { Phone, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EmergencyContact } from "./types";

type Props = {
  contacts: EmergencyContact[];
};

const EmergencyContacts = ({ contacts }: Props) => {
  return (
    <Card className="border-primary/20 bg-card/70">
      <CardHeader>
        <CardTitle>Emergency Contacts</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {contacts.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            target={contact.href.startsWith("http") ? "_blank" : undefined}
            rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="rounded-lg border border-primary/20 bg-background/60 p-4 transition-colors hover:bg-primary/10"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 font-semibold">
                  <Phone className="h-4 w-4 text-primary" />
                  {contact.label}
                </div>
                <div className="text-sm text-muted-foreground">{contact.description}</div>
              </div>
              <div className="flex items-center gap-1 text-primary font-bold">
                {contact.value}
                {contact.href.startsWith("http") && <ExternalLink className="h-4 w-4" />}
              </div>
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  );
};

export default EmergencyContacts;
