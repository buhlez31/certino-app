"use client";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";
import {
  Wallet,
  Plus,
  Sun,
  Wind,
  Droplets,
  Zap,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Sparkles,
  ChevronRight,
  Hash,
  Cpu,
  ShieldCheck,
  Loader2,
  Circle,
  ExternalLink,
  X,
  Battery,
  Link2,
  Flame,
  AlertTriangle,
  Leaf,
  ShoppingCart,
  TrendingDown,
  ArrowUpRight,
  Download,
  UserPlus,
  Building2,
  Tag,
  Layers,
  BadgeCheck,
  Moon,
  SunMedium,
} from "lucide-react";

// ============================================================
// DESIGN TOKENS — port to tailwind.config.ts theme.extend.colors
//   brand.blue   #2A4DD0
//   brand.sky    #E8EFFF
//   surface.cream #F8F5EF
//   accent.coral #FF6B4A   (HILIER reactor / peak)
//   accent.amber #F4B14A   (solar)
//   accent.cyan  #06B6D4   (wind)
//   accent.violet #8B5CF6  (hydro)
//   accent.lime  #B6E36A   (positive)
// ============================================================

// ---------- Inline shadcn-style primitives (replace with @/components/ui/* in repo)

function Card({ className = "", children, style = {}, ...props }) {
  return (
    <div
      className={`rounded-3xl border ${className}`}
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-sm)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function Button({ className = "", variant = "primary", children, style = {}, ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all active:scale-[0.98]";
  const variantStyles = {
    primary: { background: "var(--accent)", color: "var(--accent-on)" },
    soft: { background: "var(--accent-soft)", color: "var(--accent)" },
    ghost: { background: "transparent", color: "var(--text-secondary)" },
    dark: { background: "var(--accent)", color: "var(--accent-on)" },
    success: { background: "#10B981", color: "white" },
  };
  const sizes = {
    primary: "px-5 py-2.5 text-sm",
    soft: "px-4 py-2 text-sm",
    ghost: "px-3 py-1.5 text-sm",
    dark: "px-5 py-2.5 text-sm",
    success: "px-5 py-2.5 text-sm",
  };
  return (
    <button
      className={`${base} ${sizes[variant]} ${className}`}
      style={{ ...variantStyles[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  );
}

function HilierMark({ className = "" }) {
  return (
    <svg viewBox="0 0 60 70" className={className} fill="none">
      <path d="M30 3 L55 17 L55 53 L30 67 L5 53 L5 17 Z" fill="var(--accent)" />
      <path d="M30 3 L55 17 L30 31 L5 17 Z" fill="var(--accent)" opacity="0.8" />
      <path
        d="M18 26 L42 26 Q46 26 42 32 L22 39 Q18 42 22 44 L42 44"
        stroke="var(--accent-on)" strokeWidth="3.5"
        strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </svg>
  );
}

// ============================================================
// MOCK DATA — replace with Tanstack Query hooks in repo
// ============================================================

const INITIAL_DEVICES = [
  {
    id: "0x4F2A8B91",
    name: "Vinohrady Rooftop",
    type: "Solar PV",
    icon: "solar",
    location: "Prague Vinohrady, CZ",
    coords: { lat: 50.0755, lon: 14.4378 },
    capacityKw: 5.4,
    nowKwh: 4.2,
    todayKwh: 28.6,
    status: "producing",
    commissioned: "2025-06-12",
    biddingZone: "CZ",
  },
  {
    id: "0x8A12C4F0",
    name: "HILIER Unit Brno-01",
    type: "LDES + CHP",
    icon: "hilier",
    location: "Brno Černovice, CZ",
    coords: { lat: 49.1741, lon: 16.6580 },
    capacityKw: 1500,
    nowKwh: 240,
    todayKwh: 1860,
    status: "discharging",
    commissioned: "2026-02-04",
    biddingZone: "CZ",
  },
  {
    id: "0xC3F88D17",
    name: "Krušné Hory Turbine",
    type: "Wind",
    icon: "wind",
    location: "Klínovec, CZ",
    coords: { lat: 50.3957, lon: 12.9685 },
    capacityKw: 2200,
    nowKwh: null,
    todayKwh: null,
    status: "pending",
    commissioned: null,
    biddingZone: "CZ",
    registrationInitiated: "2026-05-08T11:42:00Z",
    queuePosition: 4,
    estimatedApproval: "~2-4 hours",
    approvalChecks: [
      { id: "source", label: "Energy source verification", sub: "Wind onshore confirmed via grid operator", status: "passed" },
      { id: "grid", label: "Grid connection verified", sub: "ČEPS bidding zone CZ · meter ID confirmed", status: "passed" },
      { id: "dual", label: "Dual-issuance check", sub: "Querying neighbouring registries (AIB, REGO)…", status: "checking" },
      { id: "meter", label: "Metering data validation", sub: "Awaiting 24h baseline", status: "queued" },
    ],
  },
];

// Fuel-type mapping per EnergyTag
const FUEL = {
  solar: { label: "Solar", source: "Solar PV", icon: Sun, color: "#F4B14A", bg: "#FFF6E5" },
  hilier: { label: "HILIER", source: "Synthetic / LDES", icon: Zap, color: "#FF6B4A", bg: "#FFEFE8" },
  wind: { label: "Wind", source: "Wind onshore", icon: Wind, color: "#06B6D4", bg: "#E0F7FA" },
  hydro: { label: "Hydro", source: "Hydro run-of-river", icon: Droplets, color: "#8B5CF6", bg: "#F1ECFE" },
};

// ============================================================
// MAIN
// ============================================================

export default function CertinoDemo() {
  const [theme, setTheme] = useState("light"); // "light" | "dark"
  const [route, setRoute] = useState("landing"); // "landing" | "dashboard"
  const [walletConnected, setWalletConnected] = useState(false); // start disconnected when entering from landing
  const [devices, setDevices] = useState([INITIAL_DEVICES[0]]); // pre-seed with one live device (Vinohrady Rooftop)
  const [selectedId, setSelectedId] = useState(INITIAL_DEVICES[0].id);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [deregisterDevice, setDeregisterDevice] = useState(null);
  const selected = devices.find((d) => d.id === selectedId);

  // Called from RegisterDeviceModal success — appends new pending device
  const handleRegister = (newDevice) => {
    setDevices((prev) => [...prev, newDevice]);
    setSelectedId(newDevice.id);
    setRegisterOpen(false);
  };

  // Called from DeregisterDeviceModal — removes device from state (NFT burned on-chain)
  const handleDeregister = (deviceId) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    if (selectedId === deviceId) setSelectedId(null);
    setDeregisterDevice(null);
  };

  // View state branching
  const view = !walletConnected
    ? "no-wallet"
    : devices.length === 0
    ? "no-devices"
    : "registry";

  // ============ LANDING ROUTE ============
  if (route === "landing") {
    return (
      <LandingView
        theme={theme}
        setTheme={setTheme}
        onSelectProducer={() => setRoute("producer")}
        onSelectBuyer={() => setRoute("buyer")}
      />
    );
  }

  // ============ BUYER ROUTE ============
  if (route === "buyer") {
    return <BuyerView theme={theme} setTheme={setTheme} onBack={() => setRoute("landing")} />;
  }

  // ============ PRODUCER ROUTE ============
  return (
    <div
      data-theme={theme}
      className="min-h-screen w-full"
      style={{
        background: "var(--bg-page)",
        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
        color: "var(--text-primary)",
      }}
    >
      <ThemeStyles />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* ============ NAV ============ */}
        <Nav
          walletConnected={walletConnected}
          setWalletConnected={setWalletConnected}
          onBack={() => setRoute("landing")}
          theme={theme}
          setTheme={setTheme}
        />

        {/* ============ MAIN CONTENT — three states ============ */}
        {view === "no-wallet" && (
          <EmptyWalletState onConnect={() => setWalletConnected(true)} />
        )}

        {view === "no-devices" && (
          <EmptyDevicesState onRegister={() => setRegisterOpen(true)} />
        )}

        {view === "registry" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Asset registry list */}
            <div className="lg:col-span-4">
              <AssetList
                devices={devices}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onRegister={() => setRegisterOpen(true)}
              />
            </div>

            {/* Device detail */}
            <div className="lg:col-span-8">
              {selected && (
                <DeviceDetail
                  device={selected}
                  onDeregister={() => setDeregisterDevice(selected)}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ============ REGISTER DEVICE MODAL ============ */}
      {registerOpen && (
        <RegisterDeviceModal
          onClose={() => setRegisterOpen(false)}
          onRegister={handleRegister}
        />
      )}

      {/* ============ DEREGISTER DEVICE MODAL ============ */}
      {deregisterDevice && (
        <DeregisterDeviceModal
          device={deregisterDevice}
          onClose={() => setDeregisterDevice(null)}
          onConfirm={() => handleDeregister(deregisterDevice.id)}
        />
      )}
    </div>
  );
}

// ============================================================
// NAV
// ============================================================

function Nav({ walletConnected, setWalletConnected, onBack, theme, setTheme }) {
  return (
    <nav className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors -ml-1"
            style={{ color: "var(--text-secondary)" }}
            title="Back to landing"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <HilierMark className="w-9 h-10" />
        <div className="flex flex-col leading-none">
          <span className="text-xl font-extrabold tracking-tight">Certino</span>
          <span
            className="text-[10px] font-semibold mt-1 tracking-widest uppercase"
            style={{ color: "var(--accent)" }}
          >
            Producer
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <button
          onClick={() => setWalletConnected(!walletConnected)}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all"
          style={
            walletConnected
              ? { background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-primary)" }
              : { background: "var(--accent)", borderColor: "var(--accent)", color: "var(--accent-on)" }
          }
        >
          {walletConnected ? (
            <>
              <span
                className="w-6 h-6 rounded-full"
                style={{ background: "linear-gradient(135deg, var(--accent), #7D9BA4, #0F3B47)" }}
              />
              <span className="mono text-xs">7xKp…j2nQ</span>
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4" />
              Connect wallet
            </>
          )}
        </button>
      </div>
    </nav>
  );
}

// ============================================================
// ASSET LIST
// ============================================================

function AssetList({ devices, selectedId, onSelect, onRegister }) {
  return (
    <div className="space-y-4 sticky top-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-bold text-[var(--text-tertiary)] tracking-widest uppercase mb-1">
            {devices.length} devices · {devices.filter(d => d.status !== "pending").length} live
          </div>
          <h2 className="display text-3xl font-medium">
            Your assets
          </h2>
        </div>
        <Button variant="soft" onClick={onRegister}>
          <Plus className="w-4 h-4" /> Register
        </Button>
      </div>

      {/* Orange wrap — emphasizes the asset list as the producer's portfolio */}
      <div
        className="p-4 rounded-3xl space-y-3 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FFE8DC 0%, #FFD7B5 60%, #FFC299 100%)",
          boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.06)",
        }}
      >
        {devices.map((d) => (
          <DeviceCard
            key={d.id}
            device={d}
            selected={d.id === selectedId}
            onClick={() => onSelect(d.id)}
          />
        ))}
      </div>

      {/* Helper card */}
      <div
        className="p-5 rounded-3xl border border-dashed border-[var(--border-strong)] mt-4"
        style={{ background: "rgba(255,255,255,0.5)" }}
      >
        <Sparkles className="w-5 h-5 text-[var(--text-tertiary)] mb-2" />
        <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
          Each device emits an EnergyTag-compliant GC every hour, signed by your wallet.
          Built so small installations get a fair share of every kWh.
        </p>
      </div>
    </div>
  );
}

function DeviceCard({ device, selected, onClick }) {
  const fuel = FUEL[device.icon];
  const Icon = fuel.icon;
  const isOnline = device.status === "producing" || device.status === "discharging";
  const isPending = device.status === "pending";

  // Color treatment per state
  const stateStyles = isPending
    ? {
        bg: selected ? "bg-orange-50/80" : "bg-orange-50/40 hover:bg-orange-50/60",
        border: selected ? "border-orange-400" : "border-orange-200/70",
        ring: selected
          ? "0 0 0 3px rgba(251,146,60,0.18), 0 8px 24px -12px rgba(15,23,42,0.1)"
          : "0 1px 2px rgba(15,23,42,0.03)",
      }
    : {
        bg: selected ? "bg-[var(--bg-card)]" : "bg-[var(--bg-card)]/70 hover:bg-[var(--bg-card)]",
        border: selected ? "border-[var(--accent)]" : "border-[var(--border)]",
        ring: selected
          ? "0 0 0 3px rgba(42,77,208,0.12), 0 8px 24px -12px rgba(15,23,42,0.1)"
          : "0 1px 2px rgba(15,23,42,0.03)",
      };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-3xl border transition-all ${stateStyles.bg} ${stateStyles.border}`}
      style={{ boxShadow: stateStyles.ring }}
    >
      <div className="flex items-start gap-3">
        <span
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: isPending ? "rgba(255,255,255,0.7)" : fuel.bg,
            color: fuel.color,
            opacity: isPending ? 0.7 : 1,
          }}
        >
          <Icon className="w-5 h-5" strokeWidth={2} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-[var(--text-primary)] truncate">{device.name}</span>
            {isOnline && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot" />
                LIVE
              </span>
            )}
            {isPending && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full flex-shrink-0">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                PENDING
              </span>
            )}
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">
            {device.type} · {device.location}
          </div>

          {isPending ? (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs">
              <Clock className="w-3 h-3 text-orange-600" />
              <span className="font-semibold text-orange-700">Awaiting approval · ~2h</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1 mt-2.5">
              <span className="display text-2xl font-medium">{device.nowKwh}</span>
              <span className="text-xs text-[var(--text-secondary)] mono">kWh now</span>
            </div>
          )}
        </div>
        {selected && (
          <ChevronRight
            className={`w-4 h-4 mt-1 flex-shrink-0 ${isPending ? "text-orange-500" : "text-[var(--accent)]"}`}
          />
        )}
      </div>
    </button>
  );
}

// ============================================================
// DEVICE DETAIL
// ============================================================

function DeviceDetail({ device, onDeregister }) {
  // Branch: pending devices show approval status, not production data
  if (device.status === "pending") {
    return <PendingDeviceDetail device={device} onDeregister={onDeregister} />;
  }

  const fuel = FUEL[device.icon];
  const Icon = fuel.icon;

  // Hourly production data (kWh per hour today)
  // OTE-CR threshold for premium hour (rolling 30-day Q3 ~ €90/MWh in this demo)
  const PREMIUM_THRESHOLD = 90;

  // Hourly: production + OTE spot price + computed premium flag
  // Solar story: midday glut → low price → not premium. Morning + evening peaks → premium.
  const hourly = [
    { h: "00", v: 0,    ote: 78,  premium: false },
    { h: "02", v: 0,    ote: 65,  premium: false },
    { h: "04", v: 0,    ote: 58,  premium: false },
    { h: "06", v: 0.4,  ote: 92,  premium: true  }, // morning peak — premium
    { h: "08", v: 1.8,  ote: 58,  premium: false },
    { h: "10", v: 3.2,  ote: 22,  premium: false },
    { h: "12", v: 4.4,  ote: 5,   premium: false }, // solar glut, near-zero price
    { h: "13", v: 4.3,  ote: 8,   premium: false },
    { h: "14", v: 4.2,  ote: 15,  premium: false }, // current hour — NOT premium
    { h: "16", v: 3.6,  ote: 42,  premium: false },
    { h: "18", v: 2.1,  ote: 145, premium: true  }, // evening peak — premium
    { h: "20", v: 0.5,  ote: 88,  premium: false },
  ];

  // Premium kWh produced today (issuance only happens during premium hours)
  const todayPremiumKwh = hourly
    .filter((h) => h.premium)
    .reduce((acc, h) => acc + h.v, 0);
  const todayTotalKwh = hourly.reduce((acc, h) => acc + h.v, 0);
  const premiumShare = todayTotalKwh > 0 ? (todayPremiumKwh / todayTotalKwh) * 100 : 0;

  // Mock weekly premium distribution (kWh per day, last 7 days)
  const weekPremium = [
    { d: "Mon", v: 3.2 }, { d: "Tue", v: 1.8 }, { d: "Wed", v: 4.1 },
    { d: "Thu", v: 0.0 }, { d: "Fri", v: 2.4 }, { d: "Sat", v: 5.3 },
    { d: "Sun", v: 6.2 },
  ];
  const weekPremiumKwh = weekPremium.reduce((a, d) => a + d.v, 0); // 23.0
  const weekRevenue = (weekPremiumKwh / 1000) * 40; // €/kWh × indicative €40/MWh

  // Is the current hour premium? Drives the hero badge state.
  const currentHour = hourly.find((h) => h.h === "14");
  const isCurrentlyPremium = currentHour?.premium ?? false;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <Card className="p-7 relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-30 float"
          style={{ background: fuel.color }}
        />

        <div className="relative">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-start gap-4">
              <span
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: fuel.bg, color: fuel.color }}
              >
                <Icon className="w-7 h-7" strokeWidth={2} />
              </span>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-tertiary)] tracking-widest uppercase mb-1.5">
                  <Hash className="w-3 h-3" />
                  <span className="mono">{device.id}</span>
                </div>
                <h1 className="display text-3xl md:text-4xl font-medium leading-tight">
                  {device.name}
                </h1>
                <div className="text-[var(--text-secondary)] text-sm mt-1">
                  {device.type} · {device.capacityKw.toLocaleString()} kW capacity
                </div>
              </div>
            </div>

            <span className="hidden md:flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot" />
              {device.status.toUpperCase()}
            </span>
          </div>

          {/* INPUT row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <InputTile
              label="GPS"
              value={`${device.coords.lat}° N, ${device.coords.lon}° E`}
              sub={device.location.split(",")[0]}
              icon={<MapPin className="w-3.5 h-3.5" />}
            />
            <InputTile
              label="Date"
              value="May 8, 2026"
              sub="Vintage 2026 · Q2"
              icon={<Calendar className="w-3.5 h-3.5" />}
            />
            <InputTile
              label="Hour"
              value="14:00 UTC"
              sub="Settlement window · 1h"
              icon={<Clock className="w-3.5 h-3.5" />}
            />
          </div>

          {/* OUTPUT — big number */}
          <div
            className="p-6 rounded-3xl"
            style={{
              background: `linear-gradient(135deg, ${fuel.bg} 0%, white 100%)`,
              border: `1px solid ${fuel.color}33`,
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div>
                <div className="text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: fuel.color }}>
                  This hour · output
                </div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <div className="display text-6xl md:text-7xl font-medium leading-none">
                    {device.nowKwh}
                    <span className="text-2xl text-[var(--text-tertiary)] ml-2">kWh</span>
                  </div>
                  {/* Tier badge — both states mint, premium just gets the visual emphasis */}
                  {isCurrentlyPremium ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent)] text-white text-[10px] font-bold tracking-widest uppercase">
                      <Sparkles className="w-3 h-3" />
                      Premium tier
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-card-hover)] text-[var(--text-secondary)] text-[10px] font-bold tracking-widest uppercase">
                      Standard tier
                    </span>
                  )}
                </div>
                <div className="text-sm text-[var(--text-secondary)] mt-2">
                  OTE spot now: <span className="mono font-semibold text-[var(--text-primary)]">€{currentHour?.ote ?? "—"}/MWh</span>
                  <span className="text-[var(--text-tertiary)]">
                    {" · "}
                    {isCurrentlyPremium
                      ? `${(((currentHour?.ote ?? 0) / PREMIUM_THRESHOLD)).toFixed(1)}× above threshold`
                      : `premium kicks in above €${PREMIUM_THRESHOLD}/MWh`}
                  </span>
                </div>
              </div>

              {/* Auto-issuance status — protocol mints GCs for every hour.
                  Premium tier marketing-priced higher; standard tier still mints. */}
              <div className="flex flex-col items-end gap-2">
                <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot" />
                  AUTO-ISSUANCE · ON
                </span>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 text-sm font-bold text-[var(--text-primary)]">
                    <Check className="w-4 h-4 text-emerald-500" strokeWidth={3} />
                    Issued at 14:00:12 UTC
                  </div>
                  <div className="mono text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Next GC at 15:00 · cadence 1h
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Premium hours · this week */}
      <Card
        className="surface-light p-7 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FFF6EE 0%, white 70%)",
          border: "1px solid rgba(255,107,74,0.18)",
        }}
      >
        <div className="text-xs font-bold tracking-widest uppercase text-[var(--accent)] mb-4 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          Premium hours · this week
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Big stat */}
          <div>
            <div className="display text-6xl font-medium italic text-[var(--accent)] leading-none">
              {weekPremiumKwh.toFixed(1)}
              <span className="text-2xl text-[var(--text-tertiary)] ml-2 not-italic font-normal">kWh</span>
            </div>
            <div className="text-sm text-[var(--text-secondary)] mt-2">
              {premiumShare.toFixed(0)}% of your total exports
            </div>
          </div>

          {/* Daily distribution */}
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-tertiary)] mb-2">
              Last 7 days
            </div>
            <div className="flex items-end gap-1.5 h-14">
              {weekPremium.map((d) => {
                const max = Math.max(...weekPremium.map((x) => x.v), 1);
                const heightPct = (d.v / max) * 100;
                return (
                  <div key={d.d} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="flex-1 w-full flex items-end">
                      <div
                        className="w-full rounded-t-md"
                        style={{
                          height: `${Math.max(heightPct, 6)}%`,
                          background: d.v > 0
                            ? "linear-gradient(180deg, #FF6B4A, #FF8869)"
                            : "rgba(148,163,184,0.2)",
                        }}
                      />
                    </div>
                    <span className="mono text-[9px] text-[var(--text-tertiary)] uppercase">
                      {d.d.slice(0, 1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Est. revenue */}
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-tertiary)] mb-2">
              Est. revenue
            </div>
            <div className="display text-3xl font-medium text-[var(--text-primary)]">
              €{weekRevenue.toFixed(2)}
            </div>
            <div className="mono text-[11px] text-[var(--text-secondary)] mt-1">
              @ €40/MWh indicative · settles 5 Jun
            </div>
          </div>
        </div>

        {/* Standard tier whisper — every hour mints, premium just earns more */}
        <div className="mt-5 pt-5 border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-2 text-[11px] text-[var(--text-secondary)]">
          <span>
            Standard tier this week: <strong className="text-[var(--text-secondary)] font-bold">200 kWh</strong>
            {" "}@ ~€5/MWh ≈ <strong className="text-[var(--text-secondary)] font-bold">€1.00</strong>
          </span>
          <span className="mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">
            Total minted: 223 kWh
          </span>
        </div>
      </Card>

      {/* Production chart — bars colored by premium status */}
      <Card className="p-7">
        <div className="flex items-start justify-between mb-2 flex-wrap gap-3">
          <div>
            <div className="text-xs font-bold text-[var(--text-tertiary)] tracking-widest uppercase mb-1">
              Today's hourly production
            </div>
            <h3 className="display text-2xl font-medium">
              <span className="italic" style={{ color: fuel.color }}>{todayTotalKwh.toFixed(1)}</span> kWh produced ·
              <span className="italic text-[var(--accent)] ml-2">{todayPremiumKwh.toFixed(1)}</span> kWh premium
            </h3>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ background: fuel.color, opacity: 0.6 }} />
              Standard tier
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[var(--accent)]" />
              Premium tier
            </span>
          </div>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourly} margin={{ top: 14, right: 10, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="h"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                style={{ fontFamily: "JetBrains Mono" }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                style={{ fontFamily: "JetBrains Mono" }}
              />
              <Tooltip
                cursor={{ fill: "rgba(15,23,42,0.04)" }}
                contentStyle={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: 16,
                  boxShadow: "0 8px 24px -12px rgba(0,0,0,0.1)",
                  fontFamily: "Plus Jakarta Sans",
                  fontSize: 12,
                  padding: "10px 14px",
                }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-strong)] px-3.5 py-2.5 shadow-lg">
                      <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-tertiary)]">
                        {label}:00
                      </div>
                      <div className="font-bold text-[var(--text-primary)] mt-0.5">
                        {d.v} kWh
                      </div>
                      <div className="mono text-[11px] text-[var(--text-secondary)] mt-1">
                        OTE €{d.ote}/MWh
                      </div>
                      <div
                        className="text-[10px] font-bold tracking-widest uppercase mt-1.5"
                        style={{ color: d.premium ? "#FF6B4A" : "#94a3b8" }}
                      >
                        {d.premium ? "✦ Premium tier · GC issued" : "Standard tier · GC issued"}
                      </div>
                    </div>
                  );
                }}
              />
              <Bar dataKey="v" radius={[6, 6, 0, 0]}>
                {hourly.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.premium ? "#FF6B4A" : fuel.color}
                    fillOpacity={entry.premium ? 1 : 0.6}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Footer hint */}
        <div className="mt-3 pt-3 border-t border-[var(--border)] text-[11px] text-[var(--text-secondary)] leading-snug">
          Every hour mints a GC. Premium tier (OTE above €{PREMIUM_THRESHOLD}/MWh)
          settles at ~€40/MWh; standard tier settles at ~€2–8/MWh — same product,
          tiered by grid impact at the moment of generation.
        </div>
      </Card>

      {/* EnergyTag JSON */}
      <EnergyTagPanel device={device} />

      {/* Recent attestations */}
      <Card className="p-7 mb-10">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="text-xs font-bold text-[var(--text-tertiary)] tracking-widest uppercase mb-1">
              Recent attestations
            </div>
            <h3 className="display text-2xl font-medium">
              Last 5 GCs issued
            </h3>
          </div>
          <Button variant="ghost">All <ArrowRight className="w-3.5 h-3.5" /></Button>
        </div>

        <div className="space-y-2">
          {[
            { t: "13:00", v: "4.3 kWh", id: "GC-CZ-2026050813-001846", tx: "0x4f…a2c1" },
            { t: "12:00", v: "4.4 kWh", id: "GC-CZ-2026050812-001845", tx: "0x8b…d903" },
            { t: "11:00", v: "3.8 kWh", id: "GC-CZ-2026050811-001844", tx: "0xc1…88aa" },
            { t: "10:00", v: "3.2 kWh", id: "GC-CZ-2026050810-001843", tx: "0x2e…71ff" },
            { t: "09:00", v: "2.4 kWh", id: "GC-CZ-2026050809-001842", tx: "0xa9…0c2b" },
          ].map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-[var(--bg-card-soft)] transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <Check className="w-3 h-3" />
                  ISSUED
                </span>
                <div>
                  <div className="font-bold text-[var(--text-primary)]">{row.v}</div>
                  <div className="mono text-xs text-[var(--text-secondary)]">{row.t} · {row.id}</div>
                </div>
              </div>
              <span className="mono text-xs text-[var(--text-tertiary)] hidden md:block">{row.tx}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Deregister — burns the device NFT, stops issuance */}
      <DangerZone onDeregister={onDeregister} />
    </div>
  );
}

// ============================================================
// DANGER ZONE — small subtle deregister button
// ============================================================

function DangerZone({ onDeregister }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-card)]/40">
      <div className="flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-full bg-[var(--bg-card-hover)] flex items-center justify-center flex-shrink-0">
          <Flame className="w-4 h-4 text-[var(--text-secondary)]" />
        </span>
        <div>
          <div className="text-sm font-bold text-[var(--text-secondary)]">Deregister device</div>
          <div className="text-[11px] text-[var(--text-secondary)]">
            Burns the NFT, stops GC issuance, removes from registry
          </div>
        </div>
      </div>
      <button
        onClick={onDeregister}
        className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide text-red-600 hover:bg-red-50 transition-colors"
      >
        Deregister
      </button>
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

// ============================================================
// PENDING DEVICE DETAIL — shown when registration is awaiting approval
// ============================================================

function PendingDeviceDetail({ device, onDeregister }) {
  const fuel = FUEL[device.icon];
  const Icon = fuel.icon;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <Card className="p-7 relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-30"
          style={{ background: "#FB923C" }}
        />

        <div className="relative">
          <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <span
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: fuel.bg, color: fuel.color, opacity: 0.85 }}
              >
                <Icon className="w-7 h-7" strokeWidth={2} />
              </span>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-tertiary)] tracking-widest uppercase mb-1.5">
                  <Hash className="w-3 h-3" />
                  <span className="mono">{device.id}</span>
                </div>
                <h1 className="display text-3xl md:text-4xl font-medium leading-tight">
                  {device.name}
                </h1>
                <div className="text-[var(--text-secondary)] text-sm mt-1">
                  {device.type} · {device.capacityKw.toLocaleString()} kW capacity
                </div>
              </div>
            </div>

            <span className="flex items-center gap-2 text-xs font-bold text-orange-700 bg-orange-100 px-3.5 py-1.5 rounded-full">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              WAITING APPROVAL
            </span>
          </div>

          {/* Approval status panel */}
          <div
            className="p-7 rounded-3xl"
            style={{
              background: "linear-gradient(135deg, #FFF6EE 0%, #FFFBF7 100%)",
              border: "1px solid rgba(251,146,60,0.25)",
            }}
          >
            <div className="flex items-start justify-between mb-5 flex-wrap gap-4">
              <div>
                <div className="text-xs font-bold tracking-widest uppercase mb-2 text-orange-600">
                  Registration status
                </div>
                <div className="display text-4xl md:text-5xl font-medium leading-none mb-2">
                  Awaiting <span className="italic text-orange-600">approval</span>
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  Initiated 2h 14m ago · checking dual-issuance prevention before going live
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-secondary)] mb-1">
                  Queue position
                </div>
                <div className="display text-4xl font-medium text-[var(--text-primary)]">
                  #{device.queuePosition}
                </div>
              </div>
            </div>

            {/* Approval checklist */}
            <div className="space-y-2">
              {device.approvalChecks.map((c) => (
                <CheckItem key={c.id} status={c.status} label={c.label} sub={c.sub} />
              ))}
            </div>

            {/* Footer */}
            <div className="mt-5 pt-5 border-t border-orange-200/50 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 live-dot" />
                <span className="text-xs font-semibold text-orange-700">
                  Estimated approval: {device.estimatedApproval}
                </span>
              </div>
              <Button variant="ghost">
                Registration tx
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Registered metadata */}
      <Card className="p-7">
        <div className="text-xs font-bold text-[var(--text-tertiary)] tracking-widest uppercase mb-4">
          Submitted metadata
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <InputTile
            label="GPS"
            value={`${device.coords.lat}° N, ${device.coords.lon}° E`}
            sub={device.location.split(",")[0]}
            icon={<MapPin className="w-3.5 h-3.5" />}
          />
          <InputTile
            label="Initiated"
            value="May 8, 2026 · 11:42 UTC"
            sub="2h 14m ago"
            icon={<Calendar className="w-3.5 h-3.5" />}
          />
          <InputTile
            label="Capacity"
            value={`${device.capacityKw.toLocaleString()} kW`}
            sub={`${device.type} · bidding zone ${device.biddingZone}`}
            icon={<Zap className="w-3.5 h-3.5" />}
          />
        </div>
      </Card>

      {/* What happens next — explanatory card */}
      <Card
        className="surface-light p-7 mb-10 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #E8EFFF 0%, white 70%)",
        }}
      >
        <div className="flex items-start gap-4">
          <span className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] flex items-center justify-center flex-shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5 text-[var(--accent)]" />
          </span>
          <div>
            <h3 className="display text-2xl font-medium mb-2 leading-tight">
              Once approved, this device will{" "}
              <span className="italic" style={{ color: "var(--accent)" }} style={{ paddingRight: "0.06em" }}>auto-issue</span> hourly
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              The protocol will start receiving meter readings and emitting an
              EnergyTag-compliant GC every hour, signed against your wallet's delegate key.
              No further action required — the dual-issuance check ensures no other
              registry is also issuing for this same kWh.
            </p>
          </div>
        </div>
      </Card>

      {/* Cancel pending registration — burns NFT before approval completes */}
      <DangerZone onDeregister={onDeregister} />
    </div>
  );
}

// ============================================================
// CHECK ITEM — single line in the approval checklist
// ============================================================

function CheckItem({ status, label, sub }) {
  const config = {
    passed: {
      icon: <Check className="w-3.5 h-3.5 text-emerald-700" strokeWidth={3} />,
      bg: "bg-emerald-100",
      labelColor: "text-[var(--text-primary)]",
      subColor: "text-emerald-700",
    },
    checking: {
      icon: <Loader2 className="w-3.5 h-3.5 text-orange-600 animate-spin" />,
      bg: "bg-orange-100",
      labelColor: "text-[var(--text-primary)]",
      subColor: "text-orange-700",
    },
    queued: {
      icon: <Circle className="w-3 h-3 text-[var(--text-tertiary)]" />,
      bg: "bg-[var(--bg-card-hover)]",
      labelColor: "text-[var(--text-tertiary)]",
      subColor: "text-[var(--text-tertiary)]",
    },
  };
  const c = config[status];

  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className={`w-7 h-7 rounded-full flex items-center justify-center ${c.bg} flex-shrink-0`}>
        {c.icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-bold ${c.labelColor}`}>{label}</div>
        <div className={`text-xs ${c.subColor}`}>{sub}</div>
      </div>
      {status === "passed" && (
        <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-700">
          Passed
        </span>
      )}
      {status === "checking" && (
        <span className="text-[10px] font-bold tracking-widest uppercase text-orange-700">
          Checking
        </span>
      )}
      {status === "queued" && (
        <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-tertiary)]">
          Queued
        </span>
      )}
    </div>
  );
}

