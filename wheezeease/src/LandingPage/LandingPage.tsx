import { Link } from "react-router-dom";
import "./LandingPage.css";

export const LandingPage = () => {
  return (
    <div className="landing">
      {/* Header */}
      <header className="landing-header">
        <div className="brand">
          <div className="brand-icon">
            <LungsIcon className="icon" />
          </div>
          <span className="brand-name">
            <span className="brand-wheeze">Wheeze</span>
            <span className="brand-ease">Ease</span>
          </span>
        </div>

        <div className="header-actions">
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
          <Link to="/signup" className="btn btn-primary">
            Sign up
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="hero">
        <div className="hero-grid">
          {/* Left column */}
          <div className="hero-content">
            <div className="badge">
              <ShieldCheckIcon className="icon-sm" />
              HIPAA-compliant clinical platform
            </div>

            <h1 className="hero-title">
              <span className="brand-wheeze">Wheeze</span>
              <span className="brand-ease">Ease</span>
            </h1>

            <p className="hero-tagline">Stay ahead of every wheeze</p>

            <p className="hero-description">
              Monitor patients in real time with AI-powered asthma risk
              predictions, smart alerts, and a clear clinical dashboard
              built for doctors and care teams.
            </p>

            <div className="stats">
              <Stat value="200+" label="Clinicians onboard" />
              <Stat value="24/7" label="Real-time monitoring" />
              <Stat value="AI" label="Risk predictions" />
            </div>
          </div>

          {/* Right column - illustration */}
          <div className="hero-illustration">
            <BreathingIllustration />
          </div>
        </div>
      </main>
    </div>
  );
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat">
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12.5 11 15l4.5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LungsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 3v6m-2 0c-2 0-4 1-5 3-1 2-1 5 0 7 1 1.5 2.5 1.5 3 0l2-6m2-4c2 0 4 1 5 3 1 2 1 5 0 7-1 1.5-2.5 1.5-3 0l-2-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BreathingIllustration() {
  return (
    <svg
      width="400"
      height="460"
      viewBox="0 0 280 320"
      role="img"
      aria-label="Illustration of a person meditating and breathing calmly"
      focusable="false"
    >
      <title>Calm breathing illustration</title>

      {/* ground shadow */}
      <ellipse cx="140" cy="290" rx="110" ry="14" fill="#E1F5EE" />

      {/* backdrop circle */}
      <circle cx="140" cy="120" r="100" fill="#F5F4ED" />

      {/* body */}
      <ellipse cx="140" cy="265" rx="58" ry="14" fill="#0F6E56" opacity="0.15" />
      <path
        d="M85 260 Q90 200 100 190 Q120 175 140 175 Q160 175 180 190 Q190 200 195 260 Z"
        fill="#0F6E56"
      />

      {/* head */}
      <circle cx="140" cy="135" r="34" fill="#F0997B" />

      {/* hair band */}
      <path
        d="M108 125 Q140 105 172 125 Q172 110 140 105 Q108 110 108 125 Z"
        fill="#26215C"
      />

      {/* face */}
      <circle cx="125" cy="135" r="2.5" fill="#26215C" />
      <circle cx="155" cy="135" r="2.5" fill="#26215C" />
      <path
        d="M125 150 Q140 158 155 150"
        stroke="#26215C"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* hair bun */}
      <circle cx="140" cy="98" r="10" fill="#26215C" />

      {/* breath particles */}
      <g>
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="140" cy="160" r="6" fill="#1D9E75" opacity="0.9">
            <animate
              attributeName="cy"
              values="160;120;90"
              dur="3s"
              begin={`${i}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.9;0.5;0"
              dur="3s"
              begin={`${i}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="5;9;13"
              dur="3s"
              begin={`${i}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
    </svg>
  );
}
