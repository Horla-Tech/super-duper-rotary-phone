import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, ArrowRight, Sun, BatteryCharging, Settings, Home as HomeIcon,
  Shield, Clock, Wrench, HeadphonesIcon, Phone, Mail, MessageCircle,
  Menu, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Video, Send, Images,
  ShoppingBag, Package
} from "lucide-react";
import { PRODUCTS, formatPrice, buildWhatsAppUrl } from "@/data/products";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP = "https://wa.me/2348064263647?text=Hello%2C%20I%27m%20interested%20in%20your%20energy%20solutions";
const CALENDLY_CALL = "https://calendly.com/yussufsanni19/on-call-consultation";

const formSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your property address"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().optional(),
});

/* ─── Animated Counter ─── */
function AnimatedCounter({ value, suffix, duration = 2000 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOut * value));
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(value);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Navbar ─── */
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const [, setLocation] = useLocation();

  const links = [
    { label: "Services", id: "services" },
    { label: "Why Us", id: "why-us" },
    { label: "Process", id: "process" },
    { label: "Gallery", id: "gallery-nav" },
    { label: "Shop", id: "shop-nav" },
    { label: "FAQ", id: "faq" },
  ];

  const scrollTo = (id: string) => {
    if (id === "gallery-nav") {
      setMobileOpen(false);
      setLocation("/gallery");
      return;
    }
    if (id === "shop-nav") {
      setMobileOpen(false);
      setLocation("/shop");
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-background/80 backdrop-blur-sm"
      }`}
      data-testid="navbar"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <nav className="flex items-center justify-between py-4">
          <a href="#" className="flex items-center gap-2" data-testid="link-logo">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
              <Zap className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">SYO Energy</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid={`link-${l.id}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => scrollTo("contact")}
              className="hidden md:flex"
              data-testid="button-book-nav"
            >
              Book Free Inspection
            </Button>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-menu-toggle"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/98 backdrop-blur-md"
          >
            <div className="px-6 py-4 space-y-1">
              {links.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className="w-full text-left py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border-b border-border/50 last:border-0"
                >
                  {l.label}
                </button>
              ))}
              <div className="pt-3">
                <Button onClick={() => scrollTo("contact")} className="w-full">
                  Book Free Inspection
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ─── Hero ─── */
function Hero() {
  const scrollToContact = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative flex items-center justify-center pt-28 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      {/* Hero image overlay */}
      <div className="absolute inset-0 z-0 opacity-10">
        <img
          src="/images/hero-solar.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>
      {/* Decorative blobs */}
      <div className="absolute top-1/4 -left-24 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-sm font-medium mb-8"
          >
            <Zap className="w-4 h-4 text-accent" />
            <span>Premium Energy Solutions</span>
          </motion.div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight leading-tight text-balance mb-6">
            Fix Your Power Problems
            <span className="block mt-2 italic text-accent">Permanently</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            No fuel. No noise. Just stable, smart energy for your home or business. We design
            and install reliable solar and backup power systems that eliminate blackouts, reduce
            energy costs, and give you full control of your electricity.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              onClick={scrollToContact}
              className="h-14 px-8 text-base font-semibold"
              data-testid="button-book-hero"
            >
              Book Free Inspection
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 px-8 text-base font-semibold bg-[#25D366] text-white border-[#25D366] hover:bg-[#1ebe5d] hover:border-[#1ebe5d]"
            >
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" data-testid="link-whatsapp-hero">
                Chat on WhatsApp
              </a>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {[
              "100+ Installations",
              "5-Star Reviews",
              "Licensed & Certified",
              "24/7 Support",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Stats ─── */
function Stats() {
  const stats = [
    { value: 100, suffix: "+", label: "Installations Completed" },
    { value: 2, suffix: "+", label: "Years Experience" },
    { value: 98, suffix: "%", label: "Client Satisfaction" },
    { value: 24, suffix: "/7", label: "Support Available" },
  ];

  return (
    <section className="py-16 bg-secondary border-y border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
              data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <p className="font-display text-4xl lg:text-5xl font-medium text-foreground">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Services ─── */
function Services() {
  const services = [
    {
      number: "01",
      icon: Sun,
      title: "Solar Installation",
      desc: "High-efficiency tier-1 panels precisely designed and securely mounted for maximum energy yield — from residential rooftops to large commercial arrays.",
    },
    {
      number: "02",
      icon: BatteryCharging,
      title: "Backup Power Systems",
      desc: "Silent, high-capacity lithium battery banks that seamlessly take over the moment grid power fails. No interruptions, no generator noise.",
    },
    {
      number: "03",
      icon: Settings,
      title: "Electrical Wiring & Setup",
      desc: "Industrial-grade electrical work ensuring safety, regulatory compliance, and flawless power routing throughout your property.",
    },
    {
      number: "04",
      icon: HomeIcon,
      title: "Smart Home Integration",
      desc: "Monitor your energy production, storage, and consumption in real time from anywhere. Full control, always in your hands.",
    },
  ];

  return (
    <section id="services" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-accent uppercase tracking-wider mb-3"
          >
            What We Do
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl sm:text-5xl font-medium tracking-tight"
          >
            Engineered for
            <span className="block italic">reliability</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Comprehensive energy solutions designed for uncompromising, long-term performance.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-5 sm:p-8 rounded-2xl bg-card border border-border hover:border-accent/40 hover:shadow-md transition-all duration-300"
              data-testid={`card-service-${i + 1}`}
            >
              <div className="flex items-start gap-4 mb-5">
                <span className="font-display text-3xl font-medium text-accent/40 leading-none">{s.number}</span>
                <div className="ml-auto w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <s.icon className="w-6 h-6 text-accent" />
                </div>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Why Us ─── */
function WhyUs() {
  const features = [
    { icon: Shield, title: "Quality Guaranteed", desc: "We use only premium components from trusted manufacturers with proper warranties." },
    { icon: Clock, title: "On-Time Delivery", desc: "We respect your time. Projects are completed on schedule without compromising quality." },
    { icon: Wrench, title: "Expert Installation", desc: "Our certified technicians bring years of experience to every installation." },
    { icon: HeadphonesIcon, title: "Ongoing Support", desc: "24/7 support and maintenance to keep your system running at peak performance." },
  ];

  return (
    <section id="why-us" className="py-24 lg:py-32 bg-secondary border-y border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">Why Choose Us</p>
            <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-balance">
              Premium quality,
              <span className="block italic">not roadside work</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              We are not just electricians. We are energy consultants who design systems that actually
              work for your specific needs and budget — built to last, not to disappoint.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-8">
              {[
                { value: 100, suffix: "+", label: "Projects Completed" },
                { value: 2, suffix: "+", label: "Years Experience" },
                { value: 98, suffix: "%", label: "Client Satisfaction" },
                { value: 24, suffix: "/7", label: "Support Available" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl lg:text-4xl font-medium">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-5 rounded-xl bg-background border border-border hover:border-accent/40 transition-colors"
                data-testid={`card-feature-${i + 1}`}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <f.icon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Process ─── */
function Process() {
  const steps = [
    { number: "01", title: "Free Consultation", desc: "We visit your property, assess your energy needs, and understand your goals. No obligation, no pressure." },
    { number: "02", title: "Custom Proposal", desc: "Receive a detailed proposal with system specifications, pricing, and timeline tailored to your needs." },
    { number: "03", title: "Professional Installation", desc: "Our certified team handles everything from planning to final setup. Clean, efficient, and on schedule." },
    { number: "04", title: "Ongoing Support", desc: "We stay with you after installation. Enjoy warranty coverage, maintenance, and 24/7 priority support." },
  ];

  return (
    <section id="process" className="py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">How It Works</p>
          <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-balance">
            From consultation
            <span className="block italic">to power-on</span>
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/70 leading-relaxed">
            A simple, transparent process designed to get you reliable power as quickly as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
              data-testid={`card-step-${i + 1}`}
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-px bg-primary-foreground/15" />
              )}
              <span className="font-display text-5xl font-medium text-accent/70">{step.number}</span>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-primary-foreground/65 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Gallery Carousel ─── */
function Gallery() {
  const [, setLocation] = useLocation();
  const photos = [
    { src: "/gallery/solar-residential.jpg", label: "Residential Solar Installation", category: "Solar" },
    { src: "/gallery/backup-commercial.jpg", label: "Commercial Backup Power System", category: "Backup Power" },
    { src: "/gallery/electrical-office.jpg", label: "Office Electrical Wiring", category: "Electrical" },
    { src: "/gallery/solar-battery.jpg", label: "Solar + Battery Storage", category: "Solar" },
    { src: "/gallery/inverter-setup.jpg", label: "Inverter & UPS Setup", category: "Backup Power" },
    { src: "/gallery/smart-home.jpg", label: "Smart Home Energy Control", category: "Smart Home" },
  ];

  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % photos.length), [photos.length]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isHovered, next]);

  return (
    <section id="gallery" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm font-medium text-accent uppercase tracking-wider mb-3"
            >
              Our Work
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl sm:text-5xl font-medium tracking-tight"
            >
              Real installations,
              <span className="block italic">real results</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Button
              variant="outline"
              onClick={() => setLocation("/gallery")}
              className="flex items-center gap-2 shrink-0"
              data-testid="link-view-all-gallery"
            >
              <Images className="w-4 h-4" />
              View All Projects
            </Button>
          </motion.div>
        </div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group/carousel relative rounded-2xl overflow-hidden border border-border shadow-md aspect-[16/9] sm:aspect-[21/9] bg-secondary"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          data-testid="carousel-gallery"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={photos[current].src}
                alt={photos[current].label}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <span className="inline-block px-3 py-1 rounded-full bg-accent/90 text-accent-foreground text-xs font-semibold mb-2">
                  {photos[current].category}
                </span>
                <p className="text-white font-semibold text-lg">{photos[current].label}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Arrows — always visible on mobile, hover-revealed on desktop */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 z-10 transition-opacity duration-300 sm:opacity-0 sm:group-hover/carousel:opacity-100">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full bg-white/90 text-foreground flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              data-testid="button-carousel-prev"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-11 h-11 rounded-full bg-white/90 text-foreground flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              data-testid="button-carousel-next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-4 right-6 flex gap-2 z-10">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/80"}`}
                data-testid={`button-carousel-dot-${i + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Shop Preview ─── */
function ShopPreview() {
  const [, setLocation] = useLocation();
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">SYO Energy Store</p>
            <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight">
              Featured
              <span className="block italic">Products</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md">
              Top-quality solar panels, inverters, and batteries — delivered with professional installation support.
            </p>
          </div>
          <motion.button
            whileHover={{ x: 4 }}
            onClick={() => setLocation("/shop")}
            className="flex items-center gap-2 text-sm font-semibold text-foreground border-b border-foreground/30 pb-0.5 hover:border-foreground transition-colors whitespace-nowrap self-start sm:self-auto"
            data-testid="link-view-all-products"
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-accent/40 hover:shadow-md transition-all duration-300 flex flex-col"
              data-testid={`shop-preview-card-${product.id}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-sm">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="p-3 sm:p-5 flex flex-col flex-1">
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="font-display font-semibold text-xs sm:text-sm leading-snug mb-2 sm:mb-3 line-clamp-2 flex-1">{product.name}</h3>
                <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-border gap-1">
                  <p className="font-display text-sm sm:text-lg font-semibold">{formatPrice(product.price)}</p>
                  <a
                    href={buildWhatsAppUrl(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-[#25D366] text-white text-xs font-semibold hover:bg-[#22c55e] transition-colors shrink-0"
                    data-testid={`button-order-preview-${product.id}`}
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden xs:inline sm:inline">Order</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <Package className="w-4 h-4 text-accent" />
          <span>All orders are placed via WhatsApp — fast, easy, and no cards required.</span>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    { q: "How long does installation take?", a: "Most residential installations are completed within 2–3 days following the site inspection and system design approval. Commercial projects may vary." },
    { q: "Can a solar system power my AC and heavy appliances?", a: "Yes. We design systems specifically tailored to your load requirements, including heavy-duty appliances like air conditioners, water pumps, and industrial equipment." },
    { q: "What happens during extended cloudy or rainy periods?", a: "Our battery backup systems are sized to provide substantial autonomy. They can also integrate with the grid or a backup generator to ensure zero downtime." },
    { q: "Do you offer maintenance after installation?", a: "Absolutely. We provide comprehensive warranties and 24/7 priority support to ensure your system performs flawlessly year after year." },
    { q: "What areas do you serve?", a: "We currently serve Lagos and surrounding areas. Contact us directly to check availability in your location." },
  ];

  return (
    <section id="faq" className="py-24 lg:py-32 bg-secondary border-y border-border">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">Common Questions</p>
          <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight">
            Got questions?
            <span className="block italic">We have answers</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-background rounded-xl border border-border overflow-hidden"
              data-testid={`card-faq-${i + 1}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-secondary/50 transition-colors"
                data-testid={`button-faq-${i + 1}`}
              >
                <span className="font-semibold pr-4">{faq.q}</span>
                {openIndex === i ? (
                  <ChevronUp className="w-4 h-4 flex-shrink-0 text-accent" />
                ) : (
                  <ChevronDown className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ─── */
function Contact() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "", address: "", service: "", message: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Inspection request:", values);
    setSubmitted(true);
    toast({
      title: "Request received!",
      description: "We'll be in touch within 24 hours to confirm your free inspection.",
    });
    form.reset();
    setTimeout(() => setSubmitted(false), 5000);
  }

  return (
    <section id="contact" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-3">Get In Touch</p>
          <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-balance">
            Ready to fix your
            <span className="block italic">power problems?</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Book a free site inspection or reach us directly. No obligation, no pressure — just honest advice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Quick contact options */}
          <div>
            <h3 className="text-lg font-semibold mb-5">Reach Us Directly</h3>
            <div className="space-y-3 mb-8">
              <a
                href={CALENDLY_CALL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 transition-colors group"
                data-testid="link-book-call"
              >
                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Book a Call</p>
                  <p className="text-xs opacity-80">Free virtual consultation</p>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-[#25D366] text-white hover:bg-[#22c55e] transition-colors group"
                data-testid="link-whatsapp-contact"
              >
                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Chat on WhatsApp</p>
                  <p className="text-xs opacity-80">Get instant responses</p>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="tel:+2348064263647"
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary hover:bg-secondary/70 transition-colors group border border-border"
                data-testid="link-phone"
              >
                <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Call Us Directly</p>
                  <p className="text-xs text-muted-foreground">080 6426 3647</p>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity" />
              </a>

              <a
                href="mailto:yussufsanni19@gmail.com"
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary hover:bg-secondary/70 transition-colors group border border-border"
                data-testid="link-email"
              >
                <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Email Us</p>
                  <p className="text-xs text-muted-foreground">yussufsanni19@gmail.com</p>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity" />
              </a>
            </div>
          </div>

          {/* Right: Booking form */}
          <div className="bg-card rounded-2xl border border-border p-5 sm:p-8 shadow-sm">
            <h3 className="font-display text-2xl font-semibold mb-2">Book Free Site Inspection</h3>
            <p className="text-sm text-muted-foreground mb-7">
              Fill in your details and we'll contact you within 24 hours to schedule your inspection.
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8 text-accent" />
                  </div>
                  <h4 className="font-display text-xl font-semibold mb-2">Request Received!</h4>
                  <p className="text-muted-foreground">We'll be in touch within 24 hours to confirm your free inspection.</p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" data-testid="input-name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="080..." data-testid="input-phone" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Where do you need power?" data-testid="input-address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Needed</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
                                data-testid="select-service"
                                {...field}
                              >
                                <option value="">Select a service…</option>
                                <option value="solar">Solar Installation</option>
                                <option value="backup">Backup Power System</option>
                                <option value="electrical">Electrical Wiring & Setup</option>
                                <option value="smart">Smart Home Integration</option>
                                <option value="other">Not sure yet</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Details <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about your power situation, load requirements, or anything else we should know…"
                                className="resize-none"
                                rows={3}
                                data-testid="textarea-message"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-semibold"
                        data-testid="button-submit-form"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Request Free Inspection
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="py-12 bg-primary text-primary-foreground border-t border-primary-foreground/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <Zap className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-semibold text-lg">SYO Energy</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-primary-foreground/60">
            <a href="tel:+2348064263647" className="hover:text-primary-foreground transition-colors">080 6426 3647</a>
            <a href="mailto:yussufsanni19@gmail.com" className="hover:text-primary-foreground transition-colors">yussufsanni19@gmail.com</a>
          </div>
          <p className="text-sm text-primary-foreground/50">
            &copy; {new Date().getFullYear()} SYO Energy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Floating WhatsApp ─── */
function FloatingWhatsApp() {
  return (
    <motion.a
      href={WHATSAPP}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center"
      aria-label="Chat on WhatsApp"
      data-testid="link-whatsapp-floating"
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M11.999 2C6.477 2 2 6.477 2 11.999c0 1.79.469 3.469 1.284 4.924L2 22l5.235-1.263A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10.001C22 6.477 17.522 2 12 2zm0 18.002a7.963 7.963 0 01-4.073-1.118l-.291-.173-3.108.75.784-2.972-.19-.305A7.952 7.952 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
      </svg>
    </motion.a>
  );
}

/* ─── Page ─── */
export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Services />
        <WhyUs />
        <Process />
        <Gallery />
        <ShopPreview />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