// ============================================================

function InputTile({ label, value, sub, icon }) {
  return (
    <div className="p-4 rounded-2xl bg-[var(--bg-card-soft)] border border-[var(--border)]">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--text-tertiary)] tracking-widest uppercase mb-2">
        {icon} {label}
      </div>
      <div className="font-bold text-[var(--text-primary)] mono text-sm">{value}</div>
      <div className="text-xs text-[var(--text-secondary)] mt-0.5">{sub}</div>
    </div>
  );
}

function EnergyTagPanel({ device }) {
  const [copied, setCopied] = useState(false);
  const fuel = FUEL[device.icon];

  const certificate = {
    schema: "EnergyTag GC v2",
    certificate_id: `GC-CZ-2026050814-001847`,
    device_id: device.id,
    timestamp: "2026-05-08T14:00:00Z",
    face_value_wh: device.nowKwh * 1000,
    energy_carrier: "Electricity",
    energy_source: fuel.source,
    fuel_type: fuel.label,
    device_type: "Production",
    country: "CZ",
    bidding_zone: device.biddingZone,
    location: {
      lat: device.coords.lat,
      lon: device.coords.lon,
      name: device.location,
    },
    device_capacity_kw: device.capacityKw,
    commercial_operation_date: device.commissioned,
    issuer: "HILIER GC Registry",
    issuance_datestamp: "2026-05-08T14:00:12Z",
  };

  const json = JSON.stringify(certificate, null, 2);

  const copy = () => {
    navigator.clipboard?.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between p-7 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-tertiary)] tracking-widest uppercase mb-1">
            <Cpu className="w-3 h-3" />
            Latest GC · auto-issued
          </div>
          <h3 className="display text-2xl font-medium">
            EnergyTag GC schema
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Protocol issues one hourly granular certificate per registered device — no manual steps.
          </p>
        </div>
        <Button variant="soft" onClick={copy}>
          {copied ? (
            <><Check className="w-3.5 h-3.5" /> Copied</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Copy JSON</>
          )}
        </Button>
      </div>

      {/* JSON viewer */}
      <div
        className="mx-7 mb-7 rounded-2xl overflow-hidden"
        style={{ background: "#0F172A" }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2.5 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          <span className="mono text-[11px] text-[var(--text-tertiary)] ml-2">
            certificate.json
          </span>
          <span className="ml-auto mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
            EnergyTag v2
          </span>
        </div>
        <pre
          className="mono text-[12.5px] leading-relaxed p-5 overflow-x-auto"
          style={{ color: "#E2E8F0" }}
        >
          <Json data={certificate} />
        </pre>
      </div>

      {/* Footer — on-chain confirmation, no manual action */}
      <div className="flex items-center justify-between gap-4 px-7 py-4 border-t border-[var(--border)] flex-wrap">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-emerald-700" strokeWidth={3} />
          </span>
          <div>
            <div className="text-xs font-bold text-[var(--text-primary)]">
              On-chain · Block 21,408,772
            </div>
            <div className="mono text-[11px] text-[var(--text-secondary)]">
              tx 0x4f2a…a2c1 · 14:00:12 UTC
            </div>
          </div>
        </div>
        <Button variant="ghost">
          View on Etherscan
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

// Tiny JSON pretty-printer with token coloring
function Json({ data, indent = 0 }) {
  const pad = "  ".repeat(indent);
  if (data === null) return <span style={{ color: "#94a3b8" }}>null</span>;
  if (typeof data === "string") return <span style={{ color: "#86efac" }}>"{data}"</span>;
  if (typeof data === "number") return <span style={{ color: "#fcd34d" }}>{data}</span>;
  if (typeof data === "boolean") return <span style={{ color: "#fca5a5" }}>{String(data)}</span>;

  if (Array.isArray(data)) {
    return (
      <>
        {"["}
        {data.map((v, i) => (
          <span key={i}>
            {"\n" + pad + "  "}
            <Json data={v} indent={indent + 1} />
            {i < data.length - 1 ? "," : ""}
          </span>
        ))}
        {"\n" + pad + "]"}
      </>
    );
  }

  const keys = Object.keys(data);
  return (
    <>
      {"{"}
      {keys.map((k, i) => (
        <span key={k}>
          {"\n" + pad + "  "}
          <span style={{ color: "#7dd3fc" }}>"{k}"</span>
          <span style={{ color: "#94a3b8" }}>: </span>
          <Json data={data[k]} indent={indent + 1} />
          {i < keys.length - 1 ? "," : ""}
        </span>
      ))}
      {"\n" + pad + "}"}
    </>
  );
}

// ============================================================
// REGISTER DEVICE MODAL — 7-step flow
// device-type → connect-vrm → select-installation → confirm → signing → minting → success
// Each step is its own component for clarity. State machine in parent.
// ============================================================

const DEVICE_TYPES = [
  { id: "solar", label: "Solar PV", icon: Sun, color: "#F4B14A", bg: "#FFF6E5", desc: "Rooftop or ground-mount panels" },
  { id: "wind", label: "Wind", icon: Wind, color: "#06B6D4", bg: "#E0F7FA", desc: "Small turbines (under 50 kW)" },
  { id: "hilier", label: "HILIER LDES", icon: Zap, color: "#FF6B4A", bg: "#FFEFE8", desc: "Long-duration energy storage" },
  { id: "battery", label: "Battery", icon: Battery, color: "#8B5CF6", bg: "#F1ECFE", desc: "Time-shift solar with battery" },
];

// Mock VRM installations available to the user (in real app, fetched after OAuth)
const VRM_INSTALLATIONS = [
  { id: "82a4c1f2", name: "Vinohrady Rooftop", capacity: 5.4, type: "solar", lat: 50.0755, lon: 14.4378, location: "Praha Vinohrady, CZ", lastReading: "4.2 kWh" },
  { id: "7d3b2e91", name: "Garden Setup #2", capacity: 5.0, type: "solar", lat: 49.4949, lon: 17.4509, location: "Olomouc, CZ", lastReading: "3.6 kWh" },
  { id: "9f8a1c34", name: "MultiPlus 48/5000", capacity: 5.0, type: "battery", lat: 50.0876, lon: 14.4213, location: "Praha 5, CZ", lastReading: "Idle · 84% SoC" },
];

function RegisterDeviceModal({ onClose, onRegister }) {
  const [step, setStep] = useState("device-type");
  const [deviceType, setDeviceType] = useState(null);
  const [installation, setInstallation] = useState(null);

  // Mock blockchain artifacts
  const txHash = "0x4f2a8b91c3f88d17a2c1e92b6e4f9a8d5b3c7f1e";
  const tokenId = "#" + (1247 + Math.floor(Math.random() * 99));

  const handleAuthorize = () => setStep("select-installation");
  const handleSelectInstallation = (inst) => { setInstallation(inst); setStep("confirm"); };
  const handleSign = () => {
    setStep("signing");
    setTimeout(() => setStep("minting"), 1500);
    setTimeout(() => setStep("success"), 4000);
  };

  // Build the new device object that will appear in the registry as pending
  const handleViewInRegistry = () => {
    if (!installation || !deviceType) {
      onClose();
      return;
    }
    const t = DEVICE_TYPES.find((d) => d.id === deviceType);
    const newDevice = {
      id: tokenId,
      name: installation.name,
      type: t?.label === "HILIER LDES" ? "LDES + CHP" : t?.label || "Device",
      icon: deviceType === "battery" ? "hilier" : deviceType, // battery uses hilier visuals for now
      location: installation.location,
      coords: { lat: installation.lat, lon: installation.lon },
      capacityKw: installation.capacity,
      nowKwh: null,
      todayKwh: null,
      status: "pending",
      commissioned: null,
      biddingZone: "CZ",
      registrationInitiated: new Date().toISOString(),
      queuePosition: 1,
      estimatedApproval: "~2-4 hours",
      approvalChecks: [
        { id: "source", label: "Energy source verification", sub: `${t?.label || "Source"} confirmed via Victron VRM`, status: "passed" },
        { id: "grid", label: "Grid connection verified", sub: "ČEPS bidding zone CZ · meter ID confirmed", status: "passed" },
        { id: "dual", label: "Dual-issuance check", sub: "Querying neighbouring registries (AIB, REGO)…", status: "checking" },
        { id: "meter", label: "Metering data validation", sub: "Awaiting 24h baseline", status: "queued" },
      ],
    };
    onRegister?.(newDevice);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--bg-card)", color: "var(--text-primary)", boxShadow: "0 24px 80px -12px rgba(15,23,42,0.4)" }}
      >
        {step === "device-type" && (
          <ChooseTypeStep
            onPick={(t) => { setDeviceType(t); setStep("connect-vrm"); }}
            onClose={onClose}
          />
        )}
        {step === "connect-vrm" && (
          <ConnectVrmStep
            onBack={() => setStep("device-type")}
            onConnect={() => setStep("authorize")}
            onClose={onClose}
          />
        )}
        {step === "authorize" && (
          <AuthorizeAccessStep
            onBack={() => setStep("connect-vrm")}
            onAuthorize={handleAuthorize}
            onClose={onClose}
          />
        )}
        {step === "select-installation" && (
          <SelectInstallationStep
            deviceType={deviceType}
            onBack={() => setStep("authorize")}
            onSelect={handleSelectInstallation}
            onClose={onClose}
          />
        )}
        {step === "confirm" && (
          <ConfirmDetailsStep
            deviceType={deviceType}
            installation={installation}
            onBack={() => setStep("select-installation")}
            onSign={handleSign}
            onClose={onClose}
          />
        )}
        {step === "signing" && <RegSigningStep onClose={onClose} />}
        {step === "minting" && <RegMintingStep txHash={txHash} onClose={onClose} />}
        {step === "success" && (
          <RegSuccessStep
            deviceType={deviceType}
            installation={installation}
            tokenId={tokenId}
            txHash={txHash}
            onClose={handleViewInRegistry}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================

function StepHeader({ stepNum, totalSteps, title, onBack, onClose }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="w-7 h-7 rounded-full hover:bg-[var(--bg-card-hover)] flex items-center justify-center transition-colors -ml-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          </button>
        )}
        <div className="text-xs font-bold text-[var(--text-tertiary)] tracking-widest uppercase">
          {stepNum && totalSteps ? `Step ${stepNum} of ${totalSteps} · ` : ""}
          {title}
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-full hover:bg-[var(--bg-card-hover)] flex items-center justify-center transition-colors"
      >
        <X className="w-4 h-4 text-[var(--text-secondary)]" />
      </button>
    </div>
  );
}

// ============================================================
// STEP 1: CHOOSE DEVICE TYPE
// ============================================================

function ChooseTypeStep({ onPick, onClose }) {
  return (
    <div className="p-7">
      <StepHeader stepNum={1} totalSteps={5} title="Register device" onClose={onClose} />

      <h2 className="display text-3xl font-medium leading-tight mb-1">
        What kind of device?
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        Pick the type of installation you want to add to Certino.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {DEVICE_TYPES.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onPick(t.id)}
              className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)] hover:bg-[var(--bg-card-soft)] transition-all text-left"
            >
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: t.bg, color: t.color }}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
              </span>
              <div className="font-bold text-[var(--text-primary)] text-sm">{t.label}</div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">{t.desc}</div>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-[var(--text-tertiary)] text-center mt-5">
        Your device NFT will be minted to your wallet · ERC-721 on Base
      </p>
    </div>
  );
}

