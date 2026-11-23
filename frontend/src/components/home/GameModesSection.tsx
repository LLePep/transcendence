import type { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Swords, Bot, Users, ArrowRight } from 'lucide-react';
import type { GameModeCardInfo } from '../../types/game';

export const GameModesSection: FC = () => {
  const { t } = useTranslation();

  const modes: (GameModeCardInfo & { icon: ReactNode; borderHover: string; gradient: string })[] = [
    {
      id: 'online',
      badgeKey: 'home.gameModes.online.badge',
      titleKey: 'home.gameModes.online.title',
      descriptionKey: 'home.gameModes.online.description',
      actionKey: 'home.gameModes.online.action',
      route: '/play?mode=online',
      accentColor: 'text-cyan-400',
      borderHover: 'hover:border-cyan-500/50',
      gradient: 'from-cyan-500/10 via-transparent to-transparent',
      icon: <Swords className="w-8 h-8 text-cyan-400" aria-hidden="true" />,
    },
    {
      id: 'ai',
      badgeKey: 'home.gameModes.ai.badge',
      titleKey: 'home.gameModes.ai.title',
      descriptionKey: 'home.gameModes.ai.description',
      actionKey: 'home.gameModes.ai.action',
      route: '/play?mode=ai',
      accentColor: 'text-emerald-400',
      borderHover: 'hover:border-emerald-500/50',
      gradient: 'from-emerald-500/10 via-transparent to-transparent',
      icon: <Bot className="w-8 h-8 text-emerald-400" aria-hidden="true" />,
    },
    {
      id: 'join',
      badgeKey: 'home.gameModes.join.badge',
      titleKey: 'home.gameModes.join.title',
      descriptionKey: 'home.gameModes.join.description',
      actionKey: 'home.gameModes.join.action',
      route: '/play?mode=custom',
      accentColor: 'text-purple-400',
      borderHover: 'hover:border-purple-500/50',
      gradient: 'from-purple-500/10 via-transparent to-transparent',
      icon: <Users className="w-8 h-8 text-purple-400" aria-hidden="true" />,
    },
  ];

  return (
    <section className="py-10 text-start">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {t('home.gameModes.sectionTitle')}
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-1">
          {t('home.gameModes.sectionSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modes.map((mode) => (
          <div
            key={mode.id}
            className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 border border-slate-800 ${mode.borderHover} bg-gradient-to-b ${mode.gradient} shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
          >
            <div>
              {/* Badge & Icon Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner">
                  {mode.icon}
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/70 border border-slate-700/60 text-slate-300">
                  {t(mode.badgeKey)}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {t(mode.titleKey)}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {t(mode.descriptionKey)}
              </p>
            </div>

            {/* Action Button */}
            <Link
              to={mode.route}
              className="inline-flex items-center justify-between w-full px-4 py-3 rounded-xl bg-slate-800/80 group-hover:bg-slate-700/80 text-white font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              <span>{t(mode.actionKey)}</span>
              <ArrowRight
                className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};
