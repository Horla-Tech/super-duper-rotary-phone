import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowLeft, X } from "lucide-react";

const WHATSAPP = "https://wa.me/2348064263647?text=Hello%2C%20I%27m%20interested%20in%20your%20energy%20solutions";

const ALL_PHOTOS = [
  { src: "/gallery/solar-residential.jpg", label: "Residential Solar Installation", category: "Solar", desc: "Full rooftop solar array designed and installed for a Lagos home — 5kW system." },
  { src: "/gallery/backup-commercial.jpg", label: "Commercial Backup Power", category: "Backup Power", desc: "High-capacity backup system for a commercial facility ensuring zero downtime." },
  { src: "/gallery/electrical-office.jpg", label: "Office Electrical Wiring", category: "Electrical", desc: "Complete electrical wiring and panel setup for a multi-floor office complex." },
  { src: "/gallery/solar-battery.jpg", label: "Solar + Battery Storage", category: "Solar", desc: "Hybrid solar and lithium battery storage for uninterrupted 24/7 power." },
  { src: "/gallery/inverter-setup.jpg", label: "Inverter & UPS Setup", category: "Backup Power", desc: "Industrial-grade inverter and UPS installation for a manufacturing facility." },
  { src: "/gallery/smart-home.jpg", label: "Smart Home Energy Control", category: "Smart Home", desc: "Full smart home energy monitoring system — real-time data from any device." },
];

const CATEGORIES = ["All", "Solar", "Backup Power", "Electrical", "Smart Home"];

export default function GalleryPage() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<typeof ALL_PHOTOS[0] | null>(null);

  const filtered = activeCategory === "All"
    ? ALL_PHOTOS
    : ALL_PHOTOS.filter((p) => p.category === activeCategory);

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
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-[#25D366] text-white hover:bg-[#22c55e] transition-colors"
              data-testid="link-whatsapp-gallery"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12"
        >
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">Our Work</p>
          <h1 className="font-display text-4xl sm:text-6xl font-medium tracking-tight leading-tight">
            Project
            <span className="block italic">Gallery</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Every installation is a testament to precision and reliability. Browse our completed projects across all service categories.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="flex flex-wrap gap-2 mb-10"
          data-testid="gallery-filter"
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
              data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {cat}
              {cat !== "All" && (
                <span className={`ml-2 text-xs ${activeCategory === cat ? "opacity-70" : "opacity-50"}`}>
                  {ALL_PHOTOS.filter((p) => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Count */}
        <p className="text-sm text-muted-foreground mb-6">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> project{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" && <span> in <span className="font-semibold text-foreground">{activeCategory}</span></span>}
        </p>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((photo, i) => (
              <motion.div
                key={photo.src}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group relative rounded-2xl overflow-hidden border border-border bg-secondary cursor-pointer"
                onClick={() => setLightbox(photo)}
                data-testid={`card-gallery-${i + 1}`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-300 flex items-end">
                  <div className="w-full p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-2">
                      {photo.category}
                    </span>
                    <p className="text-white font-semibold">{photo.label}</p>
                    <p className="text-white/75 text-sm mt-1 line-clamp-2">{photo.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 text-muted-foreground"
          >
            <p className="text-lg">No projects in this category yet.</p>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center p-8 sm:p-12 rounded-3xl bg-primary text-primary-foreground"
        >
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">Ready to Start?</p>
          <h2 className="font-display text-3xl sm:text-4xl font-medium mb-4">
            Your project could be
            <span className="block italic">next</span>
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
            Get a free site inspection and custom proposal — no obligation, no pressure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setLocation("/#contact")}
              className="h-12 px-8 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
              data-testid="button-cta-book"
            >
              Book Free Inspection
            </button>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-8 rounded-lg border border-primary-foreground/30 text-primary-foreground font-semibold hover:bg-primary-foreground/10 transition-colors flex items-center"
              data-testid="link-cta-whatsapp"
            >
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
            onClick={() => setLightbox(null)}
            data-testid="lightbox-overlay"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-background border border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.src}
                alt={lightbox.label}
                className="w-full object-cover max-h-[65vh]"
              />
              <div className="p-4 sm:p-6">
                <span className="inline-block px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold mb-2 sm:mb-3">
                  {lightbox.category}
                </span>
                <h3 className="font-display text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{lightbox.label}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{lightbox.desc}</p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                data-testid="button-lightbox-close"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp */}
      <motion.a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-8 right-8 z-40 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center"
        aria-label="Chat on WhatsApp"
        data-testid="link-whatsapp-floating"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M11.999 2C6.477 2 2 6.477 2 11.999c0 1.79.469 3.469 1.284 4.924L2 22l5.235-1.263A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10.001C22 6.477 17.522 2 12 2zm0 18.002a7.963 7.963 0 01-4.073-1.118l-.291-.173-3.108.75.784-2.972-.19-.305A7.952 7.952 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
        </svg>
      </motion.a>
    </div>
  );
}