// ============================================================
// STEP 2: CONNECT VRM (OAuth-style consent)
// ============================================================

function ConnectVrmStep({ onBack, onConnect, onClose }) {
  return (
    <div className="p-7">
      <StepHeader stepNum={2} totalSteps={5} title="Register device" onBack={onBack} onClose={onClose} />

      {/* Single Victron logo, big and centered */}
      <div className="flex items-center justify-center mb-6">
        <span
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-white font-extrabold text-3xl"
          style={{
            background: "linear-gradient(135deg, #0078C8 0%, #0066B2 100%)",
            boxShadow: "0 12px 32px -8px rgba(0,102,178,0.45)",
          }}
        >
          V
        </span>
      </div>

      <h2 className="display text-3xl font-medium leading-tight text-center mb-1">
        Connect your <span className="italic text-[#0066B2]" style={{ paddingRight: "0.06em" }}>Victron</span> account
      </h2>
      <p className="text-sm text-[var(--text-secondary)] text-center mb-6 max-w-xs mx-auto">
        Sign in with your VRM credentials to link your Victron installations.
      </p>

      {/* Sign-in button — simulates external OAuth */}
      <button
        onClick={onConnect}
        className="w-full py-3.5 rounded-full text-white font-semibold text-base flex items-center justify-center gap-2 transition-all hover:opacity-95"
        style={{
          background: "linear-gradient(135deg, #0078C8 0%, #0066B2 100%)",
          boxShadow: "0 8px 24px -8px rgba(0,102,178,0.45)",
        }}
      >
        <ExternalLink className="w-4 h-4" />
        Sign in with Victron VRM
      </button>

      {/* Trust line */}
      <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-[var(--text-secondary)]">
        <ShieldCheck className="w-3 h-3 text-emerald-600" strokeWidth={2.5} />
        Opens at <span className="mono text-[var(--text-secondary)]">vrm.victronenergy.com</span>
      </div>

      <button
        onClick={onBack}
        className="w-full mt-3 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        Cancel
      </button>

      <p className="text-[11px] text-[var(--text-tertiary)] text-center mt-4">
        Don't have a Victron account? <span className="text-[var(--accent)] font-semibold underline cursor-pointer">Set one up</span>
      </p>
    </div>
  );
}

