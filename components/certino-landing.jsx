"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Sun,
  Wind,
  Battery,
  Gauge,
  FileCheck2,
  Layers,
  ShoppingCart,
  Flame,
  Check,
  X,
  Clock,
  TrendingUp,
  TrendingDown,
  Leaf,
  Building2,
} from "lucide-react";

// ==========================================================================
// CERTINO LANDING PAGE
// Editorial / institutional / trust-building
// References: Klima Protocol (hero), Puro.earth (gravitas), Glow.org (diagrams)
// Palette: cream substrate, deep teal primary, Treetino navy accent, lime hero
// ==========================================================================

export default function CertinoLanding() {
  return (
    <div
      data-theme="light"
      className="min-h-screen w-full"
      style={{
        background: "var(--bg-page)",
        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
        color: "var(--text-primary)",
      }}
    >
      <ThemeStyles />
      <Header />
      <Hero />
      <Problem />
      <Architecture />
      <HowItWorks />
      <Closing />
      <Footer />
    </div>
  );
}

// ==========================================================================
// HEADER
// ==========================================================================

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-5 md:pt-6">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div
          className="flex items-center justify-between gap-4 pl-5 pr-2 py-2 rounded-full"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(12px)",
            boxShadow:
              "0 1px 2px rgba(15, 33, 42, 0.04), 0 12px 32px -8px rgba(15, 33, 42, 0.08)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 flex-shrink-0">
            <CertinoMark className="w-7 h-8" />
            <span
              className="display text-xl md:text-2xl"
              style={{ letterSpacing: "-0.01em" }}
            >
              Certino
            </span>
          </a>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <a
              href="#how-it-works"
              className="transition-colors hover:opacity-70"
              style={{ color: "var(--text-primary)" }}
            >
              How it works
            </a>
            <a
              href="#problem"
              className="transition-colors hover:opacity-70"
              style={{ color: "var(--text-primary)" }}
            >
              The problem
            </a>
            <a
              href="#standards"
              className="transition-colors hover:opacity-70"
              style={{ color: "var(--text-primary)" }}
            >
              Standards
            </a>
          </nav>

          {/* CTA */}
          <a
            href="/app"
            className="inline-flex items-center gap-1.5 px-4 md:px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-[1.02] flex-shrink-0"
            style={{
              background: "var(--text-primary)",
              color: "var(--bg-page)",
            }}
          >
            Launch App
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

// ==========================================================================
// HERO
// Two-column: editorial text left, orbital hub composition right
// Inspired by certino_hero_v2_refined.html — central live HILIER card surrounded
// by orbiting hex certificate tokens, floating data tags, pastel atmosphere.
// ==========================================================================

function Hero() {
  return (
    <section
      className="relative pt-32 md:pt-40 pb-16 md:pb-24"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 0% 0%, #F0E6F8 0%, transparent 55%), radial-gradient(ellipse 60% 60% at 100% 0%, #FFE8DC 0%, transparent 50%), radial-gradient(ellipse 80% 40% at 50% 100%, #E8EFFF 0%, transparent 60%), #F8F5EF",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 text-center relative">
        <span
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-8"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <Sparkles className="w-3 h-3" style={{ color: "var(--accent)" }} />
          EnergyTag GC Standard
        </span>

        <h1
          className="display text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.02] mb-6 tracking-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          Clean energy isn't scarce.<br />
          <span className="italic" style={{ color: "var(--accent)" }}>
            At the right hour
          </span>
          , it is.
        </h1>

        <p
          className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          style={{ color: "var(--text-secondary)" }}
        >
          Premium carbon credits for small grid enhancers — your fair share of a
          market built around utilities.
        </p>

        <a
          href="#problem"
          aria-label="Scroll to next section"
          className="scroll-cue inline-flex items-center justify-center w-12 h-12 rounded-full transition-all hover:scale-[1.08]"
          style={{
            border: "1px solid var(--border-strong)",
            color: "var(--text-primary)",
            background: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(6px)",
          }}
        >
          <ArrowDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}

function TrustPill({ dot = false, label }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 mono"
      style={{
        color: "var(--text-tertiary)",
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
      }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full live-dot"
          style={{ background: "#10B981" }}
        />
      )}
      {label}
    </span>
  );
}

// ==========================================================================
// HERO STAGE — Daylight-inspired isometric scene
// Cream substrate + subtle grid overlay + isometric house with solar panels +
// inverter "oracle" box + floating data tags. Lifted from the visual language
// of Daylight (the solar service brand) but with our deep-teal + lime palette
// instead of orange.
// ==========================================================================

function HeroStage() {
  return (
    <div className="relative h-[420px] md:h-[540px] flex items-center justify-center">
      {/* Subtle grid line overlay - Daylight-style atmosphere */}
      <GridOverlay />

      {/* Central isometric house illustration */}
      <div className="relative z-10 w-full max-w-[460px]">
        <IsoHouse />
      </div>

      {/* Floating data tags — Daylight pattern */}
      <DataTag
        kicker="kWh generated"
        value="8.2 – 9.5"
        unit="kWh"
        style={{ top: "8%", right: "0%" }}
      />
      <DataTag
        kicker="Cert price"
        value="€38"
        unit="MWh"
        accent
        style={{ top: "44%", right: "4%" }}
      />
      <DataTag
        kicker="Hour"
        value="14:00"
        unit="UTC"
        style={{ bottom: "10%", left: "0%" }}
      />
      <DataTag
        kicker="Status"
        value="Minting"
        live
        style={{ top: "30%", left: "-2%" }}
      />
    </div>
  );
}

// Subtle cream-on-cream grid overlay — Daylight signature
function GridOverlay() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 600 540"
    >
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke="rgba(15,59,71,0.07)"
            strokeWidth="0.8"
          />
        </pattern>
        <radialGradient id="gridfade" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="80%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0.9" />
        </radialGradient>
      </defs>
      <rect width="600" height="540" fill="url(#grid)" />
      <rect width="600" height="540" fill="url(#gridfade)" />
    </svg>
  );
}

