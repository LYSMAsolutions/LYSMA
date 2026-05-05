"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-xl bg-[#0A4D9B] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#084384]"
    >
      Déconnexion
    </button>
  );
}