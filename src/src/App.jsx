import { useState, useEffect } from "react";

// ── Initial Data ──────────────────────────────────────────────────────────────
const INITIAL_PRODUCTS = [
  { id: 1, name: "Swami Dal Makhani", category: "Ready to Eat", price: 120, stock: 50, image: "🫘", description: "Rich, creamy dal slow-cooked overnight with butter & cream." },
  { id: 2, name: "Swami Paneer Masala", category: "Ready to Eat", price: 150, stock: 35, image: "🧀", description: "Soft paneer cubes in a bold, aromatic tomato-onion masala." },
  { id: 3, name: "Swami Chana Masala", category: "Ready to Eat", price: 110, stock: 60, image: "🥘", description: "Hearty chickpeas cooked in tangy spiced gravy." },
  { id: 4, name: "Swami Basmati Rice", category: "Grains", price: 220, stock: 80, image: "🌾", description: "Premium aged basmati — long grain, aromatic, fluffy." },
  { id: 5, name: "Swami Atta (Wheat Flour)", category: "Grains", price: 180, stock: 100, image: "🌽", description: "Stone-ground whole wheat flour for soft rotis every time." },
  { id: 6, name: "Swami Masala Mix", category: "Spices", price: 90, stock: 120, image: "🌶️", description: "Our secret 11-spice blend, perfect for any curry." },
  { id: 7, name: "Swami Ghee (500ml)", category: "Dairy", price: 350, stock: 40, image: "🧈", description: "Pure cow ghee, traditionally churned, rich & aromatic." },
  { id: 8, name: "Swami Pickle (Mango)", category: "Condiments", price: 85, stock: 75, image: "🥭", description: "Tangy raw mango pickle in mustard oil. Sun-dried & matured." },
];

const CATEGORIES = ["All", "Ready to Eat", "Grains", "Spices", "Dairy", "Condiments"];

