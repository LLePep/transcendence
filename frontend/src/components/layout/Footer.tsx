import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Gamepad2, ShieldCheck, FileText, Activity, Scale } from 'lucide-react';

export const Footer: FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 mt-auto text-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="font-extrabold text-base tracking-wider text-slate-100">
                {t('nav.brand')}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {t('footer.description')}
            </p>
            {/* Live Server Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-xs font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Activity className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('footer.systemStatus')}</span>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t('footer.legalSection')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/legal"
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors focus:outline-none focus-visible:underline"
                >
                  <Scale className="w-4 h-4" aria-hidden="true" />
                  <span>{t('footer.legalLink')}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/legal?tab=privacy"
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors focus:outline-none focus-visible:underline"
                >
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  <span>{t('footer.privacy')}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/legal?tab=terms"
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors focus:outline-none focus-visible:underline"
                >
                  <FileText className="w-4 h-4" aria-hidden="true" />
                  <span>{t('footer.terms')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Info & 42 Attribution */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t('footer.github')}
            </h3>
            <p className="text-sm text-slate-400">
              {t('footer.builtWith')}
            </p>
            <div className="pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label={t('footer.githubLink')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>{t('footer.githubLink')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {currentYear} {t('nav.brand')}. {t('footer.allRightsReserved')}
          </p>
          <div className="flex items-center gap-3 text-slate-400">
            <Link
              to="/legal"
              className="hover:text-cyan-400 transition-colors underline decoration-slate-700 underline-offset-4"
            >
              {t('footer.legalLink')}
            </Link>
            <span>•</span>
            <span>{t('nav.brandSub')}</span>
            <span>•</span>
            <span>{t('footer.projectBadge')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
