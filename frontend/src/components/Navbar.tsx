import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { sourceAccount, destinationAccount, logout } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-surface-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/20">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Vault<span className="text-primary-400">Bridge</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {sourceAccount && (
            <div className="hidden items-center gap-2 rounded-full bg-surface-800/50 px-3 py-1.5 text-xs sm:flex">
              <span className="h-2 w-2 rounded-full bg-success" />
              <span className="text-surface-300">{sourceAccount.email}</span>
            </div>
          )}
          {destinationAccount && (
            <div className="hidden items-center gap-2 rounded-full bg-surface-800/50 px-3 py-1.5 text-xs sm:flex">
              <span className="h-2 w-2 rounded-full bg-primary-400" />
              <span className="text-surface-300">
                {destinationAccount.email}
              </span>
            </div>
          )}
          {!isHome && sourceAccount && (
            <button
              onClick={logout}
              className="cursor-pointer rounded-lg border border-white/10 bg-transparent px-3 py-1.5 text-xs font-medium text-surface-400 transition-all duration-200 hover:border-danger/40 hover:text-danger"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
