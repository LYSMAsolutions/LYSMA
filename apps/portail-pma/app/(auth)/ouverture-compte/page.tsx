import Link from "next/link";
import OpenAccountForm from "@/components/public/OpenAccountForm";

export default function OpenAccountPage() {
  return (
    <main className="auth-shell">
      <div className="odc-container">
        <div className="odc-left">
          <div className="max-w-[260px] -mt-[60px]">
            <img
              src="/logo-lysma.png"
              alt="LYSMA"
              className="w-[250px] h-auto block"
            />

            <h1 className="mt-8 text-[2rem] font-semibold leading-tight tracking-tight text-[#0F172A]">
              Demande d’ouverture
            </h1>

            <p className="mt-4 text-[15px] leading-8 text-[#6B7280]">
              Demandez l’ouverture de votre accès au Portail PMA.
            </p>

            <div className="mt-8 space-y-3 text-sm text-[#5F6F89]">
              <div className="card-soft px-4 py-3">
                Étude rapide de votre demande
              </div>
              <div className="card-soft px-4 py-3">
                Configuration adaptée à votre structure
              </div>
            </div>

            <div className="mt-8 text-sm text-[#6B7280]">
              <span>Déjà un compte ? </span>
              <Link href="/login" className="link-lysma">
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>

        <div className="odc-right">
          <div className="card-lysma odc-form-card">
            <div className="text-center">
             
              <h2 className="mt-5 text-[2.2rem] font-semibold tracking-tight text-[#0F172A]">
                Ouvrir un compte
              </h2>

              <p className="mt-3 text-[15px] leading-7 text-[#6B7280]">
                Remplissez les informations principales de votre structure.
              </p>
            </div>

            <div className="mt-8">
              <OpenAccountForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}