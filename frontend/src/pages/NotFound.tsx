import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFound: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
      <div className="p-8 sm:p-12 max-w-lg w-full bg-slate-900/60 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 shadow-lg shadow-rose-500/10">
          <AlertCircle className="w-8 h-8" aria-hidden="true" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide mb-3">
          {t('placeholders.notFound.title')}
        </h1>

        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
          {t('placeholders.notFound.description')}
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{t('placeholders.notFound.backHome')}</span>
        </Link>
      </div>
    </div>
  );
};