// ============================================================
// STEP 3: AUTHORIZE — consent for VRM data + free public APIs
// ============================================================

function AuthorizeAccessStep({ onBack, onAuthorize, onClose }) {
  return (
    <div className="p-7">
      <StepHeader stepNum={3} totalSteps={5} title="Register device" onBack={onBack} onClose={onClose} />

      {/* Trio of logos — Victron + Certino + free APIs */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <span className="w-11 h-11 rounded-2xl bg-[#0066B2] flex items-center justify-center text-white font-extrabold">
          V
        </span>
        <Link2 className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
        <span className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center">
          <svg viewBox="0 0 60 70" width="20" height="24">
            <path d="M30 3 L55 17 L55 53 L30 67 L5 53 L5 17 Z" fill="#2A4DD0" />
            <path d="M30 3 L55 17 L30 31 L5 17 Z" fill="#3F60DC" />
          </svg>
        </span>
        <Link2 className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
        <span className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-emerald-700" strokeWidth={2} />
        </span>
      </div>

      <div className="flex items-center justify-center gap-1 mb-1">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold tracking-widest uppercase">
          <Check className="w-2.5 h-2.5" strokeWidth={3} />
          Connected to VRM
        </span>
      </div>

      <h2 className="display text-3xl font-medium leading-tight text-center mb-1">
        Authorize data access
      </h2>
      <p className="text-sm text-[var(--text-secondary)] text-center mb-5 max-w-sm mx-auto">
        Certino reads your VRM data and cross-checks it against public energy registries to verify your claim is unique.
      </p>

      {/* Group 1: VRM data */}
      <div className="rounded-2xl border border-[var(--border)] p-4 mb-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-md bg-[#0066B2] flex items-center justify-center text-white font-bold text-[10px]">V</span>
          <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-secondary)]">
            From your Victron VRM
          </div>
        </div>
        <div className="space-y-2.5">
          <PermRow label="Installation IDs and metadata" sub="device list, capacity, install date" />
          <PermRow label="GPS coordinates" sub="for bidding zone classification (CZ)" />
          <PermRow label="Hourly meter readings" sub="cryptographically signed by Victron VRM" />
          <PermRow label="Battery state of charge" sub="for premium-hour time-shift verification" />
        </div>
      </div>

      {/* Group 2: Free public APIs */}
      <div className="rounded-2xl border border-[var(--border)] p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-700" strokeWidth={2.2} />
          <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-secondary)]">
            From public registries · free APIs
          </div>
        </div>
        <div className="space-y-2.5">
          <PermRow label="AIB / REGO dual-issuance check" sub="prevents the same kWh being claimed twice" />
          <PermRow label="OTE-CR spot price feed" sub="determines premium tier hours (€/MWh)" />
          <PermRow label="ČEPS bidding zone reference" sub="classifies your installation zone (CZ)" />
        </div>
      </div>

      <Button variant="dark" className="w-full !py-3 !text-base" onClick={onAuthorize}>
        Authorize Certino
      </Button>
      <button
        onClick={onBack}
        className="w-full mt-2 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        Back
      </button>

      <p className="text-[11px] text-[var(--text-tertiary)] text-center mt-3">
        You can revoke access anytime from your VRM account settings.
      </p>
    </div>
  );
}

function PermRow({ label, sub }) {
  return (
    <div className="flex items-start gap-2.5">
      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" strokeWidth={3} />
      <div>
        <div className="text-sm font-semibold text-[var(--text-primary)]">{label}</div>
        <div className="text-[11px] text-[var(--text-secondary)]">{sub}</div>
      </div>
    </div>
  );
}

// ============================================================
// STEP 3: SELECT INSTALLATION
// ============================================================

function SelectInstallationStep({ deviceType, onBack, onSelect, onClose }) {
  // Filter VRM installations by selected device type
  const filtered = VRM_INSTALLATIONS.filter((i) => i.type === deviceType);
  const matchType = DEVICE_TYPES.find((t) => t.id === deviceType);

  return (
    <div className="p-7">
      <StepHeader stepNum={4} totalSteps={5} title="Register device" onBack={onBack} onClose={onClose} />

      <h2 className="display text-3xl font-medium leading-tight mb-1">
        Pick an installation
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-1">
        Found in your Victron VRM account.
      </p>
      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot" />
        Connected to VRM · {VRM_INSTALLATIONS.length} {VRM_INSTALLATIONS.length === 1 ? "device" : "devices"} found
      </div>

      <div className="space-y-2 mb-4">
        {filtered.length === 0 ? (
          <div className="p-4 rounded-2xl bg-[var(--bg-card-soft)] text-sm text-[var(--text-secondary)] text-center">
            No {matchType?.label} devices in your VRM account.
            <br />
            <button
              onClick={onBack}
              className="text-[var(--accent)] font-semibold underline mt-1"
            >
              Go back and pick another type
            </button>
          </div>
        ) : (
          filtered.map((inst) => {
            const t = DEVICE_TYPES.find((d) => d.id === inst.type);
            const Icon = t.icon;
            return (
              <button
                key={inst.id}
                onClick={() => onSelect(inst)}
                className="w-full p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)] hover:bg-[var(--bg-card-soft)] transition-all text-left flex items-center gap-3"
              >
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: t.bg, color: t.color }}
                >
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[var(--text-primary)] text-sm">{inst.name}</div>
                  <div className="mono text-[11px] text-[var(--text-secondary)]">
                    {inst.capacity} kWp · {inst.location}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)]" />
              </button>
            );
          })
        )}
      </div>

      <p className="text-[11px] text-[var(--text-tertiary)] text-center">
        Each installation can be registered to Certino only once.
      </p>
    </div>
  );
}

// ============================================================
// STEP 4: CONFIRM DETAILS
// ============================================================

function ConfirmDetailsStep({ deviceType, installation, onBack, onSign, onClose }) {
  const t = DEVICE_TYPES.find((d) => d.id === deviceType);
  const Icon = t.icon;

  return (
    <div className="p-7">
      <StepHeader stepNum={5} totalSteps={5} title="Register device" onBack={onBack} onClose={onClose} />

      <h2 className="display text-3xl font-medium leading-tight mb-1">
        Confirm and <span className="italic" style={{ color: "var(--accent)" }}>mint</span>
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-5">
        These details will be embedded in your device NFT. Mintable once.
      </p>

      {/* Device summary card */}
      <div
        className="surface-light rounded-2xl p-5 mb-5 relative overflow-hidden"
        style={{ background: t.bg, border: `1px solid ${t.color}33` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: "white", color: t.color }}
          >
            <Icon className="w-5 h-5" strokeWidth={2} />
          </span>
          <div>
            <div className="font-bold text-[var(--text-primary)]">{installation.name}</div>
            <div
              className="text-[10px] font-bold tracking-widest uppercase mt-0.5"
              style={{ color: t.color }}
            >
              {t.label}
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t" style={{ borderColor: `${t.color}22` }}>
          <KVRow label="VRM ID" value={installation.id} mono />
          <KVRow label="Capacity" value={`${installation.capacity} kWp`} />
          <KVRow label="GPS" value={`${installation.lat}° N, ${installation.lon}° E`} mono />
          <KVRow label="Bidding zone" value="CZ" />
          <KVRow label="Last reading" value={installation.lastReading} />
        </div>
      </div>

      {/* What happens next */}
      <div className="surface-light rounded-2xl bg-blue-50 border border-blue-100 p-3 mb-5 flex items-start gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[var(--accent)] mt-0.5 flex-shrink-0" />
        <div className="text-[11px] text-[var(--text-secondary)] leading-snug">
          <strong className="font-bold">After signing:</strong> NFT mints to your wallet, then the protocol runs automated checks (dual-issuance, registry conflicts) before issuing GCs. Approval ~2-4h.
        </div>
      </div>

      <Button variant="dark" className="w-full !py-3 !text-base" onClick={onSign}>
        <Wallet className="w-4 h-4" />
        Sign to mint device NFT
      </Button>

      <p className="text-[11px] text-[var(--text-tertiary)] text-center mt-3">
        ERC-721 on Base · the NFT stays in your wallet · burn to deregister
      </p>
    </div>
  );
}

function KVRow({ label, value, mono = false }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[11px] text-[var(--text-secondary)]">{label}</span>
      <span className={`text-[12px] font-semibold text-[var(--text-primary)] ${mono ? "mono text-[11px]" : ""}`}>
        {value}
      </span>
    </div>
  );
}

// ============================================================
// STEP 5: SIGNING
// ============================================================

function RegSigningStep({ onClose }) {
  return (
    <div className="p-7 py-12 text-center">
      <div
        className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
        style={{ background: "#E8EFFF" }}
      >
        <Loader2 className="w-7 h-7 text-[var(--accent)] animate-spin" />
      </div>
      <h2 className="display text-2xl font-medium mb-2">
        Sign in your wallet
      </h2>
      <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
        Open your wallet to confirm the device NFT mint.
      </p>
    </div>
  );
}

// ============================================================
// STEP 6: MINTING ON-CHAIN
// ============================================================

function RegMintingStep({ txHash, onClose }) {
  return (
    <div className="p-7 py-12 text-center">
      <div
        className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
        style={{ background: "#FFEFE8" }}
      >
        <Loader2 className="w-7 h-7 text-[var(--accent)] animate-spin" />
      </div>
      <h2 className="display text-2xl font-medium mb-2">
        Minting device NFT
      </h2>
      <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto mb-4">
        Your device identity is being written to your wallet on-chain.
      </p>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card-hover)] mono text-[11px] text-[var(--text-secondary)]">
        <Hash className="w-3 h-3" />
        {txHash.slice(0, 10)}…{txHash.slice(-6)}
      </div>
    </div>
  );
}

// ============================================================
// STEP 7: SUCCESS — NFT minted, now entering pending approval
// ============================================================

function RegSuccessStep({ deviceType, installation, tokenId, txHash, onClose }) {
  const t = DEVICE_TYPES.find((d) => d.id === deviceType);
  const Icon = t.icon;

  return (
    <div className="p-7">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-emerald-700">
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
          NFT minted
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-[var(--bg-card-hover)] flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-[var(--text-secondary)]" />
        </button>
      </div>

      <h2 className="display text-3xl font-medium leading-tight mb-1">
        Device <span className="italic text-emerald-600">registered</span>
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-5">
        NFT lives in your wallet. Protocol approval running next.
      </p>

      {/* NFT preview card */}
      <div
        className="surface-light rounded-3xl p-5 mb-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${t.bg} 0%, white 70%)`,
          border: `1.5px solid ${t.color}44`,
        }}
      >
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold tracking-widest uppercase">
          <ShieldCheck className="w-2.5 h-2.5" strokeWidth={2.5} />
          Owned
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "white", color: t.color }}
          >
            <Icon className="w-5 h-5" strokeWidth={2} />
          </span>
          <div>
            <div
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: t.color }}
            >
              Certino Device · {t.label}
            </div>
            <div className="font-bold text-[var(--text-primary)]">{installation.name}</div>
          </div>
        </div>

        <div className="space-y-1.5 pt-4 border-t" style={{ borderColor: `${t.color}33` }}>
          <KVRow label="Token ID" value={tokenId} mono />
          <KVRow label="Owner" value="0x7xKp…j2nQ" mono />
          <KVRow label="Tx hash" value={`${txHash.slice(0, 10)}…${txHash.slice(-6)}`} mono />
          <KVRow label="Standard" value="ERC-721 on Base" />
        </div>
      </div>

      {/* Pending approval notice */}
      <div className="surface-light rounded-2xl bg-orange-50 border border-orange-200/60 p-3.5 mb-4 flex items-start gap-2">
        <Loader2 className="w-3.5 h-3.5 text-orange-600 animate-spin mt-0.5 flex-shrink-0" />
        <div className="text-[11px] text-[var(--text-secondary)] leading-snug">
          <strong className="font-bold text-orange-700">Pending protocol approval.</strong>{" "}
          Automated checks running: dual-issuance verification across AIB / REGO registries, metering data validation, grid connection check. Estimated ~2–4 hours.
        </div>
      </div>

      <Button variant="dark" className="w-full" onClick={onClose}>
        View in registry <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}


// ============================================================
// EMPTY STATES — shown when no wallet OR no devices
// Hero with primary CTA centered. Big, friendly, encouraging.
// ============================================================

