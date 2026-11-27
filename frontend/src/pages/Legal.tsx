import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Scale,
  ShieldCheck,
  FileText,
  ArrowLeft,
  Server,
  Database,
  Cookie,
  UserCheck,
  Lock,
  Swords,
  Award,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

type LegalTab = 'legal' | 'privacy' | 'terms';

export const Legal: FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as LegalTab | null;

  const [activeTab, setActiveTab] = useState<LegalTab>(
    tabParam === 'privacy' || tabParam === 'terms' ? tabParam : 'legal'
  );

  useEffect(() => {
    if (tabParam === 'privacy' || tabParam === 'terms' || tabParam === 'legal') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: LegalTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 text-start space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Scale className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
              {t('legal.title')}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {t('legal.subtitle')}
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-all shadow-md self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{t('common.backHome')}</span>
        </Link>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3">
        <button
          type="button"
          onClick={() => handleTabChange('legal')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'legal'
              ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-500/10'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Scale className="w-4 h-4" aria-hidden="true" />
          <span>{t('legal.tabLegal')}</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('privacy')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'privacy'
              ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-500/10'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          <span>{t('legal.tabPrivacy')}</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('terms')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'terms'
              ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-500/10'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <FileText className="w-4 h-4" aria-hidden="true" />
          <span>{t('legal.tabTerms')}</span>
        </button>
      </div>

      {/* Tab 1: Mentions Légales */}
      {activeTab === 'legal' && (
        <div className="space-y-6">
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-3 text-cyan-400">
              <UserCheck className="w-5 h-5" aria-hidden="true" />
              <h2 className="text-lg font-bold text-white">{t('legal.editorTitle')}</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t('legal.editorText')}
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-3 text-cyan-400">
              <Server className="w-5 h-5" aria-hidden="true" />
              <h2 className="text-lg font-bold text-white">{t('legal.hostingTitle')}</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t('legal.hostingText')}
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-3 text-cyan-400">
              <Award className="w-5 h-5" aria-hidden="true" />
              <h2 className="text-lg font-bold text-white">{t('legal.ipTitle')}</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t('legal.ipText')}
            </p>
          </section>
        </div>
      )}

      {/* Tab 2: Confidentialité & RGPD */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-3 text-cyan-400">
              <Database className="w-5 h-5" aria-hidden="true" />
              <h2 className="text-lg font-bold text-white">{t('legal.rgpdTitle')}</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t('legal.rgpdText')}
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-3 text-cyan-400">
              <Cookie className="w-5 h-5" aria-hidden="true" />
              <h2 className="text-lg font-bold text-white">{t('legal.cookiesTitle')}</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t('legal.cookiesText')}
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-3 text-cyan-400">
              <Lock className="w-5 h-5" aria-hidden="true" />
              <h2 className="text-lg font-bold text-white">{t('legal.rightsTitle')}</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t('legal.rightsText')}
            </p>
            <div className="pt-2">
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>Accéder à mon profil joueur</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
      )}

      {/* Tab 3: Règles du jeu & CGU */}
      {activeTab === 'terms' && (
        <div className="space-y-6">
          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-3 text-purple-400">
              <Swords className="w-5 h-5" aria-hidden="true" />
              <h2 className="text-lg font-bold text-white">{t('legal.cguTitle')}</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t('legal.cguText')}
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-3 text-purple-400">
              <MessageSquare className="w-5 h-5" aria-hidden="true" />
              <h2 className="text-lg font-bold text-white">Communication & Chat</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Les canaux de discussion publics et privés doivent rester bienveillants. Les insultes, le harcèlement, le spam ou la diffusion de contenus illicites entraînent un blocage immédiat du compte.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-3 text-purple-400">
              <AlertCircle className="w-5 h-5" aria-hidden="true" />
              <h2 className="text-lg font-bold text-white">{t('legal.liabilityTitle')}</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t('legal.liabilityText')}
            </p>
          </section>
        </div>
      )}
    </div>
  );
};
