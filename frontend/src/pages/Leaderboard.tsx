import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Trophy, ArrowLeft, Crown, Medal } from 'lucide-react';
import { getLeaderboard } from '../services/leaderboardService';
import type { LeaderboardEntry } from '../types/leaderboard';

export const Leaderboard: FC = () => {
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getLeaderboard(100).then((data) => {
      if (isMounted) {
        setLeaderboard(data.slice(0, 100));
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-sm">
            <Crown className="w-5 h-5" aria-hidden="true" />
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-lg bg-slate-300/20 text-slate-200 border border-slate-300/40 flex items-center justify-center font-bold text-sm">
            <Medal className="w-5 h-5" aria-hidden="true" />
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-700/20 text-amber-600 border border-amber-700/40 flex items-center justify-center font-bold text-sm">
            <Medal className="w-5 h-5" aria-hidden="true" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-sm">
            #{rank}
          </div>
        );
    }
  };

  return (
    <div className="flex-1 py-10 max-w-5xl mx-auto w-full px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/10">
            <Trophy className="w-8 h-8" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
              {t('placeholders.leaderboard.title')}
            </h1>
            <p className="text-slate-400 text-sm">
              {t('home.social.leaderboardSubtitle')}
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white font-medium text-sm transition-all self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{t('common.backHome')}</span>
        </Link>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl backdrop-blur-sm overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            {t('common.loading')}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            {t('home.social.emptyLeaderboard')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold">
                  <th className="py-4 px-6 text-start">Rang</th>
                  <th className="py-4 px-6 text-start">Joueur</th>
                  <th className="py-4 px-6 text-end">ELO</th>
                  <th className="py-4 px-6 text-end">Victoires</th>
                  <th className="py-4 px-6 text-end">Défaites</th>
                  <th className="py-4 px-6 text-end">Taux</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {leaderboard.map((player) => (
                  <tr
                    key={player.id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        {getRankBadge(player.rank)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={player.avatarUrl}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border border-slate-700"
                            loading="lazy"
                          />
                          {player.isOnline && (
                            <span
                              className="absolute bottom-0 end-0 w-2.5 h-2.5 rounded-full ring-2 ring-slate-950 bg-emerald-400"
                              title={t('common.online')}
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <span className="font-semibold text-white">
                          {player.username}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-end font-bold text-cyan-400">
                      {player.elo}
                    </td>
                    <td className="py-4 px-6 text-end text-emerald-400 font-medium">
                      {player.wins}
                    </td>
                    <td className="py-4 px-6 text-end text-rose-400 font-medium">
                      {player.losses}
                    </td>
                    <td className="py-4 px-6 text-end text-slate-300 font-medium">
                      {player.winRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