function EmptyWalletState({ onConnect }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] py-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)]/70 border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-5">
          <Sparkles className="w-3 h-3 text-[var(--accent)]" />
          Step 1 of 2
        </span>

        <h1 className="display text-5xl md:text-6xl font-medium leading-[1.05] mb-4">
          Start earning <span className="italic" style={{ color: "var(--accent)" }}>premium credits</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-lg mb-9 max-w-md mx-auto leading-relaxed">
          Connect your wallet to register your installation and mint carbon credits
          for every kWh you provide to the grid.
        </p>

        {/* Giant interactive pill — bubble + label + arrow are ALL the button */}
        <button
          onClick={onConnect}
          className="group inline-flex items-center gap-5 pl-3 pr-7 py-3 rounded-full bg-[var(--bg-card)] border border-[var(--border-strong)] hover:bg-slate-50 transition-all"
          style={{
            boxShadow:
              "0 18px 60px -18px rgba(42,77,208,0.45), 0 4px 12px -4px rgba(0,0,0,0.05)",
          }}
        >
          <span
            className="w-14 h-14 rounded-full flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 float transition-transform"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #4F70E0, #2A4DD0 60%, #1E3AAA)",
              boxShadow: "0 8px 24px -6px rgba(42,77,208,0.5)",
            }}
          >
            <Wallet className="w-6 h-6" strokeWidth={2} />
          </span>
          <span className="text-left">
            <span className="display block text-2xl font-medium text-[var(--text-primary)] leading-tight">
              Connect wallet
            </span>
            <span className="block text-xs text-[var(--text-secondary)] mt-0.5">
              Email · Apple ID · Google · via{" "}
              <span className="font-semibold text-[var(--text-secondary)]">Privy</span>
            </span>
          </span>
          <ArrowRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}

function EmptyDevicesState({ onRegister }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] py-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)]/70 border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-5">
          <Sparkles className="w-3 h-3 text-[var(--accent)]" />
          Step 2 of 2
        </span>

        <h1 className="display text-5xl md:text-6xl font-medium leading-[1.05] mb-4">
          Register your first device
        </h1>
        <p className="text-[var(--text-secondary)] text-lg mb-9 max-w-md mx-auto leading-relaxed">
          Connect your Victron VRM to mint your device NFT and start earning
          premium certificates from the kWh you deliver to the grid.
        </p>

        {/* Giant interactive pill — bubble + label + arrow */}
        <button
          onClick={onRegister}
          className="group inline-flex items-center gap-5 pl-3 pr-7 py-3 rounded-full bg-[var(--bg-card)] border border-[var(--border-strong)] hover:bg-slate-50 transition-all"
          style={{
            boxShadow:
              "0 18px 60px -18px rgba(255,107,74,0.45), 0 4px 12px -4px rgba(0,0,0,0.05)",
          }}
        >
          <span
            className="w-14 h-14 rounded-full flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 float transition-transform"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #FFB497, #FF6B4A 60%, #E04E2C)",
              boxShadow: "0 8px 24px -6px rgba(255,107,74,0.5)",
            }}
          >
            <Plus className="w-7 h-7" strokeWidth={2.4} />
          </span>
          <span className="text-left">
            <span className="display block text-2xl font-medium text-[var(--text-primary)] leading-tight">
              Register device
            </span>
            <span className="block text-xs text-[var(--text-secondary)] mt-0.5">
              Mint NFT to your wallet · ERC-721 on Base
            </span>
          </span>
          <ArrowRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}

// ============================================================
// DEREGISTER DEVICE MODAL — burn the NFT
// 4 states: confirm → signing → burning → success (auto-closes)
// ============================================================

function DeregisterDeviceModal({ device, onClose, onConfirm }) {
  const [step, setStep] = useState("confirm");
  const fuel = FUEL[device.icon];
  const Icon = fuel.icon;
  const txHash = "0xb1a44e92c8d717f3c3e9dc8d5b3c7f1e4f2a8b91";

  const handleBurn = () => {
    setStep("signing");
    setTimeout(() => setStep("burning"), 1500);
    setTimeout(() => setStep("success"), 4000);
    setTimeout(() => onConfirm(), 5500); // auto-close to registry
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(8px)" }}
      onClick={step === "confirm" ? onClose : undefined}
    >
      <div
        className="rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--bg-card)", color: "var(--text-primary)", boxShadow: "0 24px 80px -12px rgba(15,23,42,0.4)" }}
      >
        {step === "confirm" && (
          <div className="p-7">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-red-600">
                <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2.5} />
                Destructive action
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-[var(--bg-card-hover)] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
            </div>

            <h2 className="display text-3xl font-medium leading-tight mb-1">
              Deregister <span className="italic text-red-600">device</span>?
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-5">
              This burns the device NFT and removes it from your registry. Cancellation
              records of past GCs stay on-chain.
            </p>

            {/* Device preview — same source coloring */}
            <div
              className="surface-light rounded-2xl p-4 mb-5 flex items-center gap-3"
              style={{ background: fuel.bg, border: `1px solid ${fuel.color}33` }}
            >
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "white", color: fuel.color }}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[var(--text-primary)] text-sm truncate">{device.name}</div>
                <div className="mono text-[11px] text-[var(--text-secondary)]">
                  {device.id} · {device.type}
                </div>
              </div>
            </div>

            {/* Consequences list */}
            <div className="rounded-2xl bg-red-50 border border-red-100 p-4 mb-5 space-y-2">
              <ConseqRow label="NFT will be burned" />
              <ConseqRow label="GC issuance stops immediately" />
              <ConseqRow label="Past certificates remain valid for buyers" />
              <ConseqRow label="You can re-register the same device later" />
            </div>

            {/* CTAs */}
            <button
              onClick={handleBurn}
              className="w-full py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-base flex items-center justify-center gap-2 transition-colors"
            >
              <Flame className="w-4 h-4" />
              Burn NFT &amp; deregister
            </button>
            <button
              onClick={onClose}
              className="w-full mt-2 py-2.5 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {step === "signing" && (
          <div className="p-7 py-12 text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{ background: "#FEE2E2" }}
            >
              <Loader2 className="w-7 h-7 text-red-600 animate-spin" />
            </div>
            <h2 className="display text-2xl font-medium mb-2">
              Sign in your <span className="italic text-red-600">wallet</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
              Confirm the burn transaction in your wallet.
            </p>
          </div>
        )}

        {step === "burning" && (
          <div className="p-7 py-12 text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{ background: "#FEE2E2" }}
            >
              <Flame className="w-7 h-7 text-red-600 animate-pulse" />
            </div>
            <h2 className="display text-2xl font-medium mb-2">
              Burning <span className="italic text-red-600">NFT</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto mb-4">
              Your device NFT is being burned on-chain.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card-hover)] mono text-[11px] text-[var(--text-secondary)]">
              <Hash className="w-3 h-3" />
              {txHash.slice(0, 10)}…{txHash.slice(-6)}
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="p-7 py-12 text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center bg-emerald-50"
            >
              <Check className="w-8 h-8 text-emerald-600" strokeWidth={3} />
            </div>
            <h2 className="display text-2xl font-medium mb-2">
              Device <span className="italic text-emerald-600">deregistered</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
              NFT burned. The device no longer appears in your registry.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ConseqRow({ label }) {
  return (
    <div className="flex items-start gap-2 text-[12px] text-[var(--text-secondary)]">
      <span className="w-1 h-1 rounded-full bg-red-400 mt-2 flex-shrink-0" />
      <span>{label}</span>
    </div>
  );
}

// ============================================================
// LANDING VIEW — entry route, role chooser
// In Next.js this is `app/page.tsx`; here it's the default route
// ============================================================

