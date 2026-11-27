import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Play, Trophy, Sparkles, Users, Gamepad2, Wifi } from 'lucide-react';
import { getPlatformStats } from '../../services/statsService';
import type { PlatformStats } from '../../types/stats';

export const HeroSection: FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    let isMounted = true;
    getPlatformStats().then((data) => {
      if (isMounted) {
        setStats(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative pt-6 pb-14 text-center overflow-hidden">
      {/* Background Glow Decorations */}
      <div
        className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 end-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Seasonal Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-semibold tracking-wide shadow-md shadow-cyan-500/10 backdrop-blur-md">
          <Sparkles className="w-4 h-4 animate-pulse" aria-hidden="true" />
          <span>{t('home.hero.badge')}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
          <span className="block text-slate-100">{t('home.hero.titlePrefix')}</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
            {t('home.hero.titleHighlight')}
          </span>{' '}
          <span className="text-slate-100">{t('home.hero.titleSuffix')}</span>
        </h1>

        {/* Hero Slogan */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-400 leading-relaxed font-normal">
          {t('home.hero.slogan')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/play"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 hover:from-cyan-300 hover:to-sky-200 transition-all shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-cyan-500/40 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" aria-hidden="true" />
            <span>{t('home.hero.playButton')}</span>
          </Link>

          <Link
            to="/leaderboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-semibold text-base text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
          >
            <Trophy className="w-5 h-5 text-amber-400" aria-hidden="true" />
            <span>{t('home.hero.leaderboardButton')}</span>
          </Link>
        </div>

        {/* Live Platform Stats */}
        {stats && (
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 text-cyan-400 mb-1">
                <Users className="w-4 h-4" aria-hidden="true" />
                <span className="text-xl font-extrabold text-white">
                  {stats.activePlayersCount.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-400">{t('home.hero.statsActivePlayers')}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 text-indigo-400 mb-1">
                <Gamepad2 className="w-4 h-4" aria-hidden="true" />
                <span className="text-xl font-extrabold text-white">
                  {stats.matchesPlayedTotal.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-400">{t('home.hero.statsMatchesPlayed')}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
                <Wifi className="w-4 h-4" aria-hidden="true" />
                <span className="text-xl font-extrabold text-white">
                  {stats.serverLatencyMs} {t('common.milliseconds')}
                </span>
              </div>
              <p className="text-xs text-slate-400">{t('home.hero.statsServerLatency')}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
