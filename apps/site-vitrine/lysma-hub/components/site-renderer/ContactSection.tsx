"use client";

import { FormEvent, useState } from "react";
import type { ContactSectionData } from "../../lib/site-types";
import { Button } from "../ui/Button";
import { Input, Textarea } from "../ui/Input";

type ContactState = "idle" | "loading" | "success" | "error";

export function ContactSection({
  data,
  siteSlug,
  anchorId = "contact",
}: {
  data: ContactSectionData;
  siteSlug: string;
  anchorId?: string;
}) {
  const [state, setState] = useState<ContactState>("idle");
  const [feedback, setFeedback] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setState("loading");
    setFeedback("");

    const formData = new FormData(form);
    const payload = {
      siteSlug,
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      message: String(formData.get("message") || ""),
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = (await response.json()) as { success?: boolean; error?: string };

    if (!response.ok || !result.success) {
      setState("error");
      setFeedback(result.error || "Votre demande n’a pas pu être envoyée.");
      return;
    }

    form.reset();
    setState("success");
    setFeedback("Votre demande est bien enregistree. L'entreprise vous recontactera rapidement.");
  };

  return (
    <section className="hub-section hub-contact-section" id={anchorId}>
      <div className="hub-shell hub-contact-grid">
        <div>
          <p className="hub-kicker">{data.eyebrow}</p>
          <h2>{data.title}</h2>
          <p>{data.description}</p>
          <div className="hub-contact-list">
            <a href={`tel:${data.phone.replace(/\s/g, "")}`}>{data.phone}</a>
            <a href={`mailto:${data.email}`}>{data.email}</a>
            <span>{data.address}</span>
            {data.hours.map((hour) => (
              <span key={hour}>{hour}</span>
            ))}
          </div>
        </div>
        <form className="hub-contact-form" onSubmit={onSubmit}>
          <Input name="name" placeholder="Nom complet" maxLength={90} required />
          <div className="hub-form-row">
            <Input name="email" type="email" placeholder="Email" maxLength={120} />
            <Input name="phone" type="tel" placeholder="Telephone" maxLength={40} />
          </div>
          <Textarea name="message" placeholder="Votre demande" maxLength={1400} required rows={6} />
          <Button disabled={state === "loading"}>{state === "loading" ? "Envoi..." : "Envoyer la demande"}</Button>
          {feedback ? <p className={`hub-form-feedback hub-form-${state}`}>{feedback}</p> : null}
        </form>
      </div>
    </section>
  );
}
