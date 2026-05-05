"use client";

import type { CSSProperties } from "react";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, ChevronLeft, ChevronRight, Check, X, Package, Tag, AlertCircle, CheckCircle, Clock, Trash2, FileText } from "lucide-react";

type Product = {
  id:          string;
  reference:   string;
  designation: string;
  price_ht:    number | null;
  unit:        string | null;
  stock:       number | null;
  dispo_label: string | null; // 'en_stock' | 'sur_commande' | 'indisponible' | null
  brand:       string | null;
  family:      string | null;
  description: string | null;
  billing_code: string | null;
};

type CartItem = { product: Product; qty: number };

type Props = {
  distributorSlug: string;
  products:        Product[];
  families:        string[];
};

const DISPO_CONFIG = {
  en_stock:      { label: "En stock",       color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0", Icon: CheckCircle },
  sur_commande:  { label: "Sur commande",   color: "#b45309", bg: "#fffbeb", border: "#fde68a", Icon: Clock       },
  indisponible:  { label: "Indisponible",   color: "#dc2626", bg: "#fef2f2", border: "#fecaca", Icon: AlertCircle },
};

const fmt = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CatalogueView({ distributorSlug, products, families }: Props) {
  const router = useRouter();

  const [search,       setSearch]       = useState("");
  const [activeFamily, setActiveFamily] = useState<string | null>(null);
  const [cart,         setCart]         = useState<CartItem[]>([]);
  const [cartOpen,     setCartOpen]     = useState(false);
  const [activeIdx,    setActiveIdx]    = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filtrer
  const filtered = products.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q || p.reference.toLowerCase().includes(q) || p.designation.toLowerCase().includes(q) || (p.brand ?? "").toLowerCase().includes(q);
    const matchFamily = !activeFamily || p.family === activeFamily;
    return matchSearch && matchFamily;
  });

  const totalCart = cart.reduce((s, i) => s + i.qty, 0);

  function addToCart(product: Product) {
    setCart((prev) => {
      const exists = prev.find((i) => i.product.id === product.id);
      if (exists) return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
  }

  function removeFromCart(id: string) { setCart((p) => p.filter((i) => i.product.id !== id)); }
  function updateQty(id: string, qty: number) {
    if (qty <= 0) return removeFromCart(id);
    setCart((p) => p.map((i) => i.product.id === id ? { ...i, qty } : i));
  }

  function scrollCards(dir: "left" | "right") {
    if (!scrollRef.current) return;
    const w = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({ left: dir === "left" ? -w * 0.8 : w * 0.8, behavior: "smooth" });
  }

  function createBonFromCart() {
    const lines = cart.map((i) => ({
      reference: i.product.reference || "",
      billing_code: i.product.billing_code || "",
      designation: i.product.designation || "",
      quantity: i.qty,
      unit_price: i.product.price_ht ?? "",
    }));

    sessionStorage.setItem("catalogue_cart", JSON.stringify(lines));

    router.push(`/${distributorSlug}/atc/bons/new?from=catalogue`);
  }

  const totalHT = cart.reduce((s, i) => s + (i.product.price_ht ?? 0) * i.qty, 0);
  const hasPrice = cart.some((i) => i.product.price_ht !== null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "relative" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p style={{ margin: "0 0 0.25rem", fontSize: "0.72rem", fontWeight: 800, color: "#0a4d9b", textTransform: "uppercase", letterSpacing: "0.1em" }}>ATC · Catalogue</p>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>Catalogue produits</h1>
        </div>
        {/* Bouton panier */}
        <button type="button" onClick={() => setCartOpen(true)}
          style={{ position: "relative", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", borderRadius: "0.875rem", background: totalCart > 0 ? "linear-gradient(135deg,#0a4d9b,#1e73d8)" : "rgba(255,255,255,0.8)", border: totalCart > 0 ? "none" : "1px solid #dce5f0", color: totalCart > 0 ? "#fff" : "#334155", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", boxShadow: totalCart > 0 ? "0 8px 20px rgba(10,77,155,0.25)" : "none", transition: "all 0.15s" }}>
          <ShoppingCart size={18} strokeWidth={2} />
          <span>Panier</span>
          {totalCart > 0 && (
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "22px", height: "22px", borderRadius: "999px", background: "rgba(255,255,255,0.25)", fontSize: "0.75rem", fontWeight: 800, padding: "0 0.3rem" }}>{totalCart}</span>
          )}
        </button>
      </div>

      {/* Barre recherche + familles */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {/* Recherche */}
        <div style={{ position: "relative" }}>
          <Search size={16} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input style={{ width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem", borderRadius: "0.875rem", border: "1px solid #dce5f0", background: "rgba(255,255,255,0.92)", fontSize: "0.875rem", color: "#0f172a", outline: "none", boxSizing: "border-box" }}
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par référence, désignation, marque..." autoComplete="off" />
          {search && (
            <button type="button" onClick={() => setSearch("")} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Familles */}
        {families.length > 0 && (
          <div style={{ display: "flex", gap: "0.375rem", overflowX: "auto", paddingBottom: "0.25rem", scrollbarWidth: "none" }}>
            <button type="button" onClick={() => setActiveFamily(null)}
              style={{ flexShrink: 0, padding: "0.4rem 0.875rem", borderRadius: "999px", border: "1px solid", borderColor: !activeFamily ? "#0a4d9b" : "#dce5f0", background: !activeFamily ? "rgba(10,77,155,0.08)" : "rgba(255,255,255,0.8)", color: !activeFamily ? "#0a4d9b" : "#6b7280", fontWeight: !activeFamily ? 700 : 500, fontSize: "0.78rem", cursor: "pointer", whiteSpace: "nowrap" }}>
              Tout
            </button>
            {families.map((f) => (
              <button key={f} type="button" onClick={() => setActiveFamily(f === activeFamily ? null : f)}
                style={{ flexShrink: 0, padding: "0.4rem 0.875rem", borderRadius: "999px", border: "1px solid", borderColor: activeFamily === f ? "#0a4d9b" : "#dce5f0", background: activeFamily === f ? "rgba(10,77,155,0.08)" : "rgba(255,255,255,0.8)", color: activeFamily === f ? "#0a4d9b" : "#6b7280", fontWeight: activeFamily === f ? 700 : 500, fontSize: "0.78rem", cursor: "pointer", whiteSpace: "nowrap" }}>
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Résultats */}
      <p style={{ margin: 0, fontSize: "0.78rem", color: "#94a3b8", fontWeight: 600 }}>
        {filtered.length} produit{filtered.length !== 1 ? "s" : ""}{search ? ` pour "${search}"` : ""}
      </p>

      {/* Carousel de produits */}
      {filtered.length === 0 ? (
        <div style={{ padding: "3rem", textAlign: "center", borderRadius: "1.25rem", background: "rgba(255,255,255,0.75)", border: "1px solid rgba(217,227,240,0.9)" }}>
          <Package size={36} color="#94a3b8" style={{ marginBottom: "0.75rem" }} />
          <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>Aucun produit trouvé</p>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem", color: "#6b7280" }}>Modifiez votre recherche ou changez de famille.</p>
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          {/* Flèche gauche */}
          <button type="button" onClick={() => scrollCards("left")}
            style={{ position: "absolute", left: "-16px", top: "50%", transform: "translateY(-50%)", zIndex: 10, width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.95)", border: "1px solid #dce5f0", boxShadow: "0 4px 12px rgba(15,23,42,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={18} color="#334155" />
          </button>

          {/* Scroll horizontal */}
          <div ref={scrollRef} style={{ display: "flex", gap: "1rem", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "0.5rem", scrollbarWidth: "none", cursor: "grab" }}>
            {filtered.map((product) => {
              const inCart   = cart.find((i) => i.product.id === product.id);
              const dispoKey = product.dispo_label as keyof typeof DISPO_CONFIG | null;
              const dispo    = dispoKey ? DISPO_CONFIG[dispoKey] : null;
              return (
                <div key={product.id} style={{ flexShrink: 0, width: "260px", scrollSnapAlign: "start", padding: "1.25rem", borderRadius: "1.25rem", background: inCart ? "rgba(239,246,255,0.8)" : "rgba(255,255,255,0.85)", border: `1px solid ${inCart ? "#bfdbfe" : "rgba(217,227,240,0.9)"}`, boxShadow: "0 4px 16px rgba(15,23,42,0.04)", display: "flex", flexDirection: "column", gap: "0.75rem", transition: "all 0.15s" }}>

                  {/* Header carte */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                    <div style={{ flex: 1 }}>
                      {product.brand && <p style={{ margin: "0 0 0.2rem", fontSize: "0.65rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{product.brand}</p>}
                      <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, color: "#0a4d9b", fontFamily: "monospace" }}>{product.reference}</p>
                    </div>
                    {dispo && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.2rem 0.5rem", borderRadius: "999px", fontSize: "0.62rem", fontWeight: 700, background: dispo.bg, color: dispo.color, border: `1px solid ${dispo.border}`, flexShrink: 0 }}>
                        <dispo.Icon size={10} strokeWidth={2.5} />
                        {dispo.label}
                      </span>
                    )}
                  </div>

                  {/* Désignation */}
                  <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#0f172a", lineHeight: 1.4, flexGrow: 1 }}>{product.designation}</p>

                  {/* Description courte */}
                  {product.description && (
                    <p style={{ margin: 0, fontSize: "0.72rem", color: "#6b7280", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.description}</p>
                  )}

                  {/* Prix */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem" }}>
                    {product.price_ht !== null ? (
                      <>
                        <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>{fmt(product.price_ht)}</span>
                        <span style={{ fontSize: "0.72rem", color: "#6b7280", fontWeight: 600 }}>€ HT{product.unit ? ` / ${product.unit}` : ""}</span>
                      </>
                    ) : (
                      <span style={{ fontSize: "0.78rem", color: "#94a3b8", fontStyle: "italic" }}>Prix sur demande</span>
                    )}
                  </div>

                  {/* Bouton panier */}
                  {inCart ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button type="button" onClick={() => updateQty(product.id, inCart.qty - 1)} style={{ width: "32px", height: "32px", borderRadius: "0.5rem", background: "rgba(10,77,155,0.1)", border: "none", color: "#0a4d9b", fontSize: "1rem", cursor: "pointer", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                      <span style={{ flex: 1, textAlign: "center", fontSize: "0.875rem", fontWeight: 800, color: "#0a4d9b" }}>{inCart.qty}</span>
                      <button type="button" onClick={() => updateQty(product.id, inCart.qty + 1)} style={{ width: "32px", height: "32px", borderRadius: "0.5rem", background: "rgba(10,77,155,0.1)", border: "none", color: "#0a4d9b", fontSize: "1rem", cursor: "pointer", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                      <button type="button" onClick={() => removeFromCart(product.id)} style={{ width: "32px", height: "32px", borderRadius: "0.5rem", background: "rgba(220,38,38,0.08)", border: "none", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Trash2 size={14} strokeWidth={2} />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => addToCart(product)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", padding: "0.625rem", borderRadius: "0.75rem", background: "linear-gradient(135deg,#0a4d9b,#1e73d8)", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                      <ShoppingCart size={15} strokeWidth={2} />
                      Ajouter au panier
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Flèche droite */}
          <button type="button" onClick={() => scrollCards("right")}
            style={{ position: "absolute", right: "-16px", top: "50%", transform: "translateY(-50%)", zIndex: 10, width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.95)", border: "1px solid #dce5f0", boxShadow: "0 4px 12px rgba(15,23,42,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronRight size={18} color="#334155" />
          </button>
        </div>
      )}

      {/* Drawer panier */}
      {cartOpen && (
        <>
          <div onClick={() => setCartOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.35)", zIndex: 40, backdropFilter: "blur(2px)" }} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px,100vw)", zIndex: 50, background: "#f8fafc", boxShadow: "-8px 0 40px rgba(15,23,42,0.12)", display: "flex", flexDirection: "column" }}>

            {/* Header panier */}
            <div style={{ padding: "1.5rem 1.75rem", borderBottom: "1px solid rgba(217,227,240,0.8)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <ShoppingCart size={20} color="#0a4d9b" strokeWidth={2} />
                <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 800, color: "#0f172a" }}>Panier</h2>
                {totalCart > 0 && <span style={{ padding: "0.2rem 0.5rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 800, background: "rgba(10,77,155,0.1)", color: "#0a4d9b" }}>{totalCart} article{totalCart > 1 ? "s" : ""}</span>}
              </div>
              <button type="button" onClick={() => setCartOpen(false)} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.8)", border: "1px solid #dce5f0", color: "#6b7280", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={16} />
              </button>
            </div>

            {/* Items panier */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.75rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {cart.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "0.75rem", color: "#94a3b8" }}>
                  <ShoppingCart size={36} strokeWidth={1.5} />
                  <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600 }}>Panier vide</p>
                  <p style={{ margin: 0, fontSize: "0.78rem" }}>Ajoutez des produits depuis le catalogue.</p>
                </div>
              ) : cart.map((item) => (
                <div key={item.product.id} style={{ padding: "0.875rem 1rem", borderRadius: "0.875rem", background: "#fff", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 0.15rem", fontSize: "0.72rem", fontWeight: 700, color: "#0a4d9b", fontFamily: "monospace" }}>{item.product.reference}</p>
                      <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 600, color: "#0f172a", lineHeight: 1.3 }}>{item.product.designation}</p>
                      {item.product.price_ht !== null && (
                        <p style={{ margin: "0.25rem 0 0", fontSize: "0.72rem", color: "#6b7280" }}>{fmt(item.product.price_ht)} € HT × {item.qty} = <strong style={{ color: "#0f172a" }}>{fmt(item.product.price_ht * item.qty)} € HT</strong></p>
                      )}
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.product.id)} style={{ flexShrink: 0, width: "28px", height: "28px", borderRadius: "50%", background: "rgba(220,38,38,0.07)", border: "none", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Trash2 size={13} strokeWidth={2} />
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.625rem" }}>
                    <button type="button" onClick={() => updateQty(item.product.id, item.qty - 1)} style={{ width: "28px", height: "28px", borderRadius: "0.5rem", background: "rgba(10,77,155,0.08)", border: "none", color: "#0a4d9b", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ minWidth: "2rem", textAlign: "center", fontSize: "0.875rem", fontWeight: 800, color: "#0f172a" }}>{item.qty}</span>
                    <button type="button" onClick={() => updateQty(item.product.id, item.qty + 1)} style={{ width: "28px", height: "28px", borderRadius: "0.5rem", background: "rgba(10,77,155,0.08)", border: "none", color: "#0a4d9b", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer panier */}
            {cart.length > 0 && (
              <div style={{ padding: "1.25rem 1.75rem", borderTop: "1px solid rgba(217,227,240,0.8)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {hasPrice && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "0.82rem", color: "#6b7280", fontWeight: 600 }}>Total estimé HT</span>
                    <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>{fmt(totalHT)} €</span>
                  </div>
                )}
                <button type="button" onClick={createBonFromCart}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", padding: "0.875rem", borderRadius: "0.875rem", background: "linear-gradient(135deg,#0a4d9b,#1e73d8)", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", boxShadow: "0 8px 20px rgba(10,77,155,0.25)" }}>
                  <FileText size={18} strokeWidth={2} />
                  Créer un bon depuis le panier
                </button>
                <button type="button" onClick={() => setCart([])}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", padding: "0.625rem", borderRadius: "0.875rem", background: "none", border: "1px solid #dce5f0", color: "#dc2626", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}>
                  <Trash2 size={14} strokeWidth={2} />
                  Vider le panier
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}