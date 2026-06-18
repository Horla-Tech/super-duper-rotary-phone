import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowLeft, ShoppingBag, X, CheckCircle, Package } from "lucide-react";
import { PRODUCTS, CATEGORIES, formatPrice, buildWhatsAppUrl, type Product } from "@/data/products";

/* ─── Product Card ─── */
function ProductCard({ product, onView }: { product: Product; onView: (p: Product) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-accent/40 hover:shadow-md transition-all duration-300 flex flex-col"
      data-testid={`card-product-${product.id}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold tracking-wide shadow-sm">
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <span className="text-sm font-semibold text-muted-foreground">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 flex flex-col flex-1">
        <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-display font-semibold text-xs sm:text-base leading-snug mb-1.5 sm:mb-2 line-clamp-2">{product.name}</h3>
        <p className="hidden sm:block text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 flex-1">{product.description}</p>

        <div className="flex items-center justify-between mt-auto pt-2 sm:pt-4 border-t border-border gap-1">
          <p className="font-display text-sm sm:text-xl font-semibold text-foreground">{formatPrice(product.price)}</p>
          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={() => onView(product)}
              className="hidden sm:block px-3 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              data-testid={`button-view-${product.id}`}
            >
              Details
            </button>
            <a
              href={buildWhatsAppUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#25D366] text-white text-xs sm:text-sm font-semibold hover:bg-[#22c55e] transition-colors flex items-center gap-1 sm:gap-1.5"
              data-testid={`button-order-${product.id}`}
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden xs:inline">Order</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Product Detail Modal ─── */
function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
      data-testid="modal-overlay"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative max-w-2xl w-full bg-background rounded-2xl border border-border shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-secondary">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {product.badge && (
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow">
              {product.badge}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-8">
          <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">{product.category}</p>
          <h2 className="font-display text-2xl font-semibold mb-3 leading-snug">{product.name}</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-2 mb-7">
            {product.specs.map((spec) => (
              <div key={spec} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                <span>{spec}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Price</p>
              <p className="font-display text-3xl font-semibold">{formatPrice(product.price)}</p>
            </div>
            <a
              href={buildWhatsAppUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 h-12 px-7 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#22c55e] transition-colors shadow-sm"
              data-testid="button-modal-order"
            >
              <ShoppingBag className="w-4 h-4" />
              Order on WhatsApp
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          data-testid="button-modal-close"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ─── Page ─── */
export default function ShopPage() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = activeCategory === "All"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-back-home"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>

            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <Zap className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="font-semibold tracking-tight">SYO Energy</span>
            </a>

            <a
              href="https://wa.me/2348064263647"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-[#25D366] text-white hover:bg-[#22c55e] transition-colors"
              data-testid="link-whatsapp-header"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mb-12"
        >
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">SYO Energy Store</p>
          <h1 className="font-display text-5xl sm:text-6xl font-medium tracking-tight leading-tight">
            Shop
            <span className="block italic">Our Products</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Premium solar panels, inverters, batteries, and accessories — all delivered with professional installation support.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="w-4 h-4 text-accent" />
            <span>All orders are placed via WhatsApp — we'll confirm availability and arrange delivery.</span>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
          data-testid="shop-filter"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
              }`}
              data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {cat}
              {cat !== "All" && (
                <span className={`ml-2 text-xs ${activeCategory === cat ? "opacity-70" : "opacity-50"}`}>
                  {PRODUCTS.filter((p) => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        <p className="text-sm text-muted-foreground mb-6">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> product{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" && <span> in <span className="font-semibold text-foreground">{activeCategory}</span></span>}
        </p>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onView={setSelected} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 rounded-3xl bg-primary text-primary-foreground p-7 sm:p-14 text-center"
        >
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">Need Help Choosing?</p>
          <h2 className="font-display text-3xl sm:text-4xl font-medium mb-4">
            Not sure what
            <span className="block italic">you need?</span>
          </h2>
          <p className="text-primary-foreground/70 max-w-md mx-auto mb-8">
            Chat with our team on WhatsApp or book a free site inspection. We'll design the perfect system for your budget.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/2348064263647?text=Hello%20SYO%20Energy%2C%20I%20need%20help%20choosing%20the%20right%20products%20for%20my%20needs."
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-8 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#22c55e] transition-colors flex items-center gap-2"
              data-testid="button-cta-whatsapp"
            >
              <ShoppingBag className="w-4 h-4" />
              Chat on WhatsApp
            </a>
            <button
              onClick={() => setLocation("/")}
              className="h-12 px-8 rounded-xl border border-primary-foreground/30 text-primary-foreground font-semibold hover:bg-primary-foreground/10 transition-colors"
              data-testid="button-cta-inspection"
            >
              Book Free Inspection
            </button>
          </div>
        </motion.div>
      </main>

      {/* Product Modal */}
      <AnimatePresence>
        {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      {/* Floating WhatsApp */}
      <motion.a
        href="https://wa.me/2348064263647"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-8 right-8 z-40 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M11.999 2C6.477 2 2 6.477 2 11.999c0 1.79.469 3.469 1.284 4.924L2 22l5.235-1.263A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10.001C22 6.477 17.522 2 12 2zm0 18.002a7.963 7.963 0 01-4.073-1.118l-.291-.173-3.108.75.784-2.972-.19-.305A7.952 7.952 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
        </svg>
      </motion.a>
    </div>
  );
}