function LandingView({ theme, setTheme, onSelectProducer, onSelectBuyer }) {
  const [hover, setHover] = useState(null);

  return (
    <div
      data-theme={theme}
      className="min-h-screen w-full overflow-hidden"
      style={{
        background: "var(--bg-page)",
        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
        color: "var(--text-primary)",
      }}
    >
      <ThemeStyles />

      <div className="max-w-6xl mx-auto px-6 py-10 md:py-16 min-h-screen flex flex-col">
        {/* Pill header — mirrors landing-page Header */}
        <div
          className="flex items-center justify-between gap-4 pl-5 pr-2 py-2 rounded-full mb-12 md:mb-16"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(12px)",
            boxShadow:
              "0 1px 2px rgba(15, 33, 42, 0.04), 0 12px 32px -8px rgba(15, 33, 42, 0.08)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Logo -> back to landing */}
          <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <HilierMark className="w-7 h-8" />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-extrabold tracking-tight">Certino</span>
              <span
                className="text-[9px] font-semibold mt-0.5 tracking-widest uppercase"
                style={{ color: "var(--text-tertiary)" }}
              >
                by Treetino
              </span>
            </div>
          </a>

          {/* Nav -> jumps to landing sections */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <a
              href="/#problem"
              className="transition-colors hover:opacity-70"
              style={{ color: "var(--text-primary)" }}
            >
              The problem
            </a>
            <a
              href="/#how-it-works"
              className="transition-colors hover:opacity-70"
              style={{ color: "var(--text-primary)" }}
            >
              How it works
            </a>
            <a
              href="/#standards"
              className="transition-colors hover:opacity-70"
              style={{ color: "var(--text-primary)" }}
            >
              Standards
            </a>
          </nav>

          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>

        {/* Role chooser — index for producer / buyer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          <RoleCard
            role="producer"
            isHover={hover === "producer"}
            onEnter={() => setHover("producer")}
            onLeave={() => setHover(null)}
            onSelect={onSelectProducer}
          />
          <RoleCard
            role="buyer"
            isHover={hover === "buyer"}
            onEnter={() => setHover("buyer")}
            onLeave={() => setHover(null)}
            onSelect={onSelectBuyer}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-auto pt-8 mono text-[11px] text-[var(--text-tertiary)] tracking-wider uppercase">
          Certino Protocol v0.1.0 · Built for ETH Prague 2026
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ROLE CARD — Producer / Buyer chooser
// ============================================================

function RoleCard({ role, isHover, onEnter, onLeave, onSelect }) {
  const config = {
    producer: {
      tone: "I generate energy",
      title: "Producer",
      description:
        "Register your small Victron-powered installation. Earn premium certificates for every hour you time-shift kWh into peak demand.",
      bullets: [
        "Earn from premium REC sales",
        "Your fair share — every battery time-shift counts",
      ],
      accentColor: "#2A4DD0",
      accentBg: "#E8EFFF",
      gradient: "linear-gradient(135deg, #E8EFFF 0%, #FFFFFF 60%)",
      ctaLabel: "Continue as producer",
      icon: Zap,
    },
    buyer: {
      tone: "I source clean energy",
      title: "Buyer",
      description:
        "Source verified renewable production from small Certino producers, matched to your consumption hour by hour.",
      bullets: [
        "24/7 CFE-grade hourly matching",
        "On-chain proof for every certificate",
      ],
      accentColor: "#FF6B4A",
      accentBg: "#FFEFE8",
      gradient: "linear-gradient(135deg, #FFEFE8 0%, #FFFFFF 60%)",
      ctaLabel: "Continue as buyer",
      icon: Leaf,
    },
  }[role];

  const Icon = config.icon;

  return (
    <button
      onClick={onSelect}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="surface-light group p-7 rounded-3xl border transition-all text-left relative overflow-hidden flex flex-col h-full"
      style={{
        background: config.gradient,
        borderColor: isHover ? config.accentColor + "55" : "rgba(229,222,207,0.6)",
        boxShadow: isHover
          ? `0 24px 60px -20px ${config.accentColor}40, 0 4px 12px -4px rgba(0,0,0,0.05)`
          : "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.06)",
        transform: isHover ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <span
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "white", color: config.accentColor }}
        >
          <Icon className="w-6 h-6" strokeWidth={2} />
        </span>
        <span
          className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: config.accentColor }}
        >
          {config.tone}
        </span>
      </div>

      <h2 className="display text-4xl md:text-5xl font-medium leading-[1.05] mb-4 whitespace-nowrap">
        I'm a{" "}
        <span
          className="italic"
          style={{ color: config.accentColor, paddingRight: "0.04em" }}
        >
          {config.title}
        </span>
      </h2>

      <p className="text-[var(--text-secondary)] leading-relaxed mb-5">
        {config.description}
      </p>

      <div className="space-y-1.5 mb-7 mt-auto pt-2">
        {config.bullets.map((b, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
            <Check
              className="w-3.5 h-3.5 mt-1 flex-shrink-0"
              style={{ color: config.accentColor }}
              strokeWidth={3}
            />
            <span>{b}</span>
          </div>
        ))}
      </div>

      {/* CTA pill */}
      <div
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-transform group-hover:translate-x-1"
        style={{ background: config.accentColor }}
      >
        {config.ctaLabel}
        <ArrowRight className="w-4 h-4" />
      </div>
    </button>
  );
}

// ============================================================
// BUYER VIEW — full buyer dashboard
// In Next.js this is `app/buyer/page.tsx`; here it's a route inside the demo
// ============================================================

const BUY_OFFERS = [
  {
    id: "pool-solar",
    type: "solar",
    label: "Solar",
    price: 41,
    vsBaseline: 38,
    monthEndEstimate: 480,
    committed: 312,
  },
  {
    id: "pool-wind",
    type: "wind",
    label: "Wind",
    price: 38,
    vsBaseline: 38,
    monthEndEstimate: 320,
    committed: 286,
  },
  {
    id: "pool-mixed",
    type: "mixed",
    label: "Mixed",
    price: 42,
    vsBaseline: 38,
    monthEndEstimate: 1200,
    committed: 540,
  },
];

const BUY_ACCENTS = {
  solar: { bg: "#FFF6E5", border: "#F4B14A33", text: "#F4B14A", icon: Sun },
  wind: { bg: "#E0F7FA", border: "#06B6D433", text: "#06B6D4", icon: Wind },
  mixed: { bg: "#F1ECFE", border: "#8B5CF633", text: "#8B5CF6", icon: Sparkles },
};

function BuyerView({ theme, setTheme, onBack }) {
  const [walletConnected, setWalletConnected] = useState(false); // start disconnected
  const [account, setAccount] = useState(null);                  // null until onboarded
  const [filter, setFilter] = useState("all");
  const [buyingOffer, setBuyingOffer] = useState(null);
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [consumptionTarget, setConsumptionTarget] = useState(null); // null = not yet set
  const [targetInput, setTargetInput] = useState(1600);
  const matchedMWh = 1247; // mock — in production from on-chain GC totals
  const coveragePct = consumptionTarget
    ? Math.min(100, Math.round((matchedMWh / consumptionTarget) * 100))
    : 0;

  // Buyer view state branching
  const buyerView = !walletConnected
    ? "no-wallet"
    : !account
    ? "no-account"
    : "dashboard";

  return (
    <div
      data-theme={theme}
      className="min-h-screen w-full"
      style={{
        background: "var(--bg-page)",
        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
        color: "var(--text-primary)",
      }}
    >
      <ThemeStyles />

      <div className="max-w-6xl mx-auto px-6 py-6 md:py-10">
        {/* ============ NAV ============ */}
        <nav className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Back to landing"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <HilierMark className="w-9 h-10" />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-extrabold tracking-tight">Certino</span>
              <span
                className="text-[10px] font-semibold mt-1 tracking-widest uppercase"
                style={{ color: "var(--accent)" }}
              >
                Buyer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <button
              onClick={() => setWalletConnected(!walletConnected)}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all"
              style={
                walletConnected
                  ? { background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-primary)" }
                  : { background: "var(--accent)", borderColor: "var(--accent)", color: "var(--accent-on)" }
              }
            >
              {walletConnected ? (
                <>
                  <span
                    className="w-6 h-6 rounded-full"
                    style={{ background: "linear-gradient(135deg, var(--accent), #7D9BA4, #0F3B47)" }}
                  />
                  <span className="mono text-xs">7xKp…j2nQ</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  Connect wallet
                </>
              )}
            </button>
          </div>
        </nav>

        {/* ============ ROUTE: NO WALLET ============ */}
        {buyerView === "no-wallet" && (
          <EmptyWalletStateBuyer onConnect={() => setWalletConnected(true)} />
        )}

        {/* ============ ROUTE: NO ACCOUNT ============ */}
        {buyerView === "no-account" && (
          <EmptyAccountStateBuyer onSetup={() => setOnboardOpen(true)} />
        )}

        {/* ============ ROUTE: DASHBOARD ============ */}
        {buyerView === "dashboard" && (
          <>
            {/* ============ OWN CONSUMPTION COVERAGE ============ */}
            <Card
              className="surface-light p-7 mb-5 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #FFE8DC 0%, #FFD7B5 60%, #FFC299 100%)" }}
            >
              {!consumptionTarget ? (
                /* ============ TARGET SETUP STATE ============ */
                <div className="md:flex md:items-center md:gap-8">
                  <div className="md:flex-1 mb-5 md:mb-0">
                    <div className="text-xs font-bold tracking-widest uppercase text-[var(--text-secondary)]/70 mb-2">
                      Own consumption coverage
                    </div>
                    <h3 className="display text-3xl md:text-4xl font-medium leading-tight">
                      Set your annual target
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]/80 mt-2 max-w-sm">
                      Tell us roughly how much energy you consume per year — we'll match it to certificates.
                    </p>
                  </div>

                  <div className="md:flex-shrink-0 md:w-[280px]">
                    {/* Stepper */}
                    <div className="rounded-2xl bg-[var(--bg-card)]/50 backdrop-blur-sm border border-white/60 p-3 mb-3">
                      <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-secondary)]/70 mb-1.5 text-center">
                        Annual consumption
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setTargetInput(Math.max(100, targetInput - 100))}
                          className="w-9 h-9 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] flex items-center justify-center font-bold text-[var(--text-secondary)] transition-colors"
                        >
                          −
                        </button>
                        <div className="text-center">
                          <div className="display text-2xl font-medium leading-none">{targetInput.toLocaleString()}</div>
                          <div className="mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-0.5">
                            MWh / year
                          </div>
                        </div>
                        <button
                          onClick={() => setTargetInput(targetInput + 100)}
                          className="w-9 h-9 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] flex items-center justify-center font-bold text-[var(--text-secondary)] transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <Button
                      variant="dark"
                      className="w-full !py-2.5"
                      onClick={() => setConsumptionTarget(targetInput)}
                    >
                      Set target
                    </Button>

                    <p className="text-[11px] text-[var(--text-secondary)]/70 text-center mt-3 leading-snug">
                      <Sparkles className="w-2.5 h-2.5 inline mr-1 text-[var(--accent)]" />
                      Smart meter integration coming soon — auto-track your real consumption
                    </p>
                  </div>
                </div>
              ) : (
                /* ============ COVERAGE DISPLAY STATE ============ */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:items-center">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-bold tracking-widest uppercase text-[var(--text-secondary)]/70">
                        Own consumption coverage
                      </div>
                      <button
                        onClick={() => setConsumptionTarget(null)}
                        className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-secondary)]/60 hover:text-[var(--text-primary)] transition-colors"
                      >
                        Edit target
                      </button>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="display text-4xl font-medium italic text-[var(--text-primary)] leading-none">{coveragePct}</span>
                      <span className="text-lg text-[var(--text-secondary)]">%</span>
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]/80 mt-3 max-w-sm">
                      {matchedMWh.toLocaleString()} MWh matched of your {consumptionTarget.toLocaleString()} MWh annual target. {coveragePct >= 100 ? "Full coverage achieved." : "On track for full coverage."}
                    </div>
                  </div>

                  <div>
                    <div className="h-2.5 rounded-full bg-[var(--bg-card)]/40 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${coveragePct}%`, background: "linear-gradient(90deg, #FF6B4A, #FF8869)" }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 mono text-[10px] text-[var(--text-secondary)]/70 uppercase tracking-wider mb-5">
                      <span>0%</span>
                      <span>target {consumptionTarget.toLocaleString()} MWh</span>
                    </div>
                    <div className="space-y-2.5">
                      <BuyRow label="Consumption matched" value={`${matchedMWh.toLocaleString()} MWh`} />
                      <BuyRow label="Verified on-chain" value={`${matchedMWh.toLocaleString()} GCs`} />
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* ============ MARKETPLACE ============ */}
            <Card className="p-7 mb-5">
              <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
                <div>
                  <div className="text-xs font-bold text-[var(--text-tertiary)] tracking-widest uppercase mb-1">
                    Live marketplace · small producers across CZ
                  </div>
                  <h3 className="display text-2xl font-medium">
                    Carbon credits direct from <span className="italic" style={{ color: "var(--accent)" }} style={{ paddingRight: "0.06em" }}>small</span> verified producers
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { id: "all", label: "All" },
                    { id: "solar", label: "Solar" },
                    { id: "wind", label: "Wind" },
                    { id: "mixed", label: "Mixed" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
                        filter === f.id ? "bg-slate-900 text-white" : "bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
                      }`}
                    >
                      {f.label.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {BUY_OFFERS
                  .filter((o) => filter === "all" || o.type === filter)
                  .map((o) => (
                    <OfferCard key={o.id} offer={o} onBuy={() => setBuyingOffer(o)} />
                  ))}
              </div>
            </Card>

            {/* ============ RECEIPTS ============ */}
            <Card className="p-7 mb-10">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="text-xs font-bold text-[var(--text-tertiary)] tracking-widest uppercase mb-1">
                    Recent purchases
                  </div>
                  <h3 className="display text-2xl font-medium">
                    On-chain provenance
                  </h3>
                </div>
                <Button variant="ghost">All 1,247 <ArrowRight className="w-3.5 h-3.5" /></Button>
              </div>

              <div className="space-y-2">
                {[
                  { t: "14:22", v: "2.4 MWh", src: "Solar", color: "amber", price: "€105.60" },
                  { t: "14:07", v: "1.8 MWh", src: "Wind", color: "cyan", price: "€73.80" },
                  { t: "13:38", v: "3.2 MWh", src: "Solar", color: "amber", price: "€140.80" },
                  { t: "13:22", v: "1.5 MWh", src: "Wind", color: "cyan", price: "€61.50" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-[var(--bg-card-soft)] transition-colors">
                    <div className="flex items-center gap-4">
                      <SourceTag color={row.color}>{row.src}</SourceTag>
                      <div>
                        <div className="font-semibold text-[var(--text-primary)]">{row.v}</div>
                        <div className="mono text-xs text-[var(--text-secondary)]">{row.t} · {row.src} pool</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-[var(--text-primary)]">{row.price}</span>
                      <ArrowUpRight className="w-4 h-4 text-[var(--text-tertiary)]" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>

      {/* ============ BUY FLOW MODAL ============ */}
      {buyingOffer && (
        <BuyFlowModal offer={buyingOffer} onClose={() => setBuyingOffer(null)} />
      )}

      {/* ============ BUYER ONBOARDING MODAL ============ */}
      {onboardOpen && (
        <BuyerOnboardingModal
          onClose={() => setOnboardOpen(false)}
          onComplete={(acc) => { setAccount(acc); setOnboardOpen(false); }}
        />
      )}
    </div>
  );
}

// ============================================================
// EMPTY STATES — Buyer (coral-themed)
// ============================================================

function EmptyWalletStateBuyer({ onConnect }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] py-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)]/70 border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-5">
          <Sparkles className="w-3 h-3 text-[var(--accent)]" />
          Step 1 of 2
        </span>

        <h1 className="display text-5xl md:text-6xl font-medium leading-[1.05] mb-4">
          Source <span className="italic" style={{ color: "var(--accent)" }}>premium credits</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-lg mb-9 max-w-md mx-auto leading-relaxed">
          Connect your wallet to set up your buyer account and start sourcing
          carbon credits matched hour-by-hour to your consumption.
        </p>

        <button
          onClick={onConnect}
          className="group inline-flex items-center gap-5 pl-3 pr-7 py-3 rounded-full bg-[var(--bg-card)] border border-[var(--border-strong)] hover:bg-slate-50 transition-all"
          style={{
            boxShadow:
              "0 18px 60px -18px rgba(255,107,74,0.45), 0 4px 12px -4px rgba(0,0,0,0.05)",
          }}
        >
          <span
            className="w-14 h-14 rounded-full flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 float transition-transform"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #FFB497, #FF6B4A 60%, #E04E2C)",
              boxShadow: "0 8px 24px -6px rgba(255,107,74,0.5)",
            }}
          >
            <Wallet className="w-6 h-6" strokeWidth={2} />
          </span>
          <span className="text-left">
            <span className="display block text-2xl font-medium text-[var(--text-primary)] leading-tight">
              Connect wallet
            </span>
            <span className="block text-xs text-[var(--text-secondary)] mt-0.5">
              Email · Apple ID · Google · via{" "}
              <span className="font-semibold text-[var(--text-secondary)]">Privy</span>
            </span>
          </span>
          <ArrowRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}

function EmptyAccountStateBuyer({ onSetup }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] py-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)]/70 border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-5">
          <Sparkles className="w-3 h-3 text-[var(--accent)]" />
          Step 2 of 2
        </span>

        <h1 className="display text-5xl md:text-6xl font-medium leading-[1.05] mb-4">
          Set up your buyer account
        </h1>
        <p className="text-[var(--text-secondary)] text-lg mb-9 max-w-md mx-auto leading-relaxed">
          Register your claim type, authorize Certino to retire certificates and
          write cancellation records to public registries on your behalf.
        </p>

        <button
          onClick={onSetup}
          className="group inline-flex items-center gap-5 pl-3 pr-7 py-3 rounded-full bg-[var(--bg-card)] border border-[var(--border-strong)] hover:bg-slate-50 transition-all"
          style={{
            boxShadow:
              "0 18px 60px -18px rgba(42,77,208,0.45), 0 4px 12px -4px rgba(0,0,0,0.05)",
          }}
        >
          <span
            className="w-14 h-14 rounded-full flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 float transition-transform"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #4F70E0, #2A4DD0 60%, #1E3AAA)",
              boxShadow: "0 8px 24px -6px rgba(42,77,208,0.5)",
            }}
          >
            <UserPlus className="w-6 h-6" strokeWidth={2} />
          </span>
          <span className="text-left">
            <span className="display block text-2xl font-medium text-[var(--text-primary)] leading-tight">
              Set up account
            </span>
            <span className="block text-xs text-[var(--text-secondary)] mt-0.5">
              Soulbound NFT in your wallet · ERC-721 on Base
            </span>
          </span>
          <ArrowRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}

// ============================================================
// BUYER HELPERS
// ============================================================

function BuyRow({ label, value, bold = false }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <span className={`font-${bold ? "bold" : "semibold"} text-[var(--text-primary)]`}>{value}</span>
    </div>
  );
}

function BuyKV({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[11px] text-[var(--text-secondary)]">{label}</span>
      <span className="mono text-[11px] font-semibold text-[var(--text-primary)]">{value}</span>
    </div>
  );
}

function SourceTag({ color, children }) {
  const colors = {
    amber: { bg: "#FFF6E5", text: "#F4B14A" },
    cyan: { bg: "#E0F7FA", text: "#06B6D4" },
    violet: { bg: "#F1ECFE", text: "#8B5CF6" },
  };
  const c = colors[color] || colors.amber;
  return (
    <span
      className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
      style={{ background: c.bg, color: c.text }}
    >
      {children}
    </span>
  );
}

function OfferCard({ offer, onBuy }) {
  const a = BUY_ACCENTS[offer.type];
  const Icon = a.icon;
  const committedPct = (offer.committed / offer.monthEndEstimate) * 100;
  const room = offer.monthEndEstimate - offer.committed;
  const isAlmostFull = committedPct > 80;
  const diff = ((1 - offer.price / offer.vsBaseline) * 100).toFixed(0);
  const isAboveBaseline = offer.price > offer.vsBaseline;

  return (
    <div
      className="surface-light p-5 rounded-2xl border transition-all hover:scale-[1.02] flex flex-col"
      style={{ background: a.bg, borderColor: a.border }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5" style={{ color: a.text }} />
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: a.text }}>
            {offer.label}
          </span>
        </span>
        <span className="w-2 h-2 rounded-full" style={{ background: a.text }} />
      </div>

      <div className="display text-3xl font-medium leading-none">
        €{offer.price}
        <span className="text-sm text-[var(--text-secondary)] ml-0.5 font-normal">/MWh</span>
      </div>
      <div className="mono text-[11px] text-[var(--text-secondary)] mt-1">indicative · settles 5 Jun</div>

      <div className="mt-4 pt-4 border-t" style={{ borderColor: a.border }}>
        <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase text-[var(--text-tertiary)] mb-2">
          <span>Month-end pool</span>
          {isAlmostFull && (
            <span className="text-[var(--accent)] tracking-wide">Filling fast</span>
          )}
        </div>
        <div className="h-2 rounded-full bg-[var(--bg-card)]/60 overflow-hidden mb-2">
          <div className="h-full rounded-full transition-all" style={{ width: `${committedPct}%`, background: a.text }} />
        </div>
        <div className="flex items-baseline justify-between mono text-[11px] mb-3">
          <span className="text-[var(--text-secondary)]">
            <strong className="text-[var(--text-primary)] font-bold">{offer.committed}</strong> MWh committed
          </span>
          <span className="text-[var(--text-secondary)]">
            of <strong className="text-[var(--text-secondary)] font-bold">{offer.monthEndEstimate}</strong> est.
          </span>
        </div>

        {/* Emphasized room callout */}
        <div
          className="rounded-xl px-3 py-2.5 flex items-baseline justify-between"
          style={{ background: a.text + "1A" }}
        >
          <span
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: a.text }}
          >
            Free for deposits
          </span>
          <span
            className="display text-xl font-medium leading-none"
            style={{ color: a.text }}
          >
            ~{room} <span className="text-xs font-normal">MWh</span>
          </span>
        </div>
      </div>

      <div
        className="text-xs font-semibold mt-3 pt-3 border-t flex items-center gap-1"
        style={{ borderColor: a.border, color: a.text }}
      >
        <TrendingDown className="w-3 h-3" />
        {isAboveBaseline ? `+${Math.abs(diff)}%` : `−${diff}%`} vs EU avg
      </div>

      <button
        onClick={onBuy}
        className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase text-white transition-all hover:opacity-90"
        style={{ background: a.text }}
      >
        <ShoppingCart className="w-3 h-3 inline mr-1.5" />
        Deposit now
      </button>
    </div>
  );
}

// ============================================================
// BUY FLOW MODAL — 4 states: review → signing → confirming → success
// ============================================================

function BuyFlowModal({ offer, onClose }) {
  const [step, setStep] = useState("review");
  const [depositAmount, setDepositAmount] = useState(100);
  const indicativeMwh = (depositAmount / offer.price).toFixed(2);
  const txHash = "0x4f2a8b91c3f88d17a2c1e92b6e4f9a8d5b3c7f1e";
  const certId = `CRT-CZ-2026-${Math.floor(Math.random() * 999999).toString().padStart(6, "0")}`;

  const handleSign = () => {
    setStep("signing");
    setTimeout(() => setStep("confirming"), 1500);
    setTimeout(() => setStep("success"), 4000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--bg-card)", color: "var(--text-primary)", boxShadow: "0 24px 80px -12px rgba(15,23,42,0.4)" }}
      >
        {step === "review" && (
          <BuyReviewStep
            offer={offer}
            depositAmount={depositAmount}
            setDepositAmount={setDepositAmount}
            indicativeMwh={indicativeMwh}
            onSign={handleSign}
            onClose={onClose}
          />
        )}
        {step === "signing" && <BuySigningStep onClose={onClose} />}
        {step === "confirming" && <BuyConfirmingStep txHash={txHash} onClose={onClose} />}
        {step === "success" && (
          <BuySuccessStep
            offer={offer}
            depositAmount={depositAmount}
            indicativeMwh={indicativeMwh}
            txHash={txHash}
            certId={certId}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}

function BuyReviewStep({ offer, depositAmount, setDepositAmount, indicativeMwh, onSign, onClose }) {
  const a = BUY_ACCENTS[offer.type];
  return (
    <div className="p-7">
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs font-bold text-[var(--text-tertiary)] tracking-widest uppercase">Review deposit</div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-[var(--bg-card-hover)] flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-[var(--text-secondary)]" />
        </button>
      </div>

      <h2 className="display text-3xl font-medium leading-tight mb-1">
        Deposit for <span className="italic" style={{ color: a.text }}>{offer.label}</span> credits
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-1">
        Pooled across all registered {offer.label.toLowerCase()} grid enhancers
      </p>
      <p className="text-xs text-[var(--text-tertiary)] mb-6">
        Settles <strong className="text-[var(--text-secondary)]">5 Jun</strong> — when EPEX SPOT publishes the May auction index.
      </p>

      <div className="rounded-2xl border border-[var(--border)] p-4 mb-4">
        <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-tertiary)] mb-2 flex items-center justify-between">
          <span>Deposit amount</span>
          <span className="mono text-[9px] text-[var(--text-secondary)] normal-case tracking-normal">EURC stablecoin</span>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setDepositAmount(Math.max(50, depositAmount - 50))}
            className="w-9 h-9 rounded-full bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card-hover)] flex items-center justify-center font-bold text-[var(--text-secondary)]"
          >
            −
          </button>
          <div className="text-center">
            <div className="display text-3xl font-medium">€{depositAmount}</div>
            <div className="mono text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-0.5">
              ~{indicativeMwh} MWh @ €{offer.price}/MWh
            </div>
          </div>
          <button
            onClick={() => setDepositAmount(depositAmount + 50)}
            className="w-9 h-9 rounded-full bg-[var(--bg-card-hover)] hover:bg-[var(--bg-card-hover)] flex items-center justify-center font-bold text-[var(--text-secondary)]"
          >
            +
          </button>
        </div>
      </div>

      <div className="rounded-2xl p-4 mb-5 space-y-2.5" style={{ background: a.bg }}>
        <BuyRow label="Deposit" value={`${depositAmount.toFixed(2)} EURC`} />
        <BuyRow label="Indicative price" value={`€${offer.price.toFixed(2)}/MWh`} />
        <BuyRow label="Indicative volume" value={`~${indicativeMwh} MWh`} />
        <div className="border-t pt-2.5 mt-2" style={{ borderColor: a.border }}>
          <BuyRow label="Settlement" value="5 Jun" bold />
        </div>
      </div>

      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[var(--bg-card-soft)] mb-5 border border-[var(--border)]">
        <span
          className="w-7 h-7 rounded-full"
          style={{ background: "linear-gradient(135deg, #FF6B4A, #FFD7B5, #2A4DD0)" }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-tertiary)]">Pay with EURC</div>
          <div className="mono text-xs text-[var(--text-secondary)]">7xKp…j2nQ</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-[var(--text-tertiary)]">Balance</div>
          <div className="mono text-xs font-bold">2,418 EURC</div>
        </div>
      </div>

      <Button variant="dark" className="w-full !py-3 !text-base" onClick={onSign}>
        <Wallet className="w-4 h-4" />
        Sign to deposit
      </Button>

      <p className="text-[11px] text-[var(--text-tertiary)] text-center mt-3">
        Final volume depends on the published EPEX index. Excess refunded.
      </p>
    </div>
  );
}

function BuySigningStep({ onClose }) {
  return (
    <div className="p-7 py-12 text-center">
      <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "#E8EFFF" }}>
        <Loader2 className="w-7 h-7 text-[var(--accent)] animate-spin" />
      </div>
      <h2 className="display text-2xl font-medium mb-2">
        Sign in your wallet
      </h2>
      <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
        Open your wallet to confirm the deposit transaction.
      </p>
    </div>
  );
}

function BuyConfirmingStep({ txHash, onClose }) {
  return (
    <div className="p-7 py-12 text-center">
      <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "#FFEFE8" }}>
        <Loader2 className="w-7 h-7 text-[var(--accent)] animate-spin" />
      </div>
      <h2 className="display text-2xl font-medium mb-2">
        Locking deposit on-chain
      </h2>
      <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto mb-4">
        Your EURC is being escrowed into the pool. Receipt will be ready next — final certificate issues after settlement on 5 Jun.
      </p>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card-hover)] mono text-[11px] text-[var(--text-secondary)]">
        <Hash className="w-3 h-3" />
        {txHash.slice(0, 10)}…{txHash.slice(-6)}
      </div>
    </div>
  );
}

function BuySuccessStep({ offer, depositAmount, indicativeMwh, txHash, certId, onClose }) {
  const a = BUY_ACCENTS[offer.type];
  return (
    <div className="p-7">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-emerald-700">
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
          Deposit confirmed
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-[var(--bg-card-hover)] flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-[var(--text-secondary)]" />
        </button>
      </div>

      <h2 className="display text-3xl font-medium leading-tight mb-1">
        Your <span className="italic text-emerald-600">deposit</span> is locked
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-5">
        Settles 5 Jun against the EPEX SPOT May auction · final certificate issued automatically.
      </p>

      <div
        className="surface-light rounded-3xl p-6 mb-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${a.bg} 0%, white 70%)`,
          border: `1.5px solid ${a.border}`,
        }}
      >
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[9px] font-bold tracking-widest uppercase">
          <Loader2 className="w-2.5 h-2.5 animate-spin" />
          Awaiting settlement
        </div>

        <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: a.text }}>
          Certino Carbon Credit · pending
        </div>
        <div className="display text-4xl font-medium leading-none mb-1">
          ~{indicativeMwh} <span className="text-xl text-[var(--text-tertiary)] font-normal">MWh</span>
        </div>
        <div className="text-sm font-semibold text-[var(--text-secondary)] mb-4">
          {offer.label} pool · CZ
        </div>

        <div className="space-y-1.5 pt-4 border-t" style={{ borderColor: a.border }}>
          <BuyKV label="Deposit" value={`${depositAmount.toFixed(2)} EURC`} />
          <BuyKV label="Cert ID" value={certId} />
          <BuyKV label="Vintage" value="2026 May" />
          <BuyKV label="Owner" value="7xKp…j2nQ" />
          <BuyKV label="Tx hash" value={`${txHash.slice(0, 10)}…${txHash.slice(-6)}`} />
          <BuyKV label="Settlement" value="5 Jun · EPEX SPOT May auction" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <Button variant="dark">
          <Download className="w-3.5 h-3.5" /> Receipt PDF
        </Button>
        <Button variant="soft">
          <ExternalLink className="w-3.5 h-3.5" /> View on-chain
        </Button>
      </div>

      <button
        onClick={onClose}
        className="w-full mt-3 py-2.5 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        Done
      </button>
    </div>
  );
}

