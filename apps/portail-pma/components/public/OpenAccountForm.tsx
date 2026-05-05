"use client";

import { useState } from "react";

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  companyName: string;
  companyAddress: string;
  postalCode: string;
  city: string;
  message: string;
};

export default function OpenAccountForm() {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    companyName: "",
    companyAddress: "",
    postalCode: "",
    city: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      companyName: "",
      companyAddress: "",
      postalCode: "",
      city: "",
      message: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/account-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Impossible d’envoyer la demande.");
        return;
      }

      setSuccessMsg("Votre demande a bien été envoyée.");
      resetForm();
    } catch {
      setErrorMsg("Erreur réseau ou serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field
          label="Prénom"
          placeholder="Prénom"
          value={form.firstName}
          onChange={(value) => update("firstName", value)}
        />

        <Field
          label="Nom"
          placeholder="Nom"
          value={form.lastName}
          onChange={(value) => update("lastName", value)}
        />

        <Field
          label="Téléphone"
          placeholder="Téléphone"
          value={form.phone}
          onChange={(value) => update("phone", value)}
        />

        <Field
          label="Email"
          type="email"
          placeholder="email@domaine.com"
          value={form.email}
          onChange={(value) => update("email", value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field
          label="Entreprise"
          placeholder="Nom de l’entreprise"
          value={form.companyName}
          onChange={(value) => update("companyName", value)}
        />

        <Field
          label="Adresse entreprise"
          placeholder="Adresse"
          value={form.companyAddress}
          onChange={(value) => update("companyAddress", value)}
        />

        <Field
          label="Code postal"
          placeholder="Code postal"
          value={form.postalCode}
          onChange={(value) => update("postalCode", value)}
        />

        <Field
          label="Ville"
          placeholder="Ville"
          value={form.city}
          onChange={(value) => update("city", value)}
        />
      </div>

      <div>
        <label className="mb-2.5 block text-[13px] font-semibold text-[#0F172A]">
          Message
        </label>
        <textarea
          className="input-lysma min-h-[150px] resize-none"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Décrivez brièvement votre besoin."
        />
      </div>

      {errorMsg ? <div className="alert-error">{errorMsg}</div> : null}
      {successMsg ? <div className="alert-success">{successMsg}</div> : null}

      <div className="pt-2">
        <button type="submit" disabled={loading} className="btn-primary w-full min-h-[52px]">
          {loading ? "Envoi..." : "Envoyer la demande"}
        </button>

        <p className="mt-3 text-center text-xs text-[#7B8798]">
          Votre demande sera étudiée avant activation.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
}) {
  return (
    <div>
      <label className="mb-2.5 block text-[13px] font-semibold text-[#0F172A]">
        {label}
      </label>
      <input
        type={type}
        className="input-lysma"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}