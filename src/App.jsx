import { useState } from "react";

export default function App() {
  const [email, setEmail] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 20%, rgba(120,60,255,0.25) 0%, rgba(0,0,0,1) 60%)",
        color: "#fff",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Hero */}
      <header style={{ padding: "2rem 1.5rem 1rem", textAlign: "center" }}>
        <div
          style={{
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          Fabrication • Architecture • Light
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 2.5vw, 3rem)",
            fontWeight: 600,
            lineHeight: 1.1,
            marginTop: "0.5rem",
            background:
              "linear-gradient(90deg, rgb(255,255,255) 0%, rgb(150,120,255) 50%, rgb(0,200,255) 100%)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          We build impossible objects
        </h1>

        <p
          style={{
            maxWidth: "650px",
            margin: "1rem auto 0",
            fontSize: "1rem",
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          High-end sculptures, laser-cut metal, custom lighting,
          and interactive installations for luxury spaces,
          museums, and nightlife. Designed in Miami. Deployed worldwide.
        </p>
      </header>

      {/* Feature Grid */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(260px,100%),1fr))",
          gap: "1rem",
          padding: "1rem 1.5rem",
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <FeatureCard
          title="Large-Scale Metal"
          body="CNC tube + sheet laser. Mirror polish stainless. Architectural frames."
          badge="Precision"
        />
        <FeatureCard
          title="Light & Motion"
          body="Kinetic light sculpture, mapped lasers, DMX, responsive control."
          badge="Energy"
        />
        <FeatureCard
          title="Install Team"
          body="Design, fabrication, crating, delivery, on-site install. End-to-end."
          badge="Turnkey"
        />
      </section>

      {/* Email capture / CTA */}
      <section
        style={{
          padding: "2rem 1.5rem 3rem",
          textAlign: "center",
          marginTop: "auto",
        }}
      >
        <div
          style={{
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            opacity: 0.6,
            marginBottom: "0.5rem",
          }}
        >
          Get the capabilities deck
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert(`We'll follow up at: ${email}`);
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            maxWidth: "360px",
            width: "100%",
            margin: "0.5rem auto 0",
          }}
        >
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@brand.com"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "10px",
              padding: "0.9rem 1rem",
              fontSize: "0.95rem",
              color: "#fff",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              background:
                "linear-gradient(90deg, rgb(120,60,255) 0%, rgb(0,200,255) 100%)",
              border: "none",
              borderRadius: "10px",
              padding: "0.9rem 1rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#000",
              cursor: "pointer",
            }}
          >
            Send me the deck →
          </button>
        </form>

        <div
          style={{
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.4)",
            marginTop: "0.75rem",
          }}
        >
          No spam. Just examples that close clients.
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          fontSize: "0.7rem",
          color: "rgba(255,255,255,0.4)",
          paddingBottom: "2rem",
        }}
      >
        © {new Date().getFullYear()} Miami Design Shop — All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ title, body, badge }) {
  return (
    <div
      style={{
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(0,0,0,0) 60%)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: "16px",
        padding: "1rem 1rem 1.25rem",
        minHeight: "150px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          fontSize: "0.7rem",
          lineHeight: 1,
          padding: "0.4rem 0.6rem",
          background:
            "radial-gradient(circle at 0% 0%, rgba(120,60,255,0.6) 0%, rgba(0,0,0,0) 70%)",
          color: "#fff",
          borderBottomLeftRadius: "16px",
          borderTopRightRadius: "16px",
          fontWeight: 500,
          letterSpacing: "0.05em",
        }}
      >
        {badge}
      </div>

      <div style={{ fontWeight: 600, fontSize: "1rem", color: "#fff" }}>
        {title}
      </div>
      <div
        style={{
          fontSize: "0.8rem",
          lineHeight: 1.4,
          color: "rgba(255,255,255,0.6)",
          marginTop: "0.5rem",
          maxWidth: "240px",
        }}
      >
        {body}
      </div>
    </div>
  );
}