// ── Utility ───────────────────────────────────────────────────────────────────
const formatINR = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("store"); // "store" | "admin"
  const [adminAuth, setAdminAuth] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2800);
  };

  const addToCart = (product) => {
    if (product.stock === 0) return notify("Out of stock!", "error");
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    notify(`${product.name} added to cart!`);
  };

  const placeOrder = (customerInfo) => {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const newOrder = {
      id: `SF${Date.now().toString().slice(-6)}`,
      customer: customerInfo,
      items: cart,
      total,
      status: "Confirmed",
      date: new Date().toLocaleDateString("en-IN"),
    };
    setOrders((prev) => [newOrder, ...prev]);
    // Deduct stock
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((c) => c.id === p.id);
        return cartItem ? { ...p, stock: Math.max(0, p.stock - cartItem.qty) } : p;
      })
    );
    setCart([]);
    notify("Order placed successfully! 🎉");
    return newOrder.id;
  };

  return (
    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", minHeight: "100vh", background: "#fdf8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --saffron: #E8872A;
          --deep: #8B2500;
          --cream: #fdf8f0;
          --gold: #C9952A;
          --text: #2d1a0e;
          --muted: #7a5c45;
          --white: #ffffff;
          --green: #2d7d46;
          --red: #c0392b;
        }
        body { font-family: 'Lato', sans-serif; }
        .btn { cursor: pointer; border: none; border-radius: 6px; font-family: 'Lato', sans-serif; font-weight: 700; transition: all .2s; }
        .btn-primary { background: var(--saffron); color: white; padding: 10px 22px; }
        .btn-primary:hover { background: var(--deep); transform: translateY(-1px); }
        .btn-outline { background: transparent; border: 2px solid var(--saffron); color: var(--saffron); padding: 8px 18px; }
        .btn-outline:hover { background: var(--saffron); color: white; }
        .btn-sm { padding: 6px 14px; font-size: 13px; }
        input, select, textarea { font-family: 'Lato', sans-serif; border: 1.5px solid #e0cdb8; border-radius: 6px; padding: 9px 13px; outline: none; width: 100%; font-size: 14px; background: white; color: var(--text); }
        input:focus, select:focus, textarea:focus { border-color: var(--saffron); }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: .5px; }
        .badge-green { background: #d4edda; color: #155724; }
        .badge-red { background: #f8d7da; color: #721c24; }
        .badge-yellow { background: #fff3cd; color: #856404; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1e8dc; } ::-webkit-scrollbar-thumb { background: var(--saffron); border-radius: 3px; }
      `}</style>

      {/* Notification */}
      {notification && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          background: notification.type === "error" ? "#c0392b" : "#2d7d46",
          color: "white", padding: "12px 22px", borderRadius: 10,
          fontFamily: "Lato, sans-serif", fontWeight: 700, fontSize: 14,
          boxShadow: "0 4px 20px rgba(0,0,0,.25)", animation: "fadeIn .3s ease"
        }}>
          {notification.msg}
        </div>
      )}

      {view === "store"
        ? <StoreFront products={products} cart={cart} setCart={setCart} addToCart={addToCart} placeOrder={placeOrder} notify={notify} setView={setView} />
        : <AdminPanel products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} adminAuth={adminAuth} setAdminAuth={setAdminAuth} notify={notify} setView={setView} />
      }
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE FRONT
// ═══════════════════════════════════════════════════════════════════════════════
function StoreFront({ products, cart, setCart, addToCart, placeOrder, notify, setView }) {
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);

  const filtered = products.filter((p) => {
    const matchCat = activeCat === "All" || p.category === activeCat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
        .filter((i) => i.qty > 0)
    );
  };
  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const handleOrder = (info) => {
    const oid = placeOrder(info);
    setLastOrderId(oid);
    setShowCheckout(false);
  };

  return (
    <div>
      {/* Hero Nav */}
      <header style={{ background: "linear-gradient(135deg, #8B2500 0%, #E8872A 60%, #C9952A 100%)", color: "white", padding: "0 5%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 38 }}>🪔</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, letterSpacing: 1 }}>SWAMI FOODS</div>
              <div style={{ fontSize: 11, letterSpacing: 3, opacity: .8, fontFamily: "Lato, sans-serif" }}>PURE · FRESH · TRADITIONAL</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,.6)", color: "white", fontSize: 13 }} onClick={() => setShowCart(true)}>
              🛒 Cart {cartCount > 0 && <span style={{ background: "white", color: "#E8872A", borderRadius: "50%", padding: "2px 7px", marginLeft: 6, fontSize: 12, fontWeight: 900 }}>{cartCount}</span>}
            </button>
            <button className="btn" style={{ background: "rgba(255,255,255,.15)", color: "white", border: "1.5px solid rgba(255,255,255,.4)", padding: "8px 16px", borderRadius: 6, fontSize: 13 }} onClick={() => setView("admin")}>
              ⚙️ Admin
            </button>
          </div>
        </div>
        {/* Hero */}
        <div style={{ textAlign: "center", padding: "50px 0 45px" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 14 }}>
            Taste the Tradition,<br />Feel the Purity
          </div>
          <div style={{ fontFamily: "Lato, sans-serif", fontSize: 16, opacity: .85, marginBottom: 28 }}>
            Authentic Indian foods, crafted with love & heritage
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", maxWidth: 480, margin: "0 auto" }}>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" style={{ flex: 1, borderRadius: 8, border: "none", padding: "12px 16px", fontSize: 14 }} />
          </div>
        </div>
      </header>

      {/* Category Bar */}
      <div style={{ background: "white", borderBottom: "1px solid #f0e4d0", padding: "0 5%", display: "flex", gap: 8, overflowX: "auto" }}>
        {CATEGORIES.map((c) => (
          <button key={c} className="btn" onClick={() => setActiveCat(c)}
            style={{ padding: "14px 20px", background: "none", borderRadius: 0, borderBottom: activeCat === c ? "3px solid #E8872A" : "3px solid transparent", color: activeCat === c ? "#E8872A" : "#7a5c45", fontWeight: activeCat === c ? 700 : 400, whiteSpace: "nowrap", fontSize: 14 }}>
            {c}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div style={{ padding: "36px 5%" }}>
        {lastOrderId && (
          <div style={{ background: "#d4edda", border: "1.5px solid #c3e6cb", borderRadius: 10, padding: "14px 22px", marginBottom: 28, color: "#155724", fontFamily: "Lato, sans-serif", fontWeight: 700 }}>
            ✅ Order <strong>{lastOrderId}</strong> confirmed! Thank you for shopping with Swami Foods.
            <button onClick={() => setLastOrderId(null)} style={{ float: "right", background: "none", border: "none", cursor: "pointer", color: "#155724", fontSize: 18 }}>×</button>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
          {filtered.map((p) => <ProductCard key={p.id} product={p} addToCart={addToCart} />)}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#7a5c45", fontFamily: "Lato, sans-serif" }}>
            <div style={{ fontSize: 48 }}>🔍</div>
            <div style={{ fontSize: 18, marginTop: 12 }}>No products found</div>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      {showCart && (
        <Drawer title={`Your Cart (${cartCount})`} onClose={() => setShowCart(false)}>
          {cart.length === 0
            ? <div style={{ textAlign: "center", padding: "40px 0", color: "#7a5c45", fontFamily: "Lato, sans-serif" }}><div style={{ fontSize: 48 }}>🛒</div><div style={{ marginTop: 10 }}>Your cart is empty</div></div>
            : <>
              {cart.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid #f0e4d0" }}>
                  <div style={{ fontSize: 32 }}>{item.image}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15 }}>{item.name}</div>
                    <div style={{ color: "#E8872A", fontWeight: 700, fontFamily: "Lato, sans-serif" }}>{formatINR(item.price)} × {item.qty} = {formatINR(item.price * item.qty)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button className="btn" style={{ background: "#f0e4d0", color: "#2d1a0e", width: 28, height: 28, borderRadius: "50%", fontSize: 16, display: "grid", placeItems: "center" }} onClick={() => updateQty(item.id, -1)}>−</button>
                    <span style={{ fontFamily: "Lato, sans-serif", fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <button className="btn" style={{ background: "#E8872A", color: "white", width: 28, height: 28, borderRadius: "50%", fontSize: 16, display: "grid", placeItems: "center" }} onClick={() => updateQty(item.id, 1)}>+</button>
                    <button className="btn" style={{ background: "#f8d7da", color: "#721c24", width: 28, height: 28, borderRadius: "50%", fontSize: 14, display: "grid", placeItems: "center" }} onClick={() => removeItem(item.id)}>×</button>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: "16px 0", borderTop: "2px solid #E8872A" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>
                  <span>Total</span><span style={{ color: "#E8872A" }}>{formatINR(cartTotal)}</span>
                </div>
                <button className="btn btn-primary" style={{ width: "100%", marginTop: 16, padding: "13px", fontSize: 16 }} onClick={() => { setShowCart(false); setShowCheckout(true); }}>
                  Proceed to Checkout →
                </button>
              </div>
            </>
          }
        </Drawer>
      )}

      {/* Checkout Modal */}
      {showCheckout && <CheckoutModal cart={cart} cartTotal={cartTotal} onPlace={handleOrder} onClose={() => setShowCheckout(false)} />}

      {/* Footer */}
      <footer style={{ background: "#2d1a0e", color: "#e0cdb8", padding: "30px 5%", marginTop: 40, fontFamily: "Lato, sans-serif", textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#E8872A", marginBottom: 8 }}>🪔 SWAMI FOODS</div>
        <div style={{ fontSize: 13, opacity: .7 }}>© 2026 Swami Foods. All rights reserved. | Pure · Fresh · Traditional</div>
      </footer>
    </div>
  );
}

function ProductCard({ product, addToCart }) {
  return (
    <div style={{ background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(139,37,0,.07)", border: "1px solid #f0e4d0", transition: "transform .2s, box-shadow .2s" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(232,135,42,.18)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(139,37,0,.07)"; }}>
      <div style={{ background: "linear-gradient(135deg, #fdf2e4, #fce8d0)", height: 130, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>
        {product.image}
      </div>
      <div style={{ padding: "16px" }}>
        <div style={{ fontSize: 11, color: "#E8872A", fontWeight: 700, letterSpacing: 1, fontFamily: "Lato, sans-serif", marginBottom: 4 }}>{product.category.toUpperCase()}</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, marginBottom: 6, color: "#2d1a0e" }}>{product.name}</div>
        <div style={{ fontSize: 13, color: "#7a5c45", fontFamily: "Lato, sans-serif", lineHeight: 1.5, marginBottom: 12, minHeight: 38 }}>{product.description}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 900, color: "#8B2500" }}>{formatINR(product.price)}</div>
            <div style={{ fontSize: 11, fontFamily: "Lato, sans-serif", color: product.stock > 10 ? "#2d7d46" : product.stock > 0 ? "#856404" : "#721c24", fontWeight: 700 }}>
              {product.stock > 10 ? `✓ In Stock (${product.stock})` : product.stock > 0 ? `⚠ Only ${product.stock} left` : "✗ Out of Stock"}
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => addToCart(product)} disabled={product.stock === 0}
            style={{ opacity: product.stock === 0 ? .5 : 1, cursor: product.stock === 0 ? "not-allowed" : "pointer" }}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckoutModal({ cart, cartTotal, onPlace, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", payment: "Cash on Delivery" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter valid 10-digit number";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => { if (validate()) onPlace(form); };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "white", borderRadius: 16, padding: "30px", width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700 }}>Checkout</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#7a5c45" }}>×</button>
        </div>
        {/* Order summary */}
        <div style={{ background: "#fdf8f0", borderRadius: 10, padding: 14, marginBottom: 20 }}>
          {cart.map((i) => <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontFamily: "Lato, sans-serif", padding: "3px 0" }}>
            <span>{i.image} {i.name} × {i.qty}</span><span style={{ fontWeight: 700 }}>{formatINR(i.price * i.qty)}</span>
          </div>)}
          <div style={{ borderTop: "1px solid #e0cdb8", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
            <span>Total</span><span style={{ color: "#E8872A" }}>{formatINR(cartTotal)}</span>
          </div>
        </div>
        {/* Form */}
        {[["name", "Full Name", "text"], ["phone", "Phone Number", "tel"], ["address", "Delivery Address", "text"], ["city", "City", "text"]].map(([field, label, type]) => (
          <div key={field} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#7a5c45", fontFamily: "Lato, sans-serif", display: "block", marginBottom: 5 }}>{label}</label>
            <input type={type} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} placeholder={label} />
            {errors[field] && <div style={{ color: "#c0392b", fontSize: 11, marginTop: 3, fontFamily: "Lato, sans-serif" }}>{errors[field]}</div>}
          </div>
        ))}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#7a5c45", fontFamily: "Lato, sans-serif", display: "block", marginBottom: 5 }}>Payment Method</label>
          <select value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value })}>
            <option>Cash on Delivery</option>
            <option>UPI / QR Pay</option>
            <option>Bank Transfer</option>
          </select>
        </div>
        <button className="btn btn-primary" style={{ width: "100%", padding: "13px", fontSize: 16 }} onClick={submit}>
          ✓ Place Order — {formatINR(cartTotal)}
        </button>
      </div>
    </div>
  );
}

function Drawer({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 998, display: "flex", justifyContent: "flex-end" }}>
      <div style={{ background: "white", width: "100%", maxWidth: 420, padding: "24px", overflowY: "auto", boxShadow: "-4px 0 24px rgba(0,0,0,.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700 }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#7a5c45" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════════════════
function AdminPanel({ products, setProducts, orders, setOrders, adminAuth, setAdminAuth, notify, setView }) {
  const [tab, setTab] = useState("dashboard");
  const [loginForm, setLoginForm] = useState({ user: "", pass: "" });
  const [loginError, setLoginError] = useState("");

  const handleLogin = () => {
    if (loginForm.user === "swami" && loginForm.pass === "chirayu@1919") {
      setAdminAuth(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Try admin / swami123");
    }
  };

  if (!adminAuth) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #2d1a0e, #8B2500)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "white", borderRadius: 20, padding: "40px", width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,.4)" }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div style={{ fontSize: 48 }}>🪔</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: "#2d1a0e" }}>Admin Login</div>
            <div style={{ fontFamily: "Lato, sans-serif", fontSize: 13, color: "#7a5c45", marginTop: 4 }}>Swami Foods Management</div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#7a5c45", fontFamily: "Lato, sans-serif", display: "block", marginBottom: 5 }}>Username</label>
            <input value={loginForm.user} onChange={(e) => setLoginForm({ ...loginForm, user: e.target.value })} placeholder="admin" onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#7a5c45", fontFamily: "Lato, sans-serif", display: "block", marginBottom: 5 }}>Password</label>
            <input type="password" value={loginForm.pass} onChange={(e) => setLoginForm({ ...loginForm, pass: e.target.value })} placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
          </div>
          {loginError && <div style={{ color: "#c0392b", fontSize: 13, fontFamily: "Lato, sans-serif", marginBottom: 12 }}>⚠ {loginError}</div>}
          <button className="btn btn-primary" style={{ width: "100%", padding: "13px", fontSize: 15 }} onClick={handleLogin}>Login to Admin</button>
          <button className="btn" style={{ width: "100%", marginTop: 10, padding: "11px", fontSize: 13, background: "#f0e4d0", color: "#7a5c45", borderRadius: 6 }} onClick={() => setView("store")}>← Back to Store</button>
          <div style={{ fontFamily: "Lato, sans-serif", fontSize: 11, color: "#aaa", textAlign: "center", marginTop: 14 }}>Default: swami / chirayu@1919</div>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "orders", label: "📦 Orders" },
    { id: "products", label: "🛒 Products" },
    { id: "inventory", label: "📋 Inventory" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: 230, background: "linear-gradient(180deg, #2d1a0e, #8B2500)", color: "white", padding: "24px 0", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ textAlign: "center", padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
          <div style={{ fontSize: 36 }}>🪔</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 900, marginTop: 6 }}>SWAMI FOODS</div>
          <div style={{ fontSize: 11, opacity: .6, fontFamily: "Lato, sans-serif", letterSpacing: 2 }}>ADMIN PANEL</div>
        </div>
        <nav style={{ marginTop: 20, flex: 1 }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className="btn"
              style={{ width: "100%", textAlign: "left", padding: "13px 24px", background: tab === t.id ? "rgba(232,135,42,.25)" : "none", color: "white", borderLeft: tab === t.id ? "3px solid #E8872A" : "3px solid transparent", borderRadius: 0, fontSize: 14, fontFamily: "Lato, sans-serif" }}>
              {t.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,.1)" }}>
          <button className="btn" style={{ width: "100%", background: "rgba(255,255,255,.1)", color: "white", border: "1px solid rgba(255,255,255,.2)", padding: "9px", borderRadius: 6, fontSize: 13 }} onClick={() => setView("store")}>
            🏪 View Store
          </button>
          <button className="btn" style={{ width: "100%", background: "rgba(192,57,43,.3)", color: "white", border: "none", padding: "9px", borderRadius: 6, fontSize: 13, marginTop: 8 }} onClick={() => setAdminAuth(false)}>
            🔓 Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, background: "#f8f4ee", overflow: "auto" }}>
        {/* Top bar */}
        <div style={{ background: "white", padding: "16px 30px", borderBottom: "1px solid #e0cdb8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#2d1a0e" }}>
            {TABS.find((t) => t.id === tab)?.label}
          </div>
          <div style={{ fontFamily: "Lato, sans-serif", fontSize: 13, color: "#7a5c45" }}>
            👤 Admin · {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>

        <div style={{ padding: "28px 30px" }}>
          {tab === "dashboard" && <Dashboard products={products} orders={orders} />}
          {tab === "orders" && <OrdersTab orders={orders} setOrders={setOrders} notify={notify} />}
          {tab === "products" && <ProductsTab products={products} setProducts={setProducts} notify={notify} />}
          {tab === "inventory" && <InventoryTab products={products} setProducts={setProducts} notify={notify} />}
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ products, orders }) {
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const lowStock = products.filter((p) => p.stock <= 10).length;
  const totalStock = products.reduce((s, p) => s + p.stock, 0);

  const catRevenue = {};
  orders.forEach((o) => o.items.forEach((i) => {
    catRevenue[i.category] = (catRevenue[i.category] || 0) + i.price * i.qty;
  }));

  const recentOrders = orders.slice(0, 5);
  const topProducts = [...products].sort((a, b) => {
    const aRev = orders.reduce((s, o) => s + (o.items.find((i) => i.id === a.id)?.price ?? 0) * (o.items.find((i) => i.id === a.id)?.qty ?? 0), 0);
    const bRev = orders.reduce((s, o) => s + (o.items.find((i) => i.id === b.id)?.price ?? 0) * (o.items.find((i) => i.id === b.id)?.qty ?? 0), 0);
    return bRev - aRev;
  }).slice(0, 4);

  const stats = [
    { label: "Total Revenue", value: formatINR(totalRevenue), icon: "💰", color: "#2d7d46", bg: "#d4edda" },
    { label: "Total Orders", value: totalOrders, icon: "📦", color: "#E8872A", bg: "#fef3e2" },
    { label: "Low Stock Items", value: lowStock, icon: "⚠️", color: "#856404", bg: "#fff3cd" },
    { label: "Total Stock Units", value: totalStock, icon: "📋", color: "#155274", bg: "#d1ecf1" },
  ];

  return (
    <div>
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18, marginBottom: 28 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "white", borderRadius: 14, padding: "22px", boxShadow: "0 2px 10px rgba(0,0,0,.05)", border: "1px solid #f0e4d0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ background: s.bg, borderRadius: 10, width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: "Lato, sans-serif", fontSize: 12, color: "#7a5c45", fontWeight: 700 }}>{s.label}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent Orders */}
        <div style={{ background: "white", borderRadius: 14, padding: "22px", boxShadow: "0 2px 10px rgba(0,0,0,.05)", border: "1px solid #f0e4d0" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, marginBottom: 16, color: "#2d1a0e" }}>Recent Orders</div>
          {recentOrders.length === 0
            ? <div style={{ color: "#7a5c45", fontFamily: "Lato, sans-serif", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No orders yet</div>
            : recentOrders.map((o) => (
              <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0e4d0", fontFamily: "Lato, sans-serif" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#2d1a0e" }}>#{o.id}</div>
                  <div style={{ fontSize: 12, color: "#7a5c45" }}>{o.customer.name} · {o.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: "#2d7d46" }}>{formatINR(o.total)}</div>
                  <span className="badge badge-green">{o.status}</span>
                </div>
              </div>
            ))}
        </div>

        {/* Top Products */}
        <div style={{ background: "white", borderRadius: 14, padding: "22px", boxShadow: "0 2px 10px rgba(0,0,0,.05)", border: "1px solid #f0e4d0" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, marginBottom: 16, color: "#2d1a0e" }}>Products Overview</div>
          {topProducts.map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0e4d0" }}>
              <div style={{ fontSize: 28 }}>{p.image}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Lato, sans-serif", fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#7a5c45" }}>{formatINR(p.price)}</div>
              </div>
              <span className={`badge ${p.stock > 10 ? "badge-green" : p.stock > 0 ? "badge-yellow" : "badge-red"}`}>
                {p.stock > 0 ? `${p.stock} units` : "Out of stock"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Orders Tab ────────────────────────────────────────────────────────────────
function OrdersTab({ orders, setOrders, notify }) {
  const updateStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    notify(`Order ${id} marked as ${status}`);
  };

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <div style={{ background: "white", borderRadius: 14, padding: "18px 22px", marginBottom: 20, display: "flex", gap: 28, border: "1px solid #f0e4d0" }}>
        <div style={{ fontFamily: "Lato, sans-serif" }}>
          <div style={{ fontSize: 11, color: "#7a5c45", fontWeight: 700 }}>TOTAL ORDERS</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: "#E8872A" }}>{orders.length}</div>
        </div>
        <div style={{ fontFamily: "Lato, sans-serif" }}>
          <div style={{ fontSize: 11, color: "#7a5c45", fontWeight: 700 }}>TOTAL EARNINGS</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: "#2d7d46" }}>{formatINR(totalRevenue)}</div>
        </div>
      </div>

      {orders.length === 0
        ? <div style={{ background: "white", borderRadius: 14, padding: "60px", textAlign: "center", color: "#7a5c45", fontFamily: "Lato, sans-serif" }}>
          <div style={{ fontSize: 48 }}>📦</div><div style={{ marginTop: 12, fontSize: 16 }}>No orders yet</div>
        </div>
        : <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {orders.map((o) => (
            <div key={o.id} style={{ background: "white", borderRadius: 14, padding: "20px", border: "1px solid #f0e4d0", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700 }}>Order #{o.id}</div>
                  <div style={{ fontFamily: "Lato, sans-serif", fontSize: 13, color: "#7a5c45" }}>{o.date} · {o.customer.name} · {o.customer.phone} · {o.customer.city}</div>
                  <div style={{ fontFamily: "Lato, sans-serif", fontSize: 12, color: "#7a5c45" }}>📍 {o.customer.address} · {o.customer.payment}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 900, color: "#2d7d46" }}>{formatINR(o.total)}</div>
                  <span className={`badge ${o.status === "Delivered" ? "badge-green" : o.status === "Cancelled" ? "badge-red" : "badge-yellow"}`}>{o.status}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                {o.items.map((i) => (
                  <div key={i.id} style={{ background: "#fdf8f0", borderRadius: 8, padding: "6px 12px", fontFamily: "Lato, sans-serif", fontSize: 12 }}>
                    {i.image} {i.name} × {i.qty} = {formatINR(i.price * i.qty)}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
                  <button key={s} className="btn btn-sm" onClick={() => updateStatus(o.id, s)}
                    style={{ background: o.status === s ? "#E8872A" : "#f0e4d0", color: o.status === s ? "white" : "#7a5c45", borderRadius: 6, fontSize: 11 }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

// ── Products Tab ──────────────────────────────────────────────────────────────
function ProductsTab({ products, setProducts, notify }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const EMOJIS = ["🫘", "🧀", "🥘", "🌾", "🌽", "🌶️", "🧈", "🥭", "🍯", "🫙", "🧆", "🥜", "🍚", "🧅", "🫚"];
  const empty = { name: "", category: "Ready to Eat", price: "", stock: "", image: "🫘", description: "" };
  const [form, setForm] = useState(empty);

  const openAdd = () => { setForm(empty); setEditId(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ ...p, price: String(p.price), stock: String(p.stock) }); setEditId(p.id); setShowForm(true); };

  const save = () => {
    if (!form.name || !form.price || !form.stock) return notify("Fill all required fields", "error");
    if (editId) {
      setProducts((prev) => prev.map((p) => p.id === editId ? { ...form, id: editId, price: Number(form.price), stock: Number(form.stock) } : p));
      notify("Product updated!");
    } else {
      setProducts((prev) => [...prev, { ...form, id: Date.now(), price: Number(form.price), stock: Number(form.stock) }]);
      notify("Product added!");
    }
    setShowForm(false);
  };

  const deleteProduct = (id) => {
    if (!confirm("Delete this product?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    notify("Product deleted");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>
      <div style={{ background: "white", borderRadius: 14, overflow: "hidden", border: "1px solid #f0e4d0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Lato, sans-serif" }}>
          <thead>
            <tr style={{ background: "#fdf8f0", borderBottom: "2px solid #e0cdb8" }}>
              {["Product", "Category", "Price", "Stock", "Actions"].map((h) => (
                <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#7a5c45", letterSpacing: .5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f0e4d0" }}>
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{p.image}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#7a5c45" }}>{p.description.slice(0, 45)}…</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: "#7a5c45" }}>{p.category}</td>
                <td style={{ padding: "13px 16px", fontWeight: 700, color: "#8B2500" }}>{formatINR(p.price)}</td>
                <td style={{ padding: "13px 16px" }}>
                  <span className={`badge ${p.stock > 10 ? "badge-green" : p.stock > 0 ? "badge-yellow" : "badge-red"}`}>{p.stock}</span>
                </td>
                <td style={{ padding: "13px 16px" }}>
                  <button className="btn btn-sm btn-outline" style={{ marginRight: 8 }} onClick={() => openEdit(p)}>Edit</button>
                  <button className="btn btn-sm" style={{ background: "#f8d7da", color: "#721c24", borderRadius: 6 }} onClick={() => deleteProduct(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, padding: "28px", width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>{editId ? "Edit Product" : "Add Product"}</div>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#7a5c45", fontFamily: "Lato, sans-serif", display: "block", marginBottom: 5 }}>Icon</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {EMOJIS.map((e) => (
                  <button key={e} onClick={() => setForm({ ...form, image: e })} style={{ fontSize: 22, background: form.image === e ? "#fef3e2" : "transparent", border: form.image === e ? "2px solid #E8872A" : "2px solid #e0cdb8", borderRadius: 8, width: 38, height: 38, cursor: "pointer" }}>{e}</button>
                ))}
              </div>
            </div>
            {[["name", "Product Name *", "text"], ["price", "Price (₹) *", "number"], ["stock", "Stock Quantity *", "number"]].map(([f, l, t]) => (
              <div key={f} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#7a5c45", fontFamily: "Lato, sans-serif", display: "block", marginBottom: 5 }}>{l}</label>
                <input type={t} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} placeholder={l} />
              </div>
            ))}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#7a5c45", fontFamily: "Lato, sans-serif", display: "block", marginBottom: 5 }}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#7a5c45", fontFamily: "Lato, sans-serif", display: "block", marginBottom: 5 }}>Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short product description" style={{ resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1, padding: "12px" }} onClick={save}>
                {editId ? "Save Changes" : "Add Product"}
              </button>
              <button className="btn" style={{ padding: "12px 20px", background: "#f0e4d0", color: "#7a5c45", borderRadius: 6 }} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Inventory Tab ─────────────────────────────────────────────────────────────
function InventoryTab({ products, setProducts, notify }) {
  const [adjustId, setAdjustId] = useState(null);
  const [adjustVal, setAdjustVal] = useState("");

  const applyAdjust = (id) => {
    const val = parseInt(adjustVal);
    if (isNaN(val)) return notify("Enter a valid number", "error");
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, stock: Math.max(0, p.stock + val) } : p));
    notify(`Stock updated!`);
    setAdjustId(null);
    setAdjustVal("");
  };

  const lowStock = products.filter((p) => p.stock <= 10);
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Products", value: products.length, color: "#E8872A", bg: "#fef3e2" },
          { label: "Low Stock Alerts", value: lowStock.length, color: "#856404", bg: "#fff3cd" },
          { label: "Out of Stock", value: products.filter((p) => p.stock === 0).length, color: "#c0392b", bg: "#f8d7da" },
          { label: "Inventory Value", value: formatINR(totalValue), color: "#2d7d46", bg: "#d4edda" },
        ].map((s) => (
          <div key={s.label} style={{ background: "white", borderRadius: 12, padding: "18px", border: "1px solid #f0e4d0" }}>
            <div style={{ fontFamily: "Lato, sans-serif", fontSize: 11, color: "#7a5c45", fontWeight: 700 }}>{s.label}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: s.color, marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {lowStock.length > 0 && (
        <div style={{ background: "#fff3cd", border: "1.5px solid #ffc107", borderRadius: 10, padding: "12px 18px", marginBottom: 20, fontFamily: "Lato, sans-serif", fontSize: 13, color: "#856404" }}>
          ⚠️ <strong>Low Stock Alert:</strong> {lowStock.map((p) => `${p.name} (${p.stock})`).join(", ")}
        </div>
      )}

      <div style={{ background: "white", borderRadius: 14, overflow: "hidden", border: "1px solid #f0e4d0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Lato, sans-serif" }}>
          <thead>
            <tr style={{ background: "#fdf8f0", borderBottom: "2px solid #e0cdb8" }}>
              {["Product", "Category", "Price", "Stock", "Stock Value", "Adjust Stock"].map((h) => (
                <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#7a5c45", letterSpacing: .5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f0e4d0", background: p.stock === 0 ? "#fff5f5" : "white" }}>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 20, marginRight: 8 }}>{p.image}</span>
                  <strong style={{ fontSize: 14 }}>{p.name}</strong>
                </td>
                <td style={{ padding: "12px 16px", color: "#7a5c45", fontSize: 13 }}>{p.category}</td>
                <td style={{ padding: "12px 16px", fontWeight: 700, color: "#8B2500" }}>{formatINR(p.price)}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span className={`badge ${p.stock > 10 ? "badge-green" : p.stock > 0 ? "badge-yellow" : "badge-red"}`}>{p.stock} units</span>
                </td>
                <td style={{ padding: "12px 16px", fontWeight: 700, color: "#2d7d46" }}>{formatINR(p.price * p.stock)}</td>
                <td style={{ padding: "12px 16px" }}>
                  {adjustId === p.id
                    ? <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <input type="number" value={adjustVal} onChange={(e) => setAdjustVal(e.target.value)} placeholder="+10 or -5" style={{ width: 100, padding: "5px 8px", fontSize: 13 }} />
                      <button className="btn btn-sm btn-primary" onClick={() => applyAdjust(p.id)}>Apply</button>
                      <button className="btn btn-sm" style={{ background: "#f0e4d0", color: "#7a5c45", borderRadius: 6 }} onClick={() => setAdjustId(null)}>×</button>
                    </div>
                    : <button className="btn btn-sm btn-outline" onClick={() => { setAdjustId(p.id); setAdjustVal(""); }}>Adjust</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
