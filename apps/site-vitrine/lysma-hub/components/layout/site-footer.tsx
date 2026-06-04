import { lysmaMainNavigation } from "../../lib/navigation";

const facebookUrl = "https://www.facebook.com/share/1FtxStX79R/?mibextid=wwXIfr";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="lysma-site-footer">
      <div>
        <strong>LYSMA Solutions</strong>
        <p>Sites vitrines, applications métier et solutions numériques utiles.</p>
        <small>
          <a href="/mentions-legales" aria-label="Mentions légales LYSMA Solutions">
            ©
          </a>{" "}
          {currentYear} LYSMA Solutions. Tous droits réservés.
        </small>
      </div>
      <nav aria-label="Navigation secondaire">
        {lysmaMainNavigation.slice(0, 6).map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
        <a href="/mentions-legales">Mentions légales</a>
        <a href="/confidentialite-cookies">Confidentialité</a>
      </nav>
      <a className="lysma-social-link" href={facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook LYSMA Solutions">
        <img src="/facebook-logo.png" alt="" aria-hidden="true" />
        <span>Facebook</span>
      </a>
    </footer>
  );
}