// Isometric house with solar panels (line-drawn, teal lines + lime accents)
function IsoHouse() {
  return (
    <svg
      viewBox="0 0 460 380"
      className="w-full h-auto"
      style={{ filter: "drop-shadow(0 24px 48px rgba(15,33,42,0.08))" }}
    >
      <defs>
        <linearGradient id="panel-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D0FF14" />
          <stop offset="100%" stopColor="#A8D80F" />
        </linearGradient>
        <linearGradient id="panel-grad-2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0F3B47" />
          <stop offset="100%" stopColor="#1A4F5C" />
        </linearGradient>
        <linearGradient id="rooflight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F6F1E7" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#0F3B47" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* Ground line shadow */}
      <ellipse cx="230" cy="350" rx="170" ry="8" fill="rgba(15,33,42,0.06)" />

      {/* === MAIN HOUSE === */}
      {/* Roof - left face (lime panels) */}
      <path
        d="M 90 165 L 230 90 L 290 120 L 150 195 Z"
        fill="url(#panel-grad)"
        stroke="#0F3B47"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Panel grid lines on left roof */}
      <g stroke="#0F3B47" strokeWidth="0.8" strokeOpacity="0.4" fill="none">
        <line x1="135" y1="142" x2="270" y2="135" />
        <line x1="180" y1="118" x2="250" y2="105" />
        <line x1="155" y1="180" x2="270" y2="155" />
        <line x1="160" y1="138" x2="220" y2="180" />
        <line x1="200" y1="115" x2="245" y2="170" />
      </g>

      {/* Roof - right face (dark teal, no panels) */}
      <path
        d="M 230 90 L 370 165 L 290 215 L 290 120 Z"
        fill="url(#panel-grad-2)"
        stroke="#0F3B47"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Subtle roof tile lines on right */}
      <g stroke="#F6F1E7" strokeWidth="0.6" strokeOpacity="0.18" fill="none">
        <line x1="252" y1="105" x2="338" y2="160" />
        <line x1="275" y1="120" x2="360" y2="175" />
        <line x1="298" y1="135" x2="290" y2="200" />
      </g>

      {/* Front wall (left face) */}
      <path
        d="M 90 165 L 150 195 L 150 305 L 90 275 Z"
        fill="#FCFAF5"
        stroke="#0F3B47"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Side wall (right face, slightly darker) */}
      <path
        d="M 150 195 L 290 120 L 290 230 L 150 305 Z"
        fill="#F0E8D4"
        stroke="#0F3B47"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Front face overlay (light) */}
      <path
        d="M 90 165 L 150 195 L 150 305 L 90 275 Z"
        fill="url(#rooflight)"
      />

      {/* Door - left face */}
      <path
        d="M 105 232 L 130 245 L 130 295 L 105 282 Z"
        fill="#0F3B47"
        stroke="#0F3B47"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Door knob */}
      <circle cx="124" cy="269" r="1.2" fill="#D0FF14" />

      {/* Window - left face */}
      <path
        d="M 100 197 L 132 215 L 132 232 L 100 215 Z"
        fill="#D0FF14"
        fillOpacity="0.9"
        stroke="#0F3B47"
        strokeWidth="1.2"
      />
      <line x1="116" y1="206" x2="116" y2="223" stroke="#0F3B47" strokeWidth="0.8" />
      <line x1="100" y1="215" x2="132" y2="215" stroke="#0F3B47" strokeWidth="0.8" />

      {/* Window - side face */}
      <path
        d="M 175 220 L 235 188 L 235 215 L 175 246 Z"
        fill="#D0FF14"
        fillOpacity="0.7"
        stroke="#0F3B47"
        strokeWidth="1.2"
      />
      <line x1="205" y1="200" x2="205" y2="231" stroke="#0F3B47" strokeWidth="0.8" />

      {/* === INVERTER / ORACLE BOX === */}
      {/* Sits next to the house — represents the "oracle on inverter" from your schema */}
      <g>
        {/* Box - top face */}
        <path
          d="M 320 248 L 360 268 L 340 280 L 300 260 Z"
          fill="#15212A"
          stroke="#0F3B47"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Box - front face */}
        <path
          d="M 300 260 L 340 280 L 340 312 L 300 292 Z"
          fill="#0F3B47"
          stroke="#0F3B47"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Box - side face */}
        <path
          d="M 340 280 L 360 268 L 360 300 L 340 312 Z"
          fill="#1F2E5C"
          stroke="#0F3B47"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* LED indicator (live pulse) */}
        <circle cx="320" cy="278" r="2.5" fill="#D0FF14">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Display label */}
        <text
          x="320"
          y="298"
          textAnchor="middle"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "7px",
            fill: "#D0FF14",
            letterSpacing: "0.1em",
          }}
        >
          ORACLE
        </text>
      </g>

      {/* Connection wire from house to oracle */}
      <path
        d="M 280 250 Q 295 252, 300 260"
        fill="none"
        stroke="#0F3B47"
        strokeWidth="1"
        strokeDasharray="2 2"
        strokeOpacity="0.5"
      />

      {/* Energy flow lines from solar panels — subtle animated dots */}
      <g>
        <circle r="2" fill="#D0FF14">
          <animateMotion
            path="M 200 130 Q 250 200, 320 250"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="1.5" fill="#D0FF14" opacity="0.7">
          <animateMotion
            path="M 200 130 Q 250 200, 320 250"
            dur="3s"
            begin="1s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  );
}

// Floating data tag — Daylight signature pattern
function DataTag({ kicker, value, unit, accent = false, live = false, style }) {
  return (
    <div
      className="absolute rounded-2xl px-4 py-3"
      style={{
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(10px)",
        border: "1px solid var(--border)",
        boxShadow:
          "0 1px 2px rgba(15,33,42,0.04), 0 16px 32px -16px rgba(15,33,42,0.18)",
        zIndex: 6,
        minWidth: 140,
        ...style,
      }}
    >
      <div
        className="mono mb-1.5 flex items-center gap-1.5"
        style={{
          fontSize: "9px",
          color: "var(--text-tertiary)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {live && (
          <span
            className="w-1.5 h-1.5 rounded-full live-dot"
            style={{ background: "#10B981" }}
          />
        )}
        {kicker}
      </div>
      <div className="flex items-baseline gap-1.5">
        <div
          className="display text-xl md:text-2xl"
          style={{
            color: accent ? "var(--accent)" : "var(--text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          {value}
        </div>
        {unit && (
          <div
            className="mono"
            style={{
              fontSize: "10px",
              color: "var(--text-tertiary)",
              letterSpacing: "0.05em",
            }}
          >
            {unit}
          </div>
        )}
      </div>
    </div>
  );
}

// PROBLEM SECTION
// Why hourly matters - the timing mismatch
// Single-column intro (full width) + day curve diagram below — no narrow side-by-side
// ==========================================================================

function Problem() {
  return (
    <section
      id="problem"
      className="relative py-24 md:py-32"
      style={{ background: "var(--bg-card-soft)", borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: text */}
          <div className="lg:col-span-5">
            <SectionKicker label="The problem" tone="navy" />
            <h2
              className="display text-4xl md:text-5xl leading-[1.05] mt-6 mb-6"
              style={{ letterSpacing: "-0.02em" }}
            >
              The grid doesn't run on annual averages.{" "}
              <span className="italic" style={{ color: "var(--navy)" }}>
                Neither should certificates.
              </span>
            </h2>
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Solar peaks at noon. Demand peaks at 8&nbsp;PM. Annual-matched
              certificates pretend those kWh are equal — and hide the gas the
              grid burns when the sun is gone.
            </p>
          </div>

          {/* Right: smaller day curve diagram */}
          <div className="lg:col-span-7">
            <DayCurveDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}

function DayCurveDiagram() {
  return (
    <div
      className="relative rounded-3xl p-7 md:p-10"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Title */}
      <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
        <div>
          <div
            className="text-[11px] font-bold tracking-widest uppercase mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            A Czech weekday · Illustrative
          </div>
          <div
            className="display italic text-2xl md:text-3xl"
            style={{ color: "var(--text-primary)" }}
          >
            Generation vs. demand
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Legend color="#F4B14A" label="Solar generation" />
          <Legend color="var(--navy)" label="Demand" />
        </div>
      </div>

      {/* SVG Chart */}
      <svg viewBox="0 0 600 300" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        <g stroke="var(--border)" strokeWidth="1">
          <line x1="40" y1="60" x2="580" y2="60" />
          <line x1="40" y1="130" x2="580" y2="130" />
          <line x1="40" y1="200" x2="580" y2="200" />
          <line x1="40" y1="260" x2="580" y2="260" />
        </g>

        {/* Premium hour shading */}
        <rect x="380" y="60" width="160" height="200" fill="#0F3B47" opacity="0.05" />
        <text
          x="460"
          y="78"
          textAnchor="middle"
          style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fill: "#0F3B47",
          }}
        >
          Premium window
        </text>

        {/* Solar generation curve */}
        <path
          d="M 40 260 Q 100 260, 130 245 Q 180 200, 230 130 Q 280 80, 310 75 Q 340 80, 380 130 Q 420 200, 470 245 Q 520 260, 580 260"
          fill="none"
          stroke="#F4B14A"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 40 260 Q 100 260, 130 245 Q 180 200, 230 130 Q 280 80, 310 75 Q 340 80, 380 130 Q 420 200, 470 245 Q 520 260, 580 260 L 580 260 L 40 260 Z"
          fill="#F4B14A"
          opacity="0.12"
        />

        {/* Demand curve */}
        <path
          d="M 40 220 Q 80 215, 110 205 Q 150 180, 180 175 Q 220 195, 260 200 Q 300 200, 340 195 Q 380 175, 420 130 Q 460 90, 490 85 Q 520 95, 540 130 Q 560 180, 580 220"
          fill="none"
          stroke="var(--navy)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Mismatch annotation */}
        <line x1="470" y1="245" x2="470" y2="90" stroke="#D0FF14" strokeWidth="2" strokeDasharray="3 3" opacity="0.9" />
        <circle cx="470" cy="245" r="4" fill="#F4B14A" stroke="white" strokeWidth="2" />
        <circle cx="470" cy="90" r="4" fill="#1F2E5C" stroke="white" strokeWidth="2" />

        {/* X axis labels */}
        <g style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", fill: "var(--text-tertiary)" }}>
          <text x="40" y="280" textAnchor="middle">00</text>
          <text x="175" y="280" textAnchor="middle">06</text>
          <text x="310" y="280" textAnchor="middle">12</text>
          <text x="445" y="280" textAnchor="middle">18</text>
          <text x="580" y="280" textAnchor="middle">24</text>
        </g>
        <text
          x="310"
          y="295"
          textAnchor="middle"
          style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fill: "var(--text-tertiary)",
          }}
        >
          Hour of day
        </text>
      </svg>

      {/* Caption */}
      <div
        className="mt-6 pt-5 text-sm md:text-base leading-relaxed"
        style={{ borderTop: "1px solid var(--border)", color: "var(--text-secondary)" }}
      >
        Solar peaks when nobody's home. The grid peaks when everybody is.
        That gap — the <span style={{ color: "var(--accent)", fontWeight: 600 }}>premium window</span> —
        is where Certino certificates earn their highest value.
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-6 h-0.5 rounded-full" style={{ background: color }} />
      <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
        {label}
      </span>
    </div>
  );
}

