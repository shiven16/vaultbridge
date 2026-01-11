import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { handleCallback as apiHandleCallback } from '../api/auth.api';

export default function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { sourceAccount, setSourceAccount, setDestinationAccount } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const type = searchParams.get('type') || (sourceAccount ? 'destination' : 'source');

      if (!code) {
        setError('Missing authorization code');
        return;
      }

      try {
        const result = await apiHandleCallback(code);

        const accountInfo = {
          email: result.user.email,
          name: result.user.name,
          token: result.token,
        };

        if (type === 'source') {
          setSourceAccount(accountInfo);
        } else {
          setDestinationAccount(accountInfo);
        }

        navigate('/login');
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Authentication failed',
        );
      }
    };

    processCallback();
  }, [searchParams, navigate, sourceAccount, setSourceAccount, setDestinationAccount]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-2xl border border-danger/20 bg-surface-900/60 p-8 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <p className="mt-4 text-sm text-danger">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 cursor-pointer rounded-lg bg-surface-800 px-4 py-2 text-sm text-white transition-colors hover:bg-surface-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary-500/20 border-t-primary-500" />
        <p className="text-sm text-surface-400">Authenticating…</p>
      </div>
    </div>
  );
}
