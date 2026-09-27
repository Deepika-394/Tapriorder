import React, { useState, useMemo } from "react";
import { Plus, Minus, ShoppingBag, X, Flame, Leaf } from "lucide-react";

/* ============================================================
   STEP 1 — DATA
   Menu items for an Indian street-food stall ("Tapri").
   spice: 0-3 chilies. veg: true/false drives the dot marker.
   ============================================================ */
const CATEGORIES = ["Chaat", "Rolls", "Curries", "Drinks", "Sweets"];

const MENU = [
  { id: 1, name: "Pani Puri", desc: "Crisp puris, tangy tamarind water, spiced potato", price: 60, category: "Chaat", veg: true, spice: 2, emoji: "🥟" },
  { id: 2, name: "Bhel Puri", desc: "Puffed rice, sev, onion, mint chutney", price: 70, category: "Chaat", veg: true, spice: 1, emoji: "🍿" },
  { id: 3, name: "Aloo Tikki Chaat", desc: "Pan-fried potato patties, yogurt, chutneys", price: 80, category: "Chaat", veg: true, spice: 2, emoji: "🥔" },
  { id: 4, name: "Paneer Tikka Roll", desc: "Char-grilled paneer, mint chutney, paratha", price: 130, category: "Rolls", veg: true, spice: 2, emoji: "🌯" },
  { id: 5, name: "Chicken Seekh Roll", desc: "Minced chicken skewer, onion, paratha", price: 150, category: "Rolls", veg: false, spice: 3, emoji: "🌯" },
  { id: 6, name: "Egg Roll", desc: "Double egg, spiced onion, paratha", price: 100, category: "Rolls", veg: false, spice: 1, emoji: "🥚" },
  { id: 7, name: "Pav Bhaji", desc: "Buttered pav, mashed mixed-veg bhaji", price: 110, category: "Curries", veg: true, spice: 2, emoji: "🍛" },
  { id: 8, name: "Chicken Curry", desc: "Slow-cooked masala curry, steamed rice", price: 180, category: "Curries", veg: false, spice: 3, emoji: "🍗" },
  { id: 9, name: "Dal Makhani", desc: "Black lentils, butter, cream, slow smoked", price: 140, category: "Curries", veg: true, spice: 1, emoji: "🍲" },
  { id: 10, name: "Masala Chai", desc: "Cardamom, ginger, hand-frothed", price: 25, category: "Drinks", veg: true, spice: 0, emoji: "☕" },
  { id: 11, name: "Sugarcane Juice", desc: "Fresh pressed, lime, mint", price: 40, category: "Drinks", veg: true, spice: 0, emoji: "🥤" },
  { id: 12, name: "Nimbu Soda", desc: "Salted or sweet, fizzed to order", price: 30, category: "Drinks", veg: true, spice: 0, emoji: "🍋" },
  { id: 13, name: "Gulab Jamun", desc: "Milk dumplings, cardamom syrup", price: 60, category: "Sweets", veg: true, spice: 0, emoji: "🍮" },
  { id: 14, name: "Kulfi Stick", desc: "Pistachio, slow-churned, frozen on the spot", price: 50, category: "Sweets", veg: true, spice: 0, emoji: "🍡" },
];