// ==========================================================================
// SOLUTION INTRO — single full-width transitional block
// (replaces the deleted three-pillar grid)
// ==========================================================================

function Solution() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <SectionKicker label="The solution" tone="accent" />
        <div className="max-w-4xl mt-6">
          <h2
            className="display text-4xl md:text-6xl leading-[1.05] mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            A registry built for{" "}
            <span className="italic" style={{ color: "var(--accent)" }}>
              small producers
            </span>{" "}
            and{" "}
            <span className="italic" style={{ color: "var(--navy)" }}>
              the hour
            </span>
            .
          </h2>
          <p
            className="text-lg md:text-xl leading-relaxed max-w-3xl"
            style={{ color: "var(--text-secondary)" }}
          >
            Certino is the missing piece between a single rooftop and a serious
            ESG buyer. We do the heavy lifting — metering, attestation,
            settlement — so a small producer can sell a real, hourly-matched
            certificate to a real, named buyer.
          </p>
        </div>
      </div>
    </section>
  );
}

// HOW IT WORKS — three diagrams
// ==========================================================================

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28"
      style={{ background: "var(--bg-card-soft)", borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <SectionKicker label="How it works" tone="navy" />

        <div className="md:max-w-3xl mt-6 mb-12 md:mb-16">
          <h2
            className="display text-4xl md:text-5xl leading-[1.05]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Three views of the same protocol —{" "}
            <span className="italic" style={{ color: "var(--accent)" }}>
              flow, comparison, pricing.
            </span>
          </h2>
        </div>

        {/* Three columns side by side */}
        <div className="grid lg:grid-cols-3 gap-5 md:gap-6">
          <DiagramColumn
            number="01"
            title="The protocol flow"
            subtitle="Six stages, one certificate"
          >
            <FlowDiagram />
          </DiagramColumn>

          <DiagramColumn
            number="02"
            title="Legacy vs. Certino"
            subtitle="The market we replace"
          >
            <ComparisonDiagram />
          </DiagramColumn>

          <DiagramColumn
            number="03"
            title="Premium hours"
            subtitle="Tied to spot price"
          >
            <PremiumTierDiagram />
          </DiagramColumn>
        </div>
      </div>
    </section>
  );
}

// Compact card-style wrapper for each column diagram
function DiagramColumn({ number, title, subtitle, children }) {
  return (
    <div
      className="rounded-3xl p-5 md:p-6 flex flex-col"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}
      <div className="flex items-baseline gap-3 mb-1.5">
        <span
          className="display text-2xl md:text-3xl"
          style={{ color: "var(--accent)", letterSpacing: "-0.01em" }}
        >
          {number}
        </span>
        <span
          className="display text-xl md:text-2xl"
          style={{ letterSpacing: "-0.01em" }}
        >
          {title}
        </span>
      </div>
      <div
        className="text-[11px] font-bold tracking-widest uppercase mb-5"
        style={{ color: "var(--text-tertiary)" }}
      >
        {subtitle}
      </div>

      {/* Diagram body */}
      <div className="flex-1">{children}</div>
    </div>
  );
}

// ==========================================================================
// ARCHITECTURE SECTION — schema-based hub-spoke diagram
// 2/3 width SVG schema on the left, 1/3 column with step callouts on the right
// ==========================================================================

function Architecture() {
  return (
    <section
      className="py-20 md:py-28"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <SectionKicker label="Protocol architecture" tone="accent" />

        <div className="md:max-w-3xl mt-6 mb-12 md:mb-14">
          <h2
            className="display text-4xl md:text-5xl leading-[1.05]"
            style={{ letterSpacing: "-0.02em" }}
          >
            House, grid, company —{" "}
            <span className="italic" style={{ color: "var(--accent)" }}>
              the protocol at the centre.
            </span>
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed mt-5 max-w-2xl"
            style={{ color: "var(--text-secondary)" }}
          >
            Three real-world parties, one protocol mediating the value flow.
            The household exports kWh through the grid; the company pays for
            verified certificates; the protocol validates, mints, matches, and
            settles the proceeds back.
          </p>
        </div>

        {/* The hub-spoke diagram (already 2/3 + 1/3 internally) */}
        <ArchitectureDiagram />
      </div>
    </section>
  );
}