// ============================================================
// BUYER ONBOARDING MODAL
// 4 user steps: claim type → account details → authorize agency → review
// + 3 transactional: signing → minting → success
// Mints a SOULBOUND account NFT (non-transferable) representing buyer identity
// ============================================================

const CLAIM_TYPES = [
  {
    id: "personal",
    label: "Personal offset",
    icon: Leaf,
    color: "#10B981",
    bg: "#D1FAE5",
    desc: "Offset my own carbon footprint",
  },
  {
    id: "business",
    label: "Business · Scope 2",
    icon: Building2,
    color: "#2A4DD0",
    bg: "#E8EFFF",
    desc: "ESG / CSRD reporting",
  },
  {
    id: "product",
    label: "Carbon-neutral product",
    icon: Tag,
    color: "#F4B14A",
    bg: "#FFF6E5",
    desc: "Offset a product's emissions",
  },
  {
    id: "reseller",
    label: "Reseller / portfolio",
    icon: Layers,
    color: "#8B5CF6",
    bg: "#F1ECFE",
    desc: "Source on behalf of others",
  },
];

function BuyerOnboardingModal({ onClose, onComplete }) {
  const [step, setStep] = useState("claim-type");
  const [claimType, setClaimType] = useState(null);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("Czechia");
  const [regNumber, setRegNumber] = useState("");

  const txHash = "0x9e2b1f8c4d77a3e6f2c1b8a59e4d7c3f2a8b91c3";
  const tokenId = "#" + (8421 + Math.floor(Math.random() * 99));

  const handleSign = () => {
    setStep("signing");
    setTimeout(() => setStep("minting"), 1500);
    setTimeout(() => setStep("success"), 4000);
  };

  const handleEnterDashboard = () => {
    onComplete?.({ claimType, name, country, regNumber, tokenId });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--bg-card)", color: "var(--text-primary)", boxShadow: "0 24px 80px -12px rgba(15,23,42,0.4)" }}
      >
        {step === "claim-type" && (
          <BO_ClaimTypeStep
            onPick={(t) => { setClaimType(t); setStep("account-details"); }}
            onClose={onClose}
          />
        )}
        {step === "account-details" && (
          <BO_AccountDetailsStep
            claimType={claimType}
            name={name} setName={setName}
            country={country} setCountry={setCountry}
            regNumber={regNumber} setRegNumber={setRegNumber}
            onBack={() => setStep("claim-type")}
            onNext={() => setStep("authorize")}
            onClose={onClose}
          />
        )}
        {step === "authorize" && (
          <BO_AuthorizeStep
            onBack={() => setStep("account-details")}
            onAuthorize={() => setStep("review")}
            onClose={onClose}
          />
        )}
        {step === "review" && (
          <BO_ReviewStep
            claimType={claimType} name={name} country={country} regNumber={regNumber}
            onBack={() => setStep("authorize")}
            onSign={handleSign}
            onClose={onClose}
          />
        )}
        {step === "signing" && <BO_SigningStep />}
        {step === "minting" && <BO_MintingStep txHash={txHash} />}
        {step === "success" && (
          <BO_SuccessStep
            claimType={claimType} name={name} tokenId={tokenId} txHash={txHash}
            onEnter={handleEnterDashboard}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================
// STEP HEADER (small reusable for buyer onboarding)
// ============================================================

function BO_Header({ stepNum, totalSteps, onBack, onClose }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="w-7 h-7 rounded-full hover:bg-[var(--bg-card-hover)] flex items-center justify-center transition-colors -ml-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          </button>
        )}
        <div className="text-xs font-bold text-[var(--text-tertiary)] tracking-widest uppercase">
          Step {stepNum} of {totalSteps} · Buyer onboarding
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-full hover:bg-[var(--bg-card-hover)] flex items-center justify-center transition-colors"
      >
        <X className="w-4 h-4 text-[var(--text-secondary)]" />
      </button>
    </div>
  );
}

// ============================================================
// STEP 1: CHOOSE CLAIM TYPE
// ============================================================

function BO_ClaimTypeStep({ onPick, onClose }) {
  return (
    <div className="p-7">
      <BO_Header stepNum={1} totalSteps={4} onClose={onClose} />

      <h2 className="display text-3xl font-medium leading-tight mb-1">
        What's your claim type?
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        How will you use these certificates? This determines what registries we report to.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {CLAIM_TYPES.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onPick(t.id)}
              className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)] hover:bg-[var(--bg-card-soft)] transition-all text-left"
            >
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: t.bg, color: t.color }}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
              </span>
              <div className="font-bold text-[var(--text-primary)] text-sm">{t.label}</div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">{t.desc}</div>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-[var(--text-tertiary)] text-center mt-5">
        Your buyer account NFT will be soulbound — bound to your wallet, non-transferable
      </p>
    </div>
  );
}

// ============================================================
// STEP 2: ACCOUNT DETAILS
// ============================================================

