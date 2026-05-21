import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import AdminModulePage from "@/components/admin/layout/AdminModulePage";

function splitLines(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

async function saveContractTemplateAction(formData: FormData) {
  "use server";

  const distributorSlug = String(formData.get("distributorSlug") || "");
  const user = await requireAccess({ allowedRoles: ["admin"], distributorSlug });

  const name = String(formData.get("name") || "Contrat maintenance").trim();
  const sections = splitLines(formData.get("sections")).map((text, index) => ({
    order: index + 1,
    text,
  }));
  const tarifs = splitLines(formData.get("tarifs")).map((text, index) => ({
    order: index + 1,
    text,
  }));
  const conditions = String(formData.get("conditions") || "").trim();

  if (!name) {
    throw new Error("Le nom du modele est obligatoire.");
  }

  await prisma.maintenance_contract_templates.upsert({
    where: {
      distributor_id_name: {
        distributor_id: user.distributorId,
        name,
      },
    },
    create: {
      distributor_id: user.distributorId,
      name,
      sections,
      tarifs,
      conditions: conditions || null,
      is_active: true,
    },
    update: {
      sections,
      tarifs,
      conditions: conditions || null,
      is_active: true,
      updated_at: new Date(),
    },
  });

  revalidatePath(`/${user.distributorSlug}/admin/contrats-maintenance`);
}

function linesFromJson(value: unknown) {
  if (!Array.isArray(value)) return "";
  return value
    .map((item: any) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "text" in item) {
        return String((item as { text?: unknown }).text || "");
      }
      return "";
    })
    .filter(Boolean)
    .join("\n");
}

export default async function AdminContratsMaintenancePage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const user = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });
  const adminBase = `/${user.distributorSlug}/admin`;

  const template = await prisma.maintenance_contract_templates.findFirst({
    where: { distributor_id: user.distributorId, is_active: true },
    orderBy: { updated_at: "desc" },
  });

  return (
    <AdminModulePage
      badge="SAV - Contrats"
      title="Contrats de maintenance"
      description="Modele prive du distributeur : lignes, tarifs par materiel et conditions."
      backHref={adminBase}
    >
      <section className="card-lysma" style={{ padding: "2rem" }}>
        <form action={saveContractTemplateAction} className="page-stack">
          <input type="hidden" name="distributorSlug" value={user.distributorSlug} />

          <div>
            <label className="label">Nom du modele</label>
            <input className="input" name="name" defaultValue={template?.name || "Contrat maintenance"} />
          </div>

          <div>
            <label className="label">Lignes du contrat</label>
            <textarea
              className="textarea"
              name="sections"
              rows={8}
              defaultValue={linesFromJson(template?.sections)}
              placeholder={"Une ligne par engagement, prestation ou clause metier"}
            />
          </div>

          <div>
            <label className="label">Tarifs / materiels</label>
            <textarea
              className="textarea"
              name="tarifs"
              rows={7}
              defaultValue={linesFromJson(template?.tarifs)}
              placeholder={"Ex: Four mixte - 180 EUR HT/an\nEx: Lave-verres - refuse si plus de 10 ans"}
            />
          </div>

          <div>
            <label className="label">Conditions generales</label>
            <textarea
              className="textarea"
              name="conditions"
              rows={8}
              defaultValue={template?.conditions || ""}
              placeholder="Conditions propres au distributeur."
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-primary" type="submit">Enregistrer le modele</button>
          </div>
        </form>
      </section>
    </AdminModulePage>
  );
}
