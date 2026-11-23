import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Database, Cookie, UserCheck } from 'lucide-react';

export const Privacy: FC = () => {
  const { t } = useTranslation();

  return (
    <article className="max-w-3xl mx-auto py-8 text-start space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t('placeholders.privacy.title')}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {t('placeholders.privacy.description')}
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{t('common.backHome')}</span>
        </Link>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        <section className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-lg">
            <Database className="w-5 h-5" aria-hidden="true" />
            <h2>{t('placeholders.privacy.section1Title')}</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            {t('placeholders.privacy.section1Text')}
          </p>
        </section>

        <section className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-lg">
            <Cookie className="w-5 h-5" aria-hidden="true" />
            <h2>{t('placeholders.privacy.section2Title')}</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            {t('placeholders.privacy.section2Text')}
          </p>
        </section>

        <section className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-lg">
            <UserCheck className="w-5 h-5" aria-hidden="true" />
            <h2>{t('placeholders.privacy.section3Title')}</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            {t('placeholders.privacy.section3Text')}
          </p>
        </section>
      </div>
    </article>
  );
};