function DiagramBlock({ number, title, subtitle, body, children }) {
  return (
    <div className="mb-24 last:mb-0">
      <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start mb-10">
        <div className="md:col-span-4">
          <div
            className="display text-5xl md:text-6xl mb-2"
            style={{ color: "var(--accent)", letterSpacing: "-0.02em" }}
          >
            {number}
          </div>
          <h3
            className="display text-3xl md:text-4xl mb-3 leading-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            {title}
          </h3>
          <div
            className="text-sm font-semibold mb-4"
            style={{ color: "var(--text-tertiary)" }}
          >
            {subtitle}
          </div>
        </div>
        <div className="md:col-span-8">
          <p
            className="text-lg leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {body}
          </p>
        </div>
      </div>

      {/* Diagram itself */}
      <div
        className="rounded-3xl p-6 md:p-10"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ==========================================================================
// DIAGRAM 1: PROTOCOL ARCHITECTURE (hub-and-spoke)
// Three parties — household, grid, company — with the protocol at centre.
// Direct visualisation of the schema you sketched: electricity flows through
// the grid, value flows through the protocol, certificates settle to the
// company, yield flows back to the household. Plus the aggregation callout
// (10 hourly pulses → 1 MWh → mintBatch on Base).
// ==========================================================================

function CertinoSchemaAxo() {
  return (
    <svg viewBox="60 70 1080 630" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">


<defs>
  <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
    <feOffset dx="0" dy="3"/>
    <feComponentTransfer><feFuncA type="linear" slope="0.10"/></feComponentTransfer>
    <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>

<rect x="40" y="80" width="1120" height="260" rx="14" fill="#E8EFFF" opacity="0.25"/>
<text x="60" y="105" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700" fill="#2A4DD0" letterSpacing="2.5">LAYER · PROTOCOL</text>
<rect x="40" y="470" width="1120" height="220" rx="14" fill="#F1F5F9" opacity="0.5"/>
<text x="60" y="495" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700" fill="#94A3B8" letterSpacing="2.5">LAYER · GRID</text>
<line x1="218.3" y1="488.5" x2="544.8" y2="356.0" stroke="#FF6B4A" strokeWidth="1.7" strokeLinecap="round" strokeDasharray="4 5"><animate attributeName="stroke-dashoffset" from="0" to="-9" dur="1.4s" repeatCount="indefinite"/></line>
<path d="M544.8 356.0 L536.3 364.3 L532.9 356.0 Z" fill="#FF6B4A"/>
<text x="388.3" y="441.9" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" fill="#FF6B4A" textAnchor="middle" letterSpacing="1.2">ORACLE</text>
<line x1="526.7" y1="311.5" x2="200.2" y2="444.0" stroke="#2A4DD0" strokeWidth="1.7" strokeLinecap="round" strokeDasharray="4 5"><animate attributeName="stroke-dashoffset" from="0" to="-9" dur="1.4s" repeatCount="indefinite"/></line>
<path d="M200.2 444.0 L208.7 435.7 L212.1 444.0 Z" fill="#2A4DD0"/>
<text x="356.7" y="364.1" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" fill="#2A4DD0" textAnchor="middle" letterSpacing="1.2">YIELD</text>
<line x1="600.0" y1="470.0" x2="600.0" y2="355.0" stroke="#475569" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="3 6"><animate attributeName="stroke-dashoffset" from="0" to="-9" dur="1.6s" repeatCount="indefinite"/></line>
<path d="M600.0 355.0 L604.5 366.0 L595.5 366.0 Z" fill="#475569"/>
<text x="544.0" y="415.5" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" fill="#475569" textAnchor="middle" letterSpacing="1.2">VERIFICATION</text>
<line x1="655.6" y1="356.0" x2="981.9" y2="483.7" stroke="#FF6B4A" strokeWidth="1.7" strokeLinecap="round" strokeDasharray="4 5"><animate attributeName="stroke-dashoffset" from="0" to="-9" dur="1.4s" repeatCount="indefinite"/></line>
<path d="M981.9 483.7 L970.1 483.9 L973.3 475.5 Z" fill="#FF6B4A"/>
<text x="812.2" y="439.6" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" fill="#FF6B4A" textAnchor="middle" letterSpacing="1.2">CERTIFICATE</text>
<line x1="999.4" y1="439.0" x2="673.1" y2="311.3" stroke="#2A4DD0" strokeWidth="1.7" strokeLinecap="round" strokeDasharray="4 5"><animate attributeName="stroke-dashoffset" from="0" to="-9" dur="1.4s" repeatCount="indefinite"/></line>
<path d="M673.1 311.3 L684.9 311.1 L681.7 319.5 Z" fill="#2A4DD0"/>
<text x="842.8" y="361.4" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" fill="#2A4DD0" textAnchor="middle" letterSpacing="1.2">PAYMENT</text>
<line x1="60" y1="620" x2="1140" y2="620" stroke="#CBD5E1" strokeWidth="1.5"/>
<line x1="90" y1="617" x2="90" y2="623" stroke="#E2E8F0" strokeWidth="1"/>
<line x1="160" y1="617" x2="160" y2="623" stroke="#E2E8F0" strokeWidth="1"/>
<line x1="230" y1="617" x2="230" y2="623" stroke="#E2E8F0" strokeWidth="1"/>
<line x1="300" y1="617" x2="300" y2="623" stroke="#E2E8F0" strokeWidth="1"/>
<line x1="370" y1="617" x2="370" y2="623" stroke="#E2E8F0" strokeWidth="1"/>
<line x1="440" y1="617" x2="440" y2="623" stroke="#E2E8F0" strokeWidth="1"/>
<line x1="510" y1="617" x2="510" y2="623" stroke="#E2E8F0" strokeWidth="1"/>
<line x1="580" y1="617" x2="580" y2="623" stroke="#E2E8F0" strokeWidth="1"/>
<line x1="650" y1="617" x2="650" y2="623" stroke="#E2E8F0" strokeWidth="1"/>
<line x1="720" y1="617" x2="720" y2="623" stroke="#E2E8F0" strokeWidth="1"/>
<line x1="790" y1="617" x2="790" y2="623" stroke="#E2E8F0" strokeWidth="1"/>
<line x1="860" y1="617" x2="860" y2="623" stroke="#E2E8F0" strokeWidth="1"/>
<line x1="930" y1="617" x2="930" y2="623" stroke="#E2E8F0" strokeWidth="1"/>
<line x1="1000" y1="617" x2="1000" y2="623" stroke="#E2E8F0" strokeWidth="1"/>
<line x1="1070" y1="617" x2="1070" y2="623" stroke="#E2E8F0" strokeWidth="1"/>
<line x1="284.0" y1="620.0" x2="522.0" y2="620.0" stroke="#64748B" strokeWidth="1.7" strokeLinecap="round" strokeDasharray="5 6"><animate attributeName="stroke-dashoffset" from="0" to="-11" dur="1.0s" repeatCount="indefinite"/></line>
<path d="M522.0 620.0 L511.0 624.5 L511.0 615.5 Z" fill="#64748B"/>
<text x="403.0" y="609.0" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" fill="#64748B" textAnchor="middle" letterSpacing="1.2">ELECTRICITY</text>
<line x1="678.0" y1="620.0" x2="916.0" y2="620.0" stroke="#64748B" strokeWidth="1.7" strokeLinecap="round" strokeDasharray="5 6"><animate attributeName="stroke-dashoffset" from="0" to="-11" dur="1.0s" repeatCount="indefinite"/></line>
<path d="M916.0 620.0 L905.0 624.5 L905.0 615.5 Z" fill="#64748B"/>
<text x="797.0" y="609.0" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" fill="#64748B" textAnchor="middle" letterSpacing="1.2">ELECTRICITY</text>
{/* Treetino — solar tree (replaces house) */}
<path d="M195 608 L205 608 L203 555 L197 555 Z" fill="#E5E7EB" stroke="#0F172A" strokeWidth="1.4" strokeLinejoin="round"/>
<ellipse cx="160" cy="555" rx="22" ry="7" transform="rotate(-25 160 555)" fill="#1E3A8A" stroke="#0F172A" strokeWidth="1" opacity="0.9"/>
<ellipse cx="240" cy="555" rx="22" ry="7" transform="rotate(25 240 555)" fill="#1E3A8A" stroke="#0F172A" strokeWidth="1" opacity="0.9"/>
<ellipse cx="170" cy="545" rx="32" ry="10" transform="rotate(-15 170 545)" fill="#2A4DD0" stroke="#0F172A" strokeWidth="1.1"/>
<ellipse cx="230" cy="545" rx="32" ry="10" transform="rotate(15 230 545)" fill="#2A4DD0" stroke="#0F172A" strokeWidth="1.1"/>
<ellipse cx="200" cy="540" rx="48" ry="13" fill="#3F60DC" stroke="#0F172A" strokeWidth="1.3"/>
<ellipse cx="180" cy="528" rx="24" ry="8" transform="rotate(-18 180 528)" fill="#5C7AE5" stroke="#0F172A" strokeWidth="1"/>
<ellipse cx="220" cy="528" rx="24" ry="8" transform="rotate(18 220 528)" fill="#5C7AE5" stroke="#0F172A" strokeWidth="1"/>
<ellipse cx="200" cy="520" rx="30" ry="9" fill="#7B95EF" stroke="#0F172A" strokeWidth="1"/>
<ellipse cx="200" cy="513" rx="14" ry="5" fill="#A4B6F4" stroke="#0F172A" strokeWidth="0.9"/>
<line x1="158" y1="540" x2="242" y2="540" stroke="#0F172A" strokeWidth="0.5" opacity="0.25"/>
<line x1="170" y1="545" x2="230" y2="545" stroke="#0F172A" strokeWidth="0.5" opacity="0.25"/>
<ellipse cx="188" cy="535" rx="5" ry="1.6" fill="#FFFFFF" opacity="0.6"/>
<ellipse cx="212" cy="540" rx="4" ry="1.4" fill="#FFFFFF" opacity="0.5"/>
<line x1="600.0" y1="488.0" x2="645.0" y2="514.0" stroke="#0F172A" strokeWidth="0.9" opacity="0.45"/>
<line x1="600.0" y1="488.0" x2="645.0" y2="566.0" stroke="#0F172A" strokeWidth="0.9" opacity="0.45"/>
<line x1="600.0" y1="488.0" x2="600.0" y2="592.0" stroke="#FF6B4A" strokeWidth="2.2" strokeDasharray="3 4"><animate attributeName="stroke-dashoffset" from="0" to="-14" dur="0.8s" repeatCount="indefinite"/></line>
<line x1="600.0" y1="488.0" x2="555.0" y2="566.0" stroke="#0F172A" strokeWidth="0.9" opacity="0.45"/>
<line x1="600.0" y1="488.0" x2="555.0" y2="514.0" stroke="#0F172A" strokeWidth="0.9" opacity="0.45"/>
<line x1="645.0" y1="514.0" x2="645.0" y2="566.0" stroke="#0F172A" strokeWidth="0.9" opacity="0.45"/>
<line x1="645.0" y1="514.0" x2="600.0" y2="592.0" stroke="#0F172A" strokeWidth="0.9" opacity="0.45"/>
<line x1="645.0" y1="514.0" x2="555.0" y2="566.0" stroke="#0F172A" strokeWidth="0.9" opacity="0.45"/>
<line x1="645.0" y1="514.0" x2="555.0" y2="514.0" stroke="#0F172A" strokeWidth="0.9" opacity="0.45"/>
<line x1="645.0" y1="566.0" x2="600.0" y2="592.0" stroke="#0F172A" strokeWidth="0.9" opacity="0.45"/>
<line x1="645.0" y1="566.0" x2="555.0" y2="566.0" stroke="#0F172A" strokeWidth="0.9" opacity="0.45"/>
<line x1="645.0" y1="566.0" x2="555.0" y2="514.0" stroke="#0F172A" strokeWidth="0.9" opacity="0.45"/>
<line x1="600.0" y1="592.0" x2="555.0" y2="566.0" stroke="#0F172A" strokeWidth="0.9" opacity="0.45"/>
<line x1="600.0" y1="592.0" x2="555.0" y2="514.0" stroke="#0F172A" strokeWidth="0.9" opacity="0.45"/>
<line x1="555.0" y1="566.0" x2="555.0" y2="514.0" stroke="#0F172A" strokeWidth="0.9" opacity="0.45"/>
<circle cx="600.0" cy="488.0" r="6" fill="#FF6B4A" stroke="white" strokeWidth="2"/>
<circle cx="645.0" cy="514.0" r="5" fill="#2A4DD0" stroke="white" strokeWidth="1.5"/>
<circle cx="645.0" cy="566.0" r="5" fill="#2A4DD0" stroke="white" strokeWidth="1.5"/>
<circle cx="600.0" cy="592.0" r="6" fill="#FF6B4A" stroke="white" strokeWidth="2"/>
<circle cx="555.0" cy="566.0" r="5" fill="#2A4DD0" stroke="white" strokeWidth="1.5"/>
<circle cx="555.0" cy="514.0" r="5" fill="#2A4DD0" stroke="white" strokeWidth="1.5"/>
<polygon points="1041.6,561.6 1004.2,583.2 1004.2,516.0 1041.6,494.4" fill="#2A4DD0" stroke="#0F172A" strokeWidth="1.4" strokeLinejoin="round"/>
<polygon points="995.8,535.2 1041.6,561.6 1041.6,494.4 995.8,468.0" fill="#3F60DC" stroke="#0F172A" strokeWidth="1.4" strokeLinejoin="round"/>
<polygon points="995.8,468.0 1041.6,494.4 1004.2,516.0 958.4,489.6" fill="#E8EFFF" stroke="#0F172A" strokeWidth="1.4" strokeLinejoin="round"/>
<line x1="995.8" y1="518.4" x2="1041.6" y2="544.8" stroke="#0F172A" strokeWidth="0.6" opacity="0.7"/>
<line x1="1041.6" y1="544.8" x2="1004.2" y2="566.4" stroke="#0F172A" strokeWidth="0.6" opacity="0.7"/>
<line x1="995.8" y1="501.6" x2="1041.6" y2="528.0" stroke="#0F172A" strokeWidth="0.6" opacity="0.7"/>
<line x1="1041.6" y1="528.0" x2="1004.2" y2="549.6" stroke="#0F172A" strokeWidth="0.6" opacity="0.7"/>
<line x1="995.8" y1="484.8" x2="1041.6" y2="511.2" stroke="#0F172A" strokeWidth="0.6" opacity="0.7"/>
<line x1="1041.6" y1="511.2" x2="1004.2" y2="532.8" stroke="#0F172A" strokeWidth="0.6" opacity="0.7"/>
<polygon points="1004.9,485.3 1009.6,488.0 1009.6,480.8 1004.9,478.1" fill="white" opacity="0.92"/>
<polygon points="1027.8,498.5 1032.5,501.2 1032.5,494.0 1027.8,491.3" fill="white" opacity="0.92"/>
<polygon points="1004.9,502.1 1009.6,504.8 1009.6,497.6 1004.9,494.9" fill="white" opacity="0.92"/>
<polygon points="1027.8,515.3 1032.5,518.0 1032.5,510.8 1027.8,508.1" fill="white" opacity="0.92"/>
<polygon points="1004.9,518.9 1009.6,521.6 1009.6,514.4 1004.9,511.7" fill="white" opacity="0.92"/>
<polygon points="1027.8,532.1 1032.5,534.8 1032.5,527.6 1027.8,524.9" fill="white" opacity="0.92"/>
<polygon points="1004.9,535.7 1009.6,538.4 1009.6,531.2 1004.9,528.5" fill="white" opacity="0.92"/>
<polygon points="1027.8,548.9 1032.5,551.6 1032.5,544.4 1027.8,541.7" fill="white" opacity="0.92"/>
<polygon points="1034.6,510.5 1029.9,513.1 1029.9,506.0 1034.6,503.3" fill="white" opacity="0.7"/>
<polygon points="1015.8,521.2 1011.2,524.0 1011.2,516.8 1015.8,514.1" fill="white" opacity="0.7"/>
<polygon points="1034.6,527.3 1029.9,530.0 1029.9,522.8 1034.6,520.1" fill="white" opacity="0.7"/>
<polygon points="1015.8,538.1 1011.2,540.8 1011.2,533.6 1015.8,530.9" fill="white" opacity="0.7"/>
<polygon points="1034.6,544.1 1029.9,546.8 1029.9,539.6 1034.6,536.9" fill="white" opacity="0.7"/>
<polygon points="1015.8,554.9 1011.2,557.6 1011.2,550.4 1015.8,547.7" fill="white" opacity="0.7"/>
<polygon points="1034.6,560.9 1029.9,563.6 1029.9,556.4 1034.6,553.7" fill="white" opacity="0.7"/>
<polygon points="1015.8,571.7 1011.2,574.4 1011.2,567.2 1015.8,564.5" fill="white" opacity="0.7"/>
<polygon points="1015.1,546.3 1022.3,550.5 1022.3,539.7 1015.1,535.5" fill="#0F172A" stroke="none"/>
<text x="200.0" y="670.0" fontFamily="Fraunces, serif" fontSize="22" fontWeight="500" fill="#0F172A" textAnchor="middle" letterSpacing="-0.3">Treetino</text><text x="200.0" y="692.0" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#94A3B8" textAnchor="middle" letterSpacing="1.4">VICTRON COMPATIBLE DEVICE</text>
<text x="600.0" y="670.0" fontFamily="Fraunces, serif" fontSize="22" fontWeight="500" fill="#0F172A" textAnchor="middle" letterSpacing="-0.3">Grid</text><text x="600.0" y="692.0" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#94A3B8" textAnchor="middle" letterSpacing="2.5">ČEPS · DSO</text>
<text x="1000.0" y="670.0" fontFamily="Fraunces, serif" fontSize="22" fontWeight="500" fill="#0F172A" textAnchor="middle" letterSpacing="-0.3">Company</text><text x="1000.0" y="692.0" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#94A3B8" textAnchor="middle" letterSpacing="2.5">BUYER</text>
<path d="M600.0 100.0 L705.0 169.6 L705.0 289.6 L600.0 340.0 L495.0 289.6 L495.0 169.6 Z" fill="white" stroke="#2A4DD0" strokeWidth="2" filter="url(#softShadow)"/>
<path d="M600.0 100.0 L705.0 169.6 L600.0 214.0 L495.0 169.6 Z" fill="#E8EFFF" stroke="#2A4DD0" strokeWidth="2"/>
<text x="600" y="154.0" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700" fill="#2A4DD0" textAnchor="middle" letterSpacing="3">CERTINO</text>
<text x="600" y="181.6" fontFamily="Fraunces, serif" fontSize="17" fontStyle="italic" fontWeight="500" fill="#0F172A" textAnchor="middle" letterSpacing="-0.3">protocol</text>
<line x1="545" y1="204.4" x2="655" y2="204.4" stroke="#E2E8F0" strokeWidth="1"/>
<text x="535" y="224.8" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700" fill="#2A4DD0" letterSpacing="1.5">01</text>
<text x="558" y="224.8" fontFamily="Plus Jakarta Sans, Inter, sans-serif" fontSize="12" fontWeight="500" fill="#0F172A" letterSpacing="0">Validate energy</text>
<text x="535" y="243.8" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700" fill="#FF6B4A" letterSpacing="1.5">02</text>
<text x="558" y="243.8" fontFamily="Plus Jakarta Sans, Inter, sans-serif" fontSize="12" fontWeight="500" fill="#0F172A" letterSpacing="0">Issue certificate</text>
<text x="535" y="262.8" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700" fill="#2A4DD0" letterSpacing="1.5">03</text>
<text x="558" y="262.8" fontFamily="Plus Jakarta Sans, Inter, sans-serif" fontSize="12" fontWeight="500" fill="#0F172A" letterSpacing="0">Match buyers</text>
<text x="535" y="281.8" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700" fill="#2A4DD0" letterSpacing="1.5">04</text>
<text x="558" y="281.8" fontFamily="Plus Jakarta Sans, Inter, sans-serif" fontSize="12" fontWeight="500" fill="#0F172A" letterSpacing="0">Distribute yield</text>

    </svg>
  );
}

function ArchitectureDiagram() {
  return (
    <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
      {/* === LEFT 2/3: schema fills card edge-to-edge === */}
      <div className="lg:col-span-2 flex">
        <div
          className="flex-1 rounded-3xl overflow-hidden flex"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <CertinoSchemaAxo />
        </div>
      </div>

      {/* === RIGHT 1/3: step callouts stretch evenly to match schema height === */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <ArchCallout
          step="01"
          title="Hourly pulses"
          body="Each household streams a signed reading every hour, carrying GPS, timestamp and FuelType (EnergyTag schema)."
        />
        <ArchCallout
          step="02"
          title="Pool & threshold"
          body="The protocol aggregate pulses up to 1MWh and one hour, that are then provided to be sold on the market across all registered devices"
        />
        <ArchCallout
          step="03"
          title="mintBatch( ) on-chain"
          body="A single ERC-721 NFT mints with metadata pointing to the IPFS-stored breakdown of all contributing pulses."
          accent
        />
      </div>
    </div>
  );
}

function ArchCallout({ step, title, body, accent = false }) {
  return (
    <div
      className="p-5 rounded-2xl flex-1 flex flex-col justify-start"
      style={{
        background: accent ? "var(--accent-soft)" : "var(--bg-card-soft)",
        border: `1px solid ${accent ? "rgba(15,59,71,0.18)" : "var(--border)"}`,
      }}
    >
      <div
        className="mono mb-2"
        style={{
          fontSize: "10px",
          color: accent ? "var(--accent)" : "var(--text-tertiary)",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        Step {step}
      </div>
      <div
        className="display text-xl mb-2"
        style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
      >
        {title}
      </div>
      <div
        className="text-sm leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {body}
      </div>
    </div>
  );
}

// ==========================================================================
// DIAGRAM 2: PROTOCOL FLOW
// ==========================================================================

function FlowDiagram() {
  const stages = [
    {
      icon: Sun,
      label: "Device",
      sub: "Solar · Wind · HILIER",
      detail: "Small renewable installation, 1 MW or under.",
    },
    {
      icon: Gauge,
      label: "Meter",
      sub: "Victron VRM",
      detail: "Hourly readings via existing inverter telemetry.",
    },
    {
      icon: FileCheck2,
      label: "Attestation",
      sub: "EnergyTag V2",
      detail: "Signed claim, hour-bound, dual-issuance checked.",
    },
    {
      icon: Layers,
      label: "Mint",
      sub: "Base · ERC-721",
      detail: "Certificate exists on-chain, owner = producer.",
    },
    {
      icon: ShoppingCart,
      label: "Marketplace",
      sub: "Pool · EURC",
      detail: "Buyers deposit. Pool clears against EPEX SPOT.",
    },
    {
      icon: Flame,
      label: "Retirement",
      sub: "Soulbound proof",
      detail: "Buyer burns the cert. Claim is locked, not resaleable.",
    },
  ];

  return (
    <div className="space-y-4">
      {stages.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <svg width="48" height="56" viewBox="0 0 56 64">
                <Hex
                  cx={28}
                  cy={32}
                  r={26}
                  fill="var(--bg-card)"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                />
              </svg>
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ color: "var(--accent)" }}
              >
                <Icon className="w-4 h-4" strokeWidth={2} />
              </div>
            </div>
            <div className="flex-1 pt-1.5">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold mono" style={{ color: "var(--accent)" }}>
                  0{i + 1}
                </span>
                <span className="font-bold text-sm">{s.label}</span>
              </div>
              <div
                className="text-[9px] font-bold tracking-widest uppercase mb-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                {s.sub}
              </div>
              <div className="text-xs leading-snug" style={{ color: "var(--text-secondary)" }}>
                {s.detail}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ==========================================================================
// DIAGRAM 2: LEGACY vs CERTINO COMPARISON
// ==========================================================================

function ComparisonDiagram() {
  const rows = [
    {
      legacy: { label: "Annual matching", detail: "1 MWh anywhere, anytime" },
      certino: { label: "Hourly granular matching", detail: "1 MWh from the actual hour" },
    },
    {
      legacy: { label: "Anonymous bulk pools", detail: "Aggregated, opaque sources" },
      certino: { label: "Direct from named devices", detail: "Producer ID on every cert" },
    },
    {
      legacy: { label: "30 – 50% middleman take", detail: "Brokers, traders, registries" },
      certino: { label: "~5% protocol fee", detail: "Value flows to the producer" },
    },
    {
      legacy: { label: "Designed for large utilities", detail: "Min volumes lock out small farms" },
      certino: { label: "Open to small producers", detail: "1 MW or less, rooftop-friendly" },
    },
    {
      legacy: { label: "Retired in registry only", detail: "Trust the registry's records" },
      certino: { label: "Soulbound on-chain proof", detail: "Burn-to-retire, publicly verifiable" },
    },
  ];

  return (
    <div className="space-y-5">
      {/* Legacy section */}
      <div>
        <div
          className="text-[10px] font-bold tracking-widest uppercase mb-2"
          style={{ color: "var(--text-tertiary)" }}
        >
          Today's market · Legacy GOs
        </div>
        <div className="space-y-1.5">
          {rows.map((row, i) => (
            <div
              key={i}
              className="p-3 rounded-xl flex items-start gap-2.5"
              style={{ background: "rgba(125,155,164,0.06)" }}
            >
              <span
                className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                style={{ background: "rgba(125,155,164,0.25)" }}
              >
                <X className="w-2.5 h-2.5" strokeWidth={2.5} style={{ color: "#7D9BA4" }} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                  {row.legacy.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certino section */}
      <div>
        <div
          className="text-[10px] font-bold tracking-widest uppercase mb-2"
          style={{ color: "var(--accent)" }}
        >
          With Certino · Hourly registry
        </div>
        <div className="space-y-1.5">
          {rows.map((row, i) => (
            <div
              key={i}
              className="p-3 rounded-xl flex items-start gap-2.5"
              style={{ background: "rgba(15,59,71,0.05)" }}
            >
              <span
                className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                style={{ background: "var(--accent)" }}
              >
                <Check className="w-2.5 h-2.5" strokeWidth={3} style={{ color: "var(--accent-on)" }} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                  {row.certino.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// (legacy old comparison body — replaced by stacked column version above)
function _LegacyComparisonOldBody() {
  return null;
}

// ==========================================================================
// DIAGRAM 3: PREMIUM TIER MECHANICS
// ==========================================================================

function PremiumTierDiagram() {
  return (
    <div>
      {/* Title and legend */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <div
            className="text-[11px] font-bold tracking-widest uppercase mb-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            OTE-CR Czech spot price · sample weekday
          </div>
          <div
            className="display italic text-2xl"
            style={{ color: "var(--text-primary)" }}
          >
            Standard hours vs. premium hours
          </div>
        </div>
      </div>

      {/* Chart */}
      <svg
        viewBox="0 0 700 320"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Above-threshold fill - lime */}
          <linearGradient id="premiumFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D0FF14" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#D0FF14" stopOpacity="0.05" />
          </linearGradient>
          <clipPath id="abovecCip">
            <rect x="60" y="40" width="640" height="120" />
          </clipPath>
        </defs>

        {/* Y axis labels */}
        <g
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            fill: "var(--text-tertiary)",
          }}
        >
          <text x="50" y="50" textAnchor="end">€140</text>
          <text x="50" y="105" textAnchor="end">€90</text>
          <text x="50" y="160" textAnchor="end">€60</text>
          <text x="50" y="215" textAnchor="end">€30</text>
          <text x="50" y="270" textAnchor="end">€0</text>
        </g>

        {/* Grid lines */}
        <g stroke="var(--border)" strokeWidth="1">
          <line x1="60" y1="45" x2="700" y2="45" />
          <line x1="60" y1="160" x2="700" y2="160" />
          <line x1="60" y1="215" x2="700" y2="215" />
          <line x1="60" y1="270" x2="700" y2="270" />
        </g>

        {/* Threshold line at €90 */}
        <line
          x1="60"
          y1="100"
          x2="700"
          y2="100"
          stroke="#0F3B47"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <rect
          x="80"
          y="84"
          width="116"
          height="24"
          rx="12"
          fill="var(--accent)"
        />
        <text
          x="138"
          y="100"
          textAnchor="middle"
          style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fill: "#F6F1E7",
          }}
        >
          Threshold · €90
        </text>

        {/* Price curve - typical Czech weekday pattern */}
        {/* Path from 0h to 24h */}
        <path
          d="M 60 200 L 100 195 L 140 188 L 180 180 L 220 165 L 260 145 L 300 125 L 340 130 L 380 110 L 420 95 L 460 75 L 500 60 L 540 55 L 580 70 L 620 95 L 660 130 L 700 175"
          fill="none"
          stroke="#0F3B47"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Premium fill - shading where price > threshold */}
        <path
          d="M 60 100 L 60 200 L 100 195 L 140 188 L 180 180 L 220 165 L 260 145 L 300 125 L 340 130 L 380 110 L 420 95 L 460 75 L 500 60 L 540 55 L 580 70 L 620 95 L 660 130 L 700 175 L 700 100 Z"
          fill="url(#premiumFill)"
          clipPath="url(#abovecCip)"
        />

        {/* Premium hour markers (above-threshold dots) */}
        {[
          { x: 420, y: 95 },
          { x: 460, y: 75 },
          { x: 500, y: 60 },
          { x: 540, y: 55 },
          { x: 580, y: 70 },
          { x: 620, y: 95 },
        ].map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="6" fill="var(--accent)" />
            <circle cx={p.x} cy={p.y} r="3" fill="#D0FF14" />
          </g>
        ))}

        {/* Standard hour markers (below-threshold) */}
        {[
          { x: 100, y: 195 },
          { x: 220, y: 165 },
          { x: 340, y: 130 },
          { x: 660, y: 130 },
        ].map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="var(--bg-card)"
            stroke="#7D9BA4"
            strokeWidth="2"
          />
        ))}

        {/* X axis labels */}
        <g
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            fill: "var(--text-tertiary)",
          }}
        >
          <text x="60" y="295" textAnchor="middle">00</text>
          <text x="220" y="295" textAnchor="middle">06</text>
          <text x="380" y="295" textAnchor="middle">12</text>
          <text x="540" y="295" textAnchor="middle">18</text>
          <text x="700" y="295" textAnchor="middle">24</text>
        </g>

        {/* X axis label */}
        <text
          x="380"
          y="313"
          textAnchor="middle"
          style={{
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fill: "var(--text-tertiary)",
          }}
        >
          Hour of day
        </text>
      </svg>

      {/* Bottom: legend + tier definitions */}
      <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
        {/* Premium tier */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <span
              className="block w-4 h-4 rounded-full"
              style={{
                background: "var(--accent)",
                boxShadow: "0 0 0 4px rgba(208, 255, 20, 0.25)",
              }}
            />
          </div>
          <div>
            <div
              className="text-[11px] font-bold tracking-widest uppercase mb-1"
              style={{ color: "var(--accent)" }}
            >
              Premium tier · ~ €40 / MWh
            </div>
            <div
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Hours where the OTE-CR clearing price exceeds the rolling 30-day Q3
              threshold. The grid is paying a premium because clean energy is short — Certino
              passes that signal through to the producer.
            </div>
          </div>
        </div>

        {/* Standard tier */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <span
              className="block w-4 h-4 rounded-full border-2"
              style={{
                background: "var(--bg-card)",
                borderColor: "#7D9BA4",
              }}
            />
          </div>
          <div>
            <div
              className="text-[11px] font-bold tracking-widest uppercase mb-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              Standard tier · €2 – 8 / MWh
            </div>
            <div
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Hours below threshold still mint certificates — every exported kWh
              earns one — but they clear at the floor price set by the legacy GO
              market.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================================================
// CLOSING CTA
// ==========================================================================

function Closing() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="relative rounded-[32px] overflow-hidden p-10 md:p-16"
          style={{
            background: "var(--text-primary)",
            color: "var(--bg-page)",
          }}
        >
          {/* Decorative hex pattern */}
          <svg
            className="absolute top-0 right-0 opacity-20 pointer-events-none"
            width="500"
            height="400"
            viewBox="0 0 500 400"
          >
            <defs>
              <pattern
                id="closing-hex"
                width="60"
                height="52"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M30 4 L52 17 L52 39 L30 52 L8 39 L8 17 Z"
                  fill="none"
                  stroke="#D0FF14"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect x="0" y="0" width="500" height="400" fill="url(#closing-hex)" />
            <Hex cx={380} cy={140} r={32} fill="#D0FF14" opacity="0.6" />
            <Hex cx={300} cy={220} r={20} fill="#D0FF14" opacity="0.3" />
          </svg>

          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-8 h-px" style={{ background: "var(--lime)" }} />
              <span
                className="text-[11px] font-bold tracking-[0.18em] uppercase"
                style={{ color: "var(--lime)" }}
              >
                Standards · Compliance
              </span>
            </div>
            <h2
              className="display text-4xl md:text-6xl leading-[1.05] mb-6"
              style={{ letterSpacing: "-0.02em" }}
            >
              Production-ready infrastructure.
              <br />
              <span className="italic" style={{ color: "var(--lime)" }}>
                Open standards.
              </span>
            </h2>
            <p
              className="text-lg md:text-xl leading-relaxed mb-9 max-w-xl"
              style={{ color: "rgba(246, 241, 231, 0.75)" }}
            >
              EnergyTag V2 · Base mainnet · Victron VRM · OTE-CR data feed · ČEPS
              CZ bidding zone. Aligned with EU RED III hourly matching and
              positioned for AIB accreditation upon launch.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/app"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-base font-bold transition-all hover:scale-[1.02]"
                style={{
                  background: "var(--lime, #D0FF14)",
                  color: "var(--text-primary)",
                }}
              >
                Launch App
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-base font-semibold transition-all"
                style={{
                  background: "transparent",
                  color: "var(--bg-page)",
                  border: "1px solid rgba(246, 241, 231, 0.3)",
                }}
              >
                Read the docs
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================================================
// FOOTER
// ==========================================================================

function Footer() {
  return (
    <footer
      id="standards"
      className="py-12 md:py-16"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <CertinoMark className="w-8 h-9" />
              <div className="flex flex-col leading-none">
                <span className="text-lg font-extrabold tracking-tight">Certino</span>
                <span
                  className="text-[9px] font-semibold mt-0.5 tracking-widest uppercase"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  by Treetino
                </span>
              </div>
            </div>
            <p
              className="text-sm leading-relaxed max-w-md"
              style={{ color: "var(--text-secondary)" }}
            >
              Hourly granular carbon credits for small renewable installations.
              Built in Czechia, designed for the European hourly-matching
              transition.
            </p>
          </div>

          {/* Standards */}
          <div className="md:col-span-3">
            <div
              className="text-[10px] font-bold tracking-widest uppercase mb-4"
              style={{ color: "var(--text-tertiary)" }}
            >
              Standards
            </div>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li>EnergyTag V2</li>
              <li>EU RED III · hourly matching</li>
              <li>AIB · upon accreditation</li>
              <li>ČEPS · CZ bidding zone</li>
            </ul>
          </div>

          {/* Stack */}
          <div className="md:col-span-2">
            <div
              className="text-[10px] font-bold tracking-widest uppercase mb-4"
              style={{ color: "var(--text-tertiary)" }}
            >
              Stack
            </div>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li>Base · ERC-721</li>
              <li>EURC settlement</li>
              <li>Victron VRM</li>
              <li>OTE-CR data</li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <div
              className="text-[10px] font-bold tracking-widest uppercase mb-4"
              style={{ color: "var(--text-tertiary)" }}
            >
              Protocol
            </div>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li>v0.1.0</li>
              <li>ETH Prague 2026</li>
              <li>Treetino s.r.o., CZ</li>
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            © Treetino 2026 · Certino Protocol v0.1.0 · Built for ETH Prague 2026
          </div>
          <div
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: "var(--text-tertiary)" }}
          >
            Not investment advice · Pre-audit
          </div>
        </div>
      </div>
    </footer>
  );
}

// ==========================================================================
// SHARED COMPONENTS
// ==========================================================================

function LaunchAppCta({ align = "center", className = "" }) {
  const justify =
    align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";
  return (
    <div className={`flex ${justify} mt-12 md:mt-16 ${className}`}>
      <a
        href="/app"
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-base font-bold transition-all hover:scale-[1.02]"
        style={{
          background: "var(--text-primary)",
          color: "var(--bg-page)",
        }}
      >
        Launch App
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}

function SectionKicker({ label, tone = "accent" }) {
  const colorMap = {
    accent: "var(--accent)",
    navy: "var(--navy)",
    lime: "var(--lime-on-dark, #15212A)",
  };
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="w-8 h-px"
        style={{ background: colorMap[tone] }}
      />
      <span
        className="text-[11px] font-bold tracking-[0.18em] uppercase"
        style={{ color: colorMap[tone] }}
      >
        {label}
      </span>
    </div>
  );
}

function Hex({ cx, cy, r, fill, opacity = 1, stroke, strokeWidth }) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 6;
    points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  const d = `M${points.map((p) => p.join(",")).join(" L")} Z`;
  return (
    <path d={d} fill={fill} opacity={opacity} stroke={stroke} strokeWidth={strokeWidth} />
  );
}

function CertinoMark({ className = "" }) {
  return (
    <svg viewBox="0 0 60 70" className={className} fill="none">
      <path d="M30 3 L55 17 L55 53 L30 67 L5 53 L5 17 Z" fill="var(--accent)" />
      <path d="M30 3 L55 17 L30 31 L5 17 Z" fill="var(--accent)" opacity="0.8" />
      <path
        d="M18 26 L42 26 Q46 26 42 32 L22 39 Q18 42 22 44 L42 44"
        stroke="var(--accent-on)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// ==========================================================================
// THEME STYLES
// Light-mode only for landing
// Same dapp foundations + a deeper Treetino navy for institutional accents
// ==========================================================================

function ThemeStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Hanken+Grotesk:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

      [data-theme="light"] {
        --bg-page: #F6F1E7;
        --bg-card: #FFFFFF;
        --bg-card-soft: #FCFAF5;
        --text-primary: #15212A;
        --text-secondary: #4A6470;
        --text-tertiary: #7D9BA4;
        --accent: #0F3B47;          /* deep teal — primary brand */
        --accent-soft: rgba(15, 59, 71, 0.08);
        --accent-on: #F6F1E7;
        --navy: #1F2E5C;            /* Treetino navy — institutional moments */
        --lime: #D0FF14;
        --lime-on: #15212A;
        --border: rgba(15, 59, 71, 0.12);
        --border-strong: rgba(15, 59, 71, 0.2);
        --shadow-sm: 0 1px 2px rgba(15, 33, 42, 0.04), 0 4px 12px -4px rgba(15, 33, 42, 0.06);
        --shadow-md: 0 4px 12px -2px rgba(15, 33, 42, 0.08), 0 12px 32px -8px rgba(15, 33, 42, 0.12);
      }

      .display {
        font-family: 'Instrument Serif', serif;
        letter-spacing: -0.015em;
        font-weight: 400;
      }

      .mono {
        font-family: 'JetBrains Mono', monospace;
      }

      html { scroll-behavior: smooth; }

      @keyframes scrollCueBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(8px); }
      }
      .scroll-cue { animation: scrollCueBounce 1.6s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .scroll-cue { animation: none; }
      }
    `}</style>
  );
}
