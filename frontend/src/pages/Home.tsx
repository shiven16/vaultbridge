import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-600/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-primary-400/5 blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5 text-xs font-medium text-primary-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-400" />
          Secure Google Drive Transfer
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
          Transfer files between{' '}
          <span className="bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
            Google accounts
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-surface-400">
          Connect two Google accounts, pick your files, and let VaultBridge
          stream them directly — fast, secure, and seamless.
        </p>

        {/* CTA */}
        <button
          id="get-started-btn"
          onClick={() => navigate('/login')}
          className="group mt-10 cursor-pointer rounded-2xl border-none bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-primary-500/25 transition-all duration-300 hover:shadow-primary-500/40 hover:brightness-110"
        >
          <span className="flex items-center gap-2">
            Get Started
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </button>

        {/* Feature Cards */}
        <div className="mt-20 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: '🔒',
              title: 'Secure',
              desc: 'Tokens stored in memory, never in localStorage',
            },
            {
              icon: '⚡',
              title: 'Streaming',
              desc: 'Files stream directly between accounts',
            },
            {
              icon: '🔄',
              title: 'Reliable',
              desc: 'Auto-retry with cron job for failed transfers',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/[0.06] bg-surface-900/50 p-5 text-center backdrop-blur-sm transition-colors hover:border-white/[0.1]"
            >
              <span className="text-2xl">{f.icon}</span>
              <p className="mt-2 text-sm font-semibold text-white">
                {f.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-surface-500">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