function BO_AccountDetailsStep({ claimType, name, setName, country, setCountry, regNumber, setRegNumber, onBack, onNext, onClose }) {
  const t = CLAIM_TYPES.find((c) => c.id === claimType);
  const isCompany = claimType !== "personal";
  const canContinue = name.trim().length >= 2;

  return (
    <div className="p-7">
      <BO_Header stepNum={2} totalSteps={4} onBack={onBack} onClose={onClose} />

      <h2 className="display text-3xl font-medium leading-tight mb-1">
        Account details
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-5">
        These get embedded in your soulbound account NFT and shown in audit chains.
      </p>

      {/* Claim type recap */}
      <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-full bg-[var(--bg-card-soft)] border border-[var(--border)] w-fit">
        <span
          className="w-5 h-5 rounded-md flex items-center justify-center"
          style={{ background: t.bg, color: t.color }}
        >
          <t.icon className="w-3 h-3" strokeWidth={2.5} />
        </span>
        <span className="text-[11px] font-bold tracking-wider text-[var(--text-secondary)]">
          {t.label}
        </span>
      </div>

      {/* Form */}
      <div className="space-y-3 mb-5">
        <BO_Field
          label={isCompany ? "Company / entity name" : "Full name"}
          value={name}
          onChange={setName}
          placeholder={isCompany ? "e.g. Treetino s.r.o." : "e.g. Martin Novák"}
        />
        <BO_Field
          label="Country"
          value={country}
          onChange={setCountry}
          placeholder="Czechia"
        />
        {isCompany && (
          <BO_Field
            label="Registration number (optional)"
            value={regNumber}
            onChange={setRegNumber}
            placeholder="e.g. 123 45 678"
          />
        )}
      </div>

      {/* Privacy note */}
      <div className="surface-light rounded-2xl bg-blue-50 border border-blue-100 p-3 mb-5 flex items-start gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)] mt-0.5 flex-shrink-0" strokeWidth={2.2} />
        <div className="text-[11px] text-[var(--text-secondary)] leading-snug">
          <strong className="font-bold">Stored as a hash on-chain</strong> by default.
          Plain-text version stays in encrypted off-chain storage, revealable only to auditors with your consent.
        </div>
      </div>

      <Button
        variant="dark"
        className={`w-full !py-3 !text-base ${!canContinue ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={canContinue ? onNext : undefined}
      >
        Continue <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

function BO_Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-tertiary)] mb-1.5">
        {label}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl border focus:outline-none text-sm transition-all"
        style={{
          background: "var(--bg-card)",
          color: "var(--text-primary)",
          borderColor: "var(--border)",
        }}
      />
    </div>
  );
}

// ============================================================
// STEP 3: AUTHORIZE CERTINO AS AGENT
// The regulatory consent — Certino acts on buyer's behalf for retirement
// ============================================================

function BO_AuthorizeStep({ onBack, onAuthorize, onClose }) {
  return (
    <div className="p-7">
      <BO_Header stepNum={3} totalSteps={4} onBack={onBack} onClose={onClose} />

      {/* Logo trio: Buyer → Certino → Registries */}
      <div className="flex items-center justify-center gap-2 mb-5">
        <span
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{ background: "#FFEFE8", color: "#FF6B4A" }}
        >
          <UserPlus className="w-5 h-5" strokeWidth={2} />
        </span>
        <Link2 className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
        <span className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center">
          <svg viewBox="0 0 60 70" width="20" height="24">
            <path d="M30 3 L55 17 L55 53 L30 67 L5 53 L5 17 Z" fill="#2A4DD0" />
            <path d="M30 3 L55 17 L30 31 L5 17 Z" fill="#3F60DC" />
          </svg>
        </span>
        <Link2 className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
        <span className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <BadgeCheck className="w-5 h-5 text-emerald-700" strokeWidth={2} />
        </span>
      </div>

      <h2 className="display text-3xl font-medium leading-tight text-center mb-1">
        Authorize Certino as your <span className="italic" style={{ color: "var(--accent)" }}>agent</span>
      </h2>
      <p className="text-sm text-[var(--text-secondary)] text-center mb-5 max-w-sm mx-auto">
        Certino retires certificates and submits cancellation records to public registries on your behalf.
      </p>

      {/* Group 1: On-chain retirement (current) */}
      <div className="rounded-2xl border border-[var(--border)] p-4 mb-3">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-[var(--accent)]" strokeWidth={2.2} />
          <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-secondary)]">
            On-chain retirement · live
          </div>
        </div>
        <div className="space-y-2.5">
          <PermRow label="Burn purchased certificates after settlement" sub="prevents resale, locks the claim to your wallet" />
          <PermRow label="Issue cancellation receipts as PDFs" sub="downloadable for ESG / Scope 2 reports" />
          <PermRow label="Lock retirement records on Base" sub="immutable on-chain proof" />
        </div>
      </div>

      {/* Group 2: Registry agency (future) */}
      <div
        className="surface-light rounded-2xl p-4 mb-5 relative"
        style={{
          background: "linear-gradient(135deg, #F1ECFE 0%, #FCFAF5 70%)",
          border: "1px solid rgba(139,92,246,0.25)",
        }}
      >
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[9px] font-bold tracking-widest uppercase">
          Future
        </div>
        <div className="flex items-center gap-2 mb-3">
          <BadgeCheck className="w-4 h-4 text-violet-600" strokeWidth={2.2} />
          <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--text-secondary)]">
            Regulatory registry · upon accreditation
          </div>
        </div>
        <div className="space-y-2.5">
          <PermRow label="Write cancellations to AIB / EnergyTag" sub="recognised under EU RED III hourly matching" />
          <PermRow label="Submit Scope 2 evidence to ČEPS" sub="for Czech bidding zone reporting" />
          <PermRow label="Represent your claim in third-party audits" sub="ESG verifiers receive read access on request" />
        </div>
      </div>

      <Button variant="dark" className="w-full !py-3 !text-base" onClick={onAuthorize}>
        Authorize Certino as my agent
      </Button>
      <button
        onClick={onBack}
        className="w-full mt-2 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        Back
      </button>

      <p className="text-[11px] text-[var(--text-tertiary)] text-center mt-3">
        Burn your account NFT to revoke all permissions instantly.
      </p>
    </div>
  );
}

// ============================================================
// STEP 4: REVIEW & SIGN
// ============================================================

function BO_ReviewStep({ claimType, name, country, regNumber, onBack, onSign, onClose }) {
  const t = CLAIM_TYPES.find((c) => c.id === claimType);
  const Icon = t.icon;

  return (
    <div className="p-7">
      <BO_Header stepNum={4} totalSteps={4} onBack={onBack} onClose={onClose} />

      <h2 className="display text-3xl font-medium leading-tight mb-1">
        Review and <span className="italic" style={{ color: "var(--accent)" }}>mint</span>
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-5">
        These details will be embedded in your soulbound account NFT.
      </p>

      <div
        className="surface-light rounded-2xl p-5 mb-5 relative overflow-hidden"
        style={{ background: t.bg, border: `1px solid ${t.color}33` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: "white", color: t.color }}
          >
            <Icon className="w-5 h-5" strokeWidth={2} />
          </span>
          <div>
            <div className="font-bold text-[var(--text-primary)]">{name || "—"}</div>
            <div className="text-[10px] font-bold tracking-widest uppercase mt-0.5" style={{ color: t.color }}>
              {t.label}
            </div>
          </div>
        </div>
        <div className="space-y-2 pt-4 border-t" style={{ borderColor: `${t.color}22` }}>
          <KVRow label="Country" value={country} />
          {regNumber && <KVRow label="Registration #" value={regNumber} mono />}
          <KVRow label="Agent" value="Certino Protocol" />
          <KVRow label="Permissions" value="Retire + Registry" />
        </div>
      </div>

      <div className="surface-light rounded-2xl bg-blue-50 border border-blue-100 p-3 mb-5 flex items-start gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[var(--accent)] mt-0.5 flex-shrink-0" />
        <div className="text-[11px] text-[var(--text-secondary)] leading-snug">
          <strong className="font-bold">After signing:</strong> a soulbound account NFT mints to your wallet. You can start depositing and earning matched certificates immediately.
        </div>
      </div>

      <Button variant="dark" className="w-full !py-3 !text-base" onClick={onSign}>
        <Wallet className="w-4 h-4" />
        Sign to mint account NFT
      </Button>

      <p className="text-[11px] text-[var(--text-tertiary)] text-center mt-3">
        Soulbound ERC-721 on Base · burn anytime to revoke
      </p>
    </div>
  );
}

// ============================================================
// SIGNING / MINTING / SUCCESS
// ============================================================

function BO_SigningStep() {
  return (
    <div className="p-7 py-12 text-center">
      <div
        className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
        style={{ background: "#FFEFE8" }}
      >
        <Loader2 className="w-7 h-7 text-[var(--accent)] animate-spin" />
      </div>
      <h2 className="display text-2xl font-medium mb-2">
        Sign in your wallet
      </h2>
      <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
        Open your wallet to confirm the account NFT mint.
      </p>
    </div>
  );
}

function BO_MintingStep({ txHash }) {
  return (
    <div className="p-7 py-12 text-center">
      <div
        className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
        style={{ background: "#E8EFFF" }}
      >
        <Loader2 className="w-7 h-7 text-[var(--accent)] animate-spin" />
      </div>
      <h2 className="display text-2xl font-medium mb-2">
        Minting account NFT
      </h2>
      <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto mb-4">
        Your soulbound buyer identity is being written to your wallet.
      </p>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card-hover)] mono text-[11px] text-[var(--text-secondary)]">
        <Hash className="w-3 h-3" />
        {txHash.slice(0, 10)}…{txHash.slice(-6)}
      </div>
    </div>
  );
}

function BO_SuccessStep({ claimType, name, tokenId, txHash, onEnter }) {
  const t = CLAIM_TYPES.find((c) => c.id === claimType);
  const Icon = t.icon;

  return (
    <div className="p-7">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-emerald-700">
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
          Account live
        </div>
      </div>

      <h2 className="display text-3xl font-medium leading-tight mb-1">
        Welcome to <span className="italic" style={{ color: "var(--accent)" }}>Certino</span>
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-5">
        Your soulbound account NFT is in your wallet.
      </p>

      {/* NFT preview */}
      <div
        className="surface-light rounded-3xl p-5 mb-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${t.bg} 0%, white 70%)`,
          border: `1.5px solid ${t.color}44`,
        }}
      >
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[9px] font-bold tracking-widest uppercase">
          <Flame className="w-2.5 h-2.5" />
          Soulbound
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "white", color: t.color }}
          >
            <Icon className="w-5 h-5" strokeWidth={2} />
          </span>
          <div>
            <div
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: t.color }}
            >
              Certino Buyer · {t.label}
            </div>
            <div className="font-bold text-[var(--text-primary)]">{name}</div>
          </div>
        </div>

        <div className="space-y-1.5 pt-4 border-t" style={{ borderColor: `${t.color}33` }}>
          <KVRow label="Token ID" value={tokenId} mono />
          <KVRow label="Owner" value="0x7xKp…j2nQ" mono />
          <KVRow label="Tx hash" value={`${txHash.slice(0, 10)}…${txHash.slice(-6)}`} mono />
          <KVRow label="Standard" value="Soulbound ERC-721 · Base" />
        </div>
      </div>

      <Button variant="dark" className="w-full" onClick={onEnter}>
        Enter dashboard <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

// ============================================================
// THEME — global CSS variables for light + dark modes
// Palette:
//   Main #0F3B47 (deep teal) · Hero accent #D0FF14 (acid lime)
//   Supporting #7D9BA4 (cool blue-gray) · Neutral #F6F1E7 (cream)
//   Text #15212A (near-black)
// ============================================================

function ThemeStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Hanken+Grotesk:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

      [data-theme="light"] {
        --bg-page: #F6F1E7;
        --bg-page-tint: linear-gradient(180deg, #F6F1E7 0%, #EDE5D2 100%);
        --bg-card: #FFFFFF;
        --bg-card-soft: #FCFAF5;
        --bg-card-hover: #F2EBDC;
        --bg-elevated: #FFFFFF;
        --text-primary: #15212A;
        --text-secondary: #4A6470;
        --text-tertiary: #7D9BA4;
        --accent: #0F3B47;
        --accent-soft: rgba(15, 59, 71, 0.08);
        --accent-on: #F6F1E7;
        --hero: #0F3B47;
        --hero-on: #D0FF14;
        --border: rgba(15, 59, 71, 0.12);
        --border-strong: rgba(15, 59, 71, 0.2);
        --shadow-sm: 0 1px 2px rgba(15, 33, 42, 0.04), 0 4px 12px -4px rgba(15, 33, 42, 0.06);
        --shadow-md: 0 4px 12px -2px rgba(15, 33, 42, 0.08), 0 12px 32px -8px rgba(15, 33, 42, 0.12);
        --shadow-lg: 0 16px 48px -16px rgba(15, 59, 71, 0.35), 0 4px 12px -4px rgba(15, 33, 42, 0.06);
      }

      [data-theme="dark"] {
        --bg-page: #0A1F26;
        --bg-page-tint: linear-gradient(180deg, #0A1F26 0%, #0F3B47 100%);
        --bg-card: #15212A;
        --bg-card-soft: #1A2E37;
        --bg-card-hover: #1F353F;
        --bg-elevated: #1A2E37;
        --text-primary: #F6F1E7;
        --text-secondary: #A8BEC6;
        --text-tertiary: #7D9BA4;
        --accent: #D0FF14;
        --accent-soft: rgba(208, 255, 20, 0.12);
        --accent-on: #0A1F26;
        --hero: #D0FF14;
        --hero-on: #0F3B47;
        --border: rgba(208, 255, 20, 0.12);
        --border-strong: rgba(208, 255, 20, 0.25);
        --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4), 0 4px 12px -4px rgba(0, 0, 0, 0.5);
        --shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.5), 0 12px 32px -8px rgba(0, 0, 0, 0.6);
        --shadow-lg: 0 16px 48px -16px rgba(208, 255, 20, 0.2), 0 4px 12px -4px rgba(0, 0, 0, 0.5);
      }

      .display {
        font-family: 'Instrument Serif', serif;
        letter-spacing: -0.015em;
        font-weight: 400;
      }
      .display-italic { font-style: italic; }

      .mono {
        font-family: 'JetBrains Mono', monospace;
      }

      /* ================================================================
         SURFACE-LIGHT — scope-locks CSS variables to LIGHT values inside
         any surface with a hardcoded-light background (peach, soft tints,
         source colors, tinted notices). Children using var(--text-primary)
         etc. resolve to dark text via the cascade. Hardcoded utility
         colors (text-emerald-700, text-blue-100, etc.) are preserved.
         ================================================================ */
      .surface-light {
        --bg-card: #FFFFFF;
        --bg-card-soft: #FCFAF5;
        --bg-card-hover: #F2EBDC;
        --text-primary: #15212A;
        --text-secondary: #4A6470;
        --text-tertiary: #7D9BA4;
        --accent: #0F3B47;
        --accent-soft: rgba(15, 59, 71, 0.08);
        --accent-on: #F6F1E7;
        --border: rgba(15, 59, 71, 0.12);
        --border-strong: rgba(15, 59, 71, 0.2);
        color: #15212A;
      }

      @keyframes pulse-dot { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
      .live-dot { animation: pulse-dot 1.8s ease-in-out infinite; }

      @keyframes float-slow {
        0%, 100% { transform: translateY(0) }
        50% { transform: translateY(-4px) }
      }
      .float { animation: float-slow 5s ease-in-out infinite; }

      @keyframes scale-in {
        from { opacity: 0; transform: scale(0.96) }
        to { opacity: 1; transform: scale(1) }
      }
      .scale-in { animation: scale-in 0.2s ease-out; }
    `}</style>
  );
}

// ============================================================
// THEME TOGGLE — corner switch
// ============================================================

function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        color: "var(--text-secondary)",
      }}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <SunMedium className="w-4 h-4" strokeWidth={2} />
      ) : (
        <Moon className="w-4 h-4" strokeWidth={2} />
      )}
    </button>
  );
}
