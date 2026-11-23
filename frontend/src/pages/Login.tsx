import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LogIn, ArrowLeft, Construction } from 'lucide-react';

export const Login: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
      <div className="p-8 sm:p-12 max-w-lg w-full bg-slate-900/60 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 shadow-lg shadow-cyan-500/10">
          <LogIn className="w-8 h-8" aria-hidden="true" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
          <Construction className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t('common.placeholderBadge')}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide mb-3">
          {t('placeholders.login.title')}
        </h1>

        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
          {t('placeholders.login.description')}
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{t('common.backHome')}</span>
        </Link>
      </div>
    </div>
  );
};
