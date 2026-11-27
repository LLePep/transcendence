import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { GoogleAuthButton } from '../components/common/GoogleAuthButton';

export const Login: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, refreshUser } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingGoogle, setIsProcessingGoogle] = useState(false);

  // If already authenticated, redirect to profile
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  // Handle Google OAuth callback parameters
  useEffect(() => {
    const googleToken = searchParams.get('googleToken');
    const googleAuthError = searchParams.get('googleAuthError');

    if (googleToken) {
      setIsProcessingGoogle(true);
      authService.setStoredToken(googleToken);
      refreshUser()
        .then((profile) => {
          if (profile) {
            navigate('/profile', { replace: true });
          }
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : t('auth.googleAuthFailed'));
        })
        .finally(() => {
          setIsProcessingGoogle(false);
        });
    } else if (googleAuthError) {
      if (googleAuthError === 'not_configured') {
        setError(t('auth.googleNotConfigured'));
      } else {
        setError(`${t('auth.googleAuthFailed')} (${googleAuthError})`);
      }
    }
  }, [searchParams, refreshUser, navigate, t]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim() || !password) {
      setError(t('auth.identifier') + ' & ' + t('auth.password') + ' sont requis.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ identifier: identifier.trim(), password });
      navigate('/profile');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12">
      <div className="p-8 sm:p-10 max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 shadow-lg shadow-cyan-500/10">
          <LogIn className="w-8 h-8" aria-hidden="true" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-center text-white tracking-wide mb-2">
          {t('auth.login')}
        </h1>

        <p className="text-slate-400 text-sm text-center mb-6">
          {t('placeholders.login.description')}
        </p>

        {isProcessingGoogle && (
          <div className="mb-6 p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-sm flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400 shrink-0" />
            <span>{t('auth.authenticatingGoogle')}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Google OAuth Login Button */}
        <div className="mb-6">
          <GoogleAuthButton
            label={t('auth.continueWithGoogle')}
            disabled={isSubmitting || isProcessingGoogle}
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900/95 px-3 text-slate-500 font-semibold tracking-wider">
                {t('auth.orDivider')}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              {t('auth.identifier')}
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={t('auth.identifierPlaceholder')}
              disabled={isSubmitting || isProcessingGoogle}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              {t('auth.password')}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.passwordPlaceholder')}
              disabled={isSubmitting || isProcessingGoogle}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isProcessingGoogle}
            className="w-full mt-2 py-3.5 px-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('auth.submitting')}</span>
              </>
            ) : (
              <span>{t('auth.submitLogin')}</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center text-sm text-slate-400">
          <span>{t('auth.noAccountYet')} </span>
          <Link
            to="/register"
            className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {t('auth.goToRegister')}
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('common.backHome')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
