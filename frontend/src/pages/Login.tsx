import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getLoginUrl } from '../api/auth.api';

export default function Login() {
  const navigate = useNavigate();
  const { sourceAccount, destinationAccount, isFullyConnected } = useAuth();

  const handleConnectSource = () => {
    window.location.href = getLoginUrl('source');
  };

  const handleConnectDestination = () => {
    window.location.href = getLoginUrl('destination');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-600/6 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-white/[0.08] bg-surface-900/60 p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white">Connect Accounts</h1>
            <p className="mt-2 text-sm text-surface-400">
              Link your source and destination Google accounts
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {/* Step 1: Source Account */}
            <div
              className={`rounded-2xl border p-5 transition-all duration-300
                ${
                  sourceAccount
                    ? 'border-success/30 bg-success/5'
                    : 'border-white/[0.08] bg-surface-800/30'
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold
                    ${
                      sourceAccount
                        ? 'bg-success/20 text-success'
                        : 'bg-primary-500/20 text-primary-400'
                    }`}
                >
                  {sourceAccount ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    '1'
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    Source Account
                  </p>
                  <p className="mt-0.5 text-xs text-surface-500">
                    {sourceAccount
                      ? sourceAccount.email
                      : 'Account to transfer files from'}
                  </p>
                </div>
              </div>
              {!sourceAccount && (
                <button
                  id="connect-source-btn"
                  onClick={handleConnectSource}
                  className="mt-4 w-full cursor-pointer rounded-xl border border-white/[0.1] bg-surface-800 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:border-primary-500/30 hover:bg-surface-700"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Connect Source Account
                  </span>
                </button>
              )}
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.06] bg-surface-800/50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-surface-500">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </div>
            </div>

            {/* Step 2: Destination Account */}
            <div
              className={`rounded-2xl border p-5 transition-all duration-300
                ${
                  destinationAccount
                    ? 'border-success/30 bg-success/5'
                    : sourceAccount
                      ? 'border-white/[0.08] bg-surface-800/30'
                      : 'border-white/[0.04] bg-surface-900/30 opacity-50'
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold
                    ${
                      destinationAccount
                        ? 'bg-success/20 text-success'
                        : 'bg-surface-700 text-surface-400'
                    }`}
                >
                  {destinationAccount ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    '2'
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    Destination Account
                  </p>
                  <p className="mt-0.5 text-xs text-surface-500">
                    {destinationAccount
                      ? destinationAccount.email
                      : 'Account to transfer files to'}
                  </p>
                </div>
              </div>
              {sourceAccount && !destinationAccount && (
                <button
                  id="connect-destination-btn"
                  onClick={handleConnectDestination}
                  className="mt-4 w-full cursor-pointer rounded-xl border border-white/[0.1] bg-surface-800 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:border-primary-500/30 hover:bg-surface-700"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Connect Destination Account
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Continue Button */}
          {isFullyConnected && (
            <button
              id="continue-dashboard-btn"
              onClick={() => navigate('/dashboard')}
              className="mt-6 w-full cursor-pointer rounded-xl border-none bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30 hover:brightness-110"
            >
              <span className="flex items-center justify-center gap-2">
                Continue to Dashboard
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