export default function TapriOrder() {
  /* ============================================================
     STEP 2 — STATE
     activeCategory: which tab is selected
     cart: { [itemId]: qty }
     ticketOpen: whether the order-ticket panel is showing
     ============================================================ */
  const [activeCategory, setActiveCategory] = useState("Chaat");
  const [cart, setCart] = useState({});
  const [ticketOpen, setTicketOpen] = useState(false);

  /* ============================================================
     STEP 3 — DERIVED VALUES
     ============================================================ */
  const visibleItems = useMemo(
    () => MENU.filter((item) => item.category === activeCategory),
    [activeCategory]
  );

  const cartLines = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({ item: MENU.find((m) => m.id === Number(id)), qty })),
    [cart]
  );

  const cartCount = cartLines.reduce((sum, l) => sum + l.qty, 0);
  const cartTotal = cartLines.reduce((sum, l) => sum + l.qty * l.item.price, 0);

  /* ============================================================
     STEP 4 — ACTIONS
     ============================================================ */
  const addItem = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeItem = (id) =>
    setCart((c) => ({ ...c, [id]: Math.max((c[id] || 0) - 1, 0) }));

  /* ============================================================
     STEP 5 — RENDER
     Header -> Category tabs -> Menu grid -> Floating ticket tab -> Order ticket panel
     ============================================================ */
  return (
    <div className="tapri-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');

        .tapri-root {
          --charcoal: #1C1410;
          --charcoal-2: #241A14;
          --cream: #F3EAD8;
          --cream-dim: #C9BBA3;
          --marigold: #E8A23D;
          --chili: #C0392B;
          --turmeric: #D9A404;
          --olive: #6B7A4F;
          font-family: 'Inter', sans-serif;
          background: var(--charcoal);
          color: var(--cream);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }
        .tapri-root * { box-sizing: border-box; }
        .font-display { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        .grain {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.05;
          background-image: radial-gradient(circle, #fff 1px, transparent 1px);
          background-size: 3px 3px;
        }

        .header {
          padding: 28px 24px 20px;
          border-bottom: 1px solid rgba(243,234,216,0.1);
          display: flex; align-items: center; justify-content: space-between;
        }
        .logo-mark {
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--marigold); color: var(--charcoal);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Fraunces', serif; font-weight: 700; font-size: 19px;
        }
        .logo-row { display: flex; align-items: center; gap: 12px; }
        .logo-title { font-size: 22px; font-weight: 700; letter-spacing: 0.02em; }
        .logo-sub { font-size: 11px; color: var(--cream-dim); letter-spacing: 0.12em; text-transform: uppercase; }

        .cart-btn {
          position: relative; background: transparent; border: 1px solid rgba(243,234,216,0.25);
          border-radius: 999px; width: 44px; height: 44px; display: flex; align-items: center;
          justify-content: center; color: var(--cream); cursor: pointer; transition: border-color 0.15s;
        }
        .cart-btn:hover { border-color: var(--marigold); }
        .cart-badge {
          position: absolute; top: -6px; right: -6px; background: var(--chili); color: var(--cream);
          font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700;
          min-width: 18px; height: 18px; border-radius: 999px; display: flex; align-items: center;
          justify-content: center; padding: 0 4px;
        }

        .tabs { display: flex; gap: 8px; padding: 20px 24px 4px; overflow-x: auto; }
        .tab {
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.03em;
          padding: 9px 18px; border-radius: 999px; border: 1px solid rgba(243,234,216,0.15);
          background: transparent; color: var(--cream-dim); cursor: pointer; white-space: nowrap;
          transition: all 0.15s;
        }
        .tab.active { background: var(--marigold); border-color: var(--marigold); color: var(--charcoal); }
        .tab:not(.active):hover { border-color: var(--cream-dim); color: var(--cream); }

        .menu-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px; padding: 20px 24px 100px;
        }
        .dish-card {
          background: var(--charcoal-2); border: 1px solid rgba(243,234,216,0.08);
          border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: 10px;
          transition: border-color 0.15s;
        }
        .dish-card:hover { border-color: rgba(232,162,61,0.4); }
        .dish-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
        .dish-emoji { font-size: 28px; line-height: 1; }
        .veg-dot {
          width: 14px; height: 14px; border: 1.5px solid var(--olive); border-radius: 3px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 3px;
        }
        .veg-dot.non-veg { border-color: var(--chili); }
        .veg-dot::after { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--olive); }
        .veg-dot.non-veg::after { background: var(--chili); }

        .dish-name { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; }
        .dish-desc { font-size: 12.5px; color: var(--cream-dim); line-height: 1.4; min-height: 34px; }

        .dish-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
        .dish-price { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700; color: var(--turmeric); }
        .spice-row { display: flex; gap: 2px; }

        .qty-control {
          display: flex; align-items: center; gap: 10px; background: rgba(232,162,61,0.12);
          border-radius: 999px; padding: 4px;
        }
        .qty-btn {
          width: 26px; height: 26px; border-radius: 50%; border: none; background: var(--marigold);
          color: var(--charcoal); display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .qty-btn.ghost { background: transparent; border: 1px solid rgba(243,234,216,0.3); color: var(--cream); }
        .qty-val { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; min-width: 14px; text-align: center; }
        .add-btn {
          background: var(--marigold); color: var(--charcoal); border: none; border-radius: 999px;
          width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;
        }

        /* --- Signature element: perforated order-ticket cart --- */
        .ticket-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 40;
          opacity: 0; pointer-events: none; transition: opacity 0.2s;
        }
        .ticket-overlay.open { opacity: 1; pointer-events: auto; }

        .ticket-panel {
          position: fixed; top: 0; right: 0; height: 100%; width: min(380px, 92vw);
          background: #EDE3CC; color: #1C1410; z-index: 50;
          transform: translateX(100%); transition: transform 0.25s ease; display: flex; flex-direction: column;
          box-shadow: -20px 0 40px rgba(0,0,0,0.4);
        }
        .ticket-panel.open { transform: translateX(0); }
        .ticket-panel::before {
          content: ''; position: absolute; left: -8px; top: 0; bottom: 0; width: 16px;
          background-image: radial-gradient(circle, var(--charcoal) 5px, transparent 5.5px);
          background-size: 16px 22px; background-repeat: repeat-y;
        }
        .ticket-head {
          padding: 24px 26px 14px; border-bottom: 1.5px dashed rgba(28,20,16,0.3);
          display: flex; align-items: center; justify-content: space-between;
        }
        .ticket-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; }
        .ticket-sub { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: #6b5f4d; letter-spacing: 0.06em; margin-top: 2px; }
        .ticket-close { background: none; border: none; cursor: pointer; color: #1C1410; }

        .ticket-body { flex: 1; overflow-y: auto; padding: 16px 26px; }
        .ticket-line { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px dotted rgba(28,20,16,0.2); gap: 10px; }
        .ticket-line-name { font-family: 'Fraunces', serif; font-size: 14.5px; font-weight: 600; }
        .ticket-line-price { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: #6b5f4d; }
        .ticket-line-total { font-family: 'JetBrains Mono', monospace; font-size: 13.5px; font-weight: 700; min-width: 56px; text-align: right; }

        .ticket-empty { text-align: center; padding: 60px 20px; color: #6b5f4d; }

        .ticket-foot { padding: 18px 26px 26px; border-top: 1.5px dashed rgba(28,20,16,0.3); }
        .ticket-total-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; }
        .ticket-total-label { font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: #6b5f4d; }
        .ticket-total-val { font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 700; }
        .checkout-btn {
          width: 100%; padding: 14px; background: var(--chili); color: #F3EAD8; border: none;
          border-radius: 10px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14.5px;
          cursor: pointer; letter-spacing: 0.02em;
        }
        .checkout-btn:disabled { background: #b8ab90; cursor: not-allowed; }

        @media (max-width: 600px) {
          .menu-grid { grid-template-columns: 1fr; padding: 16px 16px 100px; }
          .header { padding: 20px 16px 16px; }
          .tabs { padding: 16px 16px 4px; }
        }
      `}</style>
      <div className="grain" />

      {/* Header */}
      <header className="header">
        <div className="logo-row">
          <div className="logo-mark">T</div>
          <div>
            <div className="logo-title">Tapri</div>
            <div className="logo-sub">Roadside &amp; Ready</div>
          </div>
        </div>
        <button className="cart-btn" onClick={() => setTicketOpen(true)} aria-label="Open order ticket">
          <ShoppingBag size={19} strokeWidth={2} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </header>

      {/* Category tabs */}
      <nav className="tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`tab ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* Menu grid */}
      <main className="menu-grid">
        {visibleItems.map((item) => {
          const qty = cart[item.id] || 0;
          return (
            <div className="dish-card" key={item.id}>
              <div className="dish-top">
                <span className="dish-emoji">{item.emoji}</span>
                <span className={`veg-dot ${item.veg ? "" : "non-veg"}`} title={item.veg ? "Veg" : "Non-veg"} />
              </div>
              <div>
                <div className="dish-name">{item.name}</div>
                <div className="dish-desc">{item.desc}</div>
              </div>
              <div className="dish-bottom">
                <div>
                  <div className="dish-price">₹{item.price}</div>
                  <div className="spice-row">
                    {[...Array(3)].map((_, i) => (
                      <Flame
                        key={i}
                        size={11}
                        color={i < item.spice ? "#C0392B" : "rgba(243,234,216,0.15)"}
                        fill={i < item.spice ? "#C0392B" : "none"}
                      />
                    ))}
                  </div>
                </div>
                {qty === 0 ? (
                  <button className="add-btn" onClick={() => addItem(item.id)} aria-label={`Add ${item.name}`}>
                    <Plus size={17} strokeWidth={2.5} />
                  </button>
                ) : (
                  <div className="qty-control">
                    <button className="qty-btn ghost" onClick={() => removeItem(item.id)} aria-label="Decrease quantity">
                      <Minus size={13} strokeWidth={2.5} />
                    </button>
                    <span className="qty-val">{qty}</span>
                    <button className="qty-btn" onClick={() => addItem(item.id)} aria-label="Increase quantity">
                      <Plus size={13} strokeWidth={2.5} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </main>

      {/* Order ticket (cart) */}
      <div className={`ticket-overlay ${ticketOpen ? "open" : ""}`} onClick={() => setTicketOpen(false)} />
      <aside className={`ticket-panel ${ticketOpen ? "open" : ""}`}>
        <div className="ticket-head">
          <div>
            <div className="ticket-title">Order Ticket</div>
            <div className="ticket-sub">TABLE • TAKEAWAY</div>
          </div>
          <button className="ticket-close" onClick={() => setTicketOpen(false)} aria-label="Close ticket">
            <X size={20} />
          </button>
        </div>

        <div className="ticket-body">
          {cartLines.length === 0 ? (
            <div className="ticket-empty">
              <Leaf size={22} style={{ marginBottom: 8, opacity: 0.5 }} />
              <div>Your ticket is empty.<br />Add something from the stall.</div>
            </div>
          ) : (
            cartLines.map(({ item, qty }) => (
              <div className="ticket-line" key={item.id}>
                <div>
                  <div className="ticket-line-name">{item.name}</div>
                  <div className="ticket-line-price">₹{item.price} × {qty}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="qty-control" style={{ background: "rgba(28,20,16,0.08)" }}>
                    <button className="qty-btn ghost" style={{ borderColor: "rgba(28,20,16,0.3)", color: "#1C1410" }} onClick={() => removeItem(item.id)}>
                      <Minus size={12} strokeWidth={2.5} />
                    </button>
                    <span className="qty-val">{qty}</span>
                    <button className="qty-btn" onClick={() => addItem(item.id)}>
                      <Plus size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                  <span className="ticket-line-total">₹{item.price * qty}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="ticket-foot">
          <div className="ticket-total-row">
            <span className="ticket-total-label">Total</span>
            <span className="ticket-total-val">₹{cartTotal}</span>
          </div>
          <button className="checkout-btn" disabled={cartLines.length === 0}>
            {cartLines.length === 0 ? "Add items to order" : "Send to kitchen"}
          </button>
        </div>
      </aside>
    </div>
  );
}