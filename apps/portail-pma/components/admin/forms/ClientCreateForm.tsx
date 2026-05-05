"use client";

import { useState } from "react";

type StoreItem = {
  id: string;
  code: string;
  name: string;
};

type AtcItem = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export default function ClientCreateForm({
  distributorId,
  stores,
  atcs,
  onSuccess,
}: {
  distributorId: string;
  stores: StoreItem[];
  atcs: AtcItem[];
  onSuccess?: () => void;
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [storeId, setStoreId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          distributorId,
          code,
          name,
          address,
          postalCode,
          city,
          email,
          phone,
          storeId,
          assignedUserId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Impossible de créer le client.");
        return;
      }

      setSuccessMsg("Client créé avec succès.");
      setCode("");
      setName("");
      setAddress("");
      setPostalCode("");
      setCity("");
      setEmail("");
      setPhone("");
      setStoreId("");
      setAssignedUserId("");

      onSuccess?.();
    } catch {
      setErrorMsg("Erreur réseau ou serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="page-stack">
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(2,minmax(0,1fr))",
        }}
      >
        <div>
          <label className="label">Code client</label>
          <input
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
        </div>

        <div>
          <label className="label">Nom</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label">Adresse</label>
        <input
          className="input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(3,minmax(0,1fr))",
        }}
      >
        <div>
          <label className="label">Code postal</label>
          <input
            className="input"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Ville</label>
          <input
            className="input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label">Téléphone</label>
        <input
          className="input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(2,minmax(0,1fr))",
        }}
      >
        <div>
          <label className="label">Magasin</label>
          <select
            className="select"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
          >
            <option value="">Aucun</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.code} · {store.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">ATC assigné</label>
          <select
            className="select"
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
          >
            <option value="">Aucun</option>
            {atcs.map((atc) => (
              <option key={atc.id} value={atc.id}>
                {`${atc.first_name} ${atc.last_name}`.trim()} · {atc.email}
              </option>
            ))}
          </select>
        </div>
      </div>

      {errorMsg ? <div className="alert-error">{errorMsg}</div> : null}
      {successMsg ? <div className="alert-success">{successMsg}</div> : null}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer le client"}
        </button>
      </div>
    </form>
  );
}