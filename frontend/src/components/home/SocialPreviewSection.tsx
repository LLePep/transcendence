import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy, Users, Swords, Crown, Medal, ArrowUpRight } from 'lucide-react';
import { getLeaderboardPreview } from '../../services/leaderboardService';
import { getOnlinePlayersPreview } from '../../services/socialService';
import type { LeaderboardEntry } from '../../types/leaderboard';
import type { OnlinePlayer, PlayerStatus } from '../../types/social';

export const SocialPreviewSection: FC = () => {
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [players, setPlayers] = useState<OnlinePlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getLeaderboardPreview(), getOnlinePlayersPreview()]).then(
      ([leaderboardData, playersData]) => {
        if (isMounted) {
          setLeaderboard(leaderboardData);
          setPlayers(playersData);
          setIsLoading(false);
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, []);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-xs">
            <Crown className="w-4 h-4" aria-hidden="true" />
          </div>
        );
      case 2:
        return (
          <div className="w-7 h-7 rounded-lg bg-slate-300/20 text-slate-200 border border-slate-300/40 flex items-center justify-center font-bold text-xs">
            <Medal className="w-4 h-4" aria-hidden="true" />
          </div>
        );
      case 3:
        return (
          <div className="w-7 h-7 rounded-lg bg-amber-700/20 text-amber-600 border border-amber-700/40 flex items-center justify-center font-bold text-xs">
            <Medal className="w-4 h-4" aria-hidden="true" />
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs">
            {rank}
          </div>
        );
    }
  };

  const getStatusDisplay = (status: PlayerStatus) => {
    switch (status) {
      case 'online':
        return {
          dot: 'bg-emerald-400',
          badge: 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400',
          label: t('common.online'),
        };
      case 'in_game':
        return {
          dot: 'bg-amber-400',
          badge: 'bg-amber-950/40 border-amber-800/40 text-amber-400',
          label: t('common.inGame'),
        };
      case 'offline':
      default:
        return {
          dot: 'bg-slate-500',
          badge: 'bg-slate-900 border-slate-800 text-slate-400',
          label: t('common.offline'),
        };
    }
  };

  return (
    <section className="py-10 text-start">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leaderboard Preview Column */}
        <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Trophy className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {t('home.social.leaderboardTitle')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {t('home.social.leaderboardSubtitle')}
                  </p>
                </div>
              </div>

              <Link
                to="/leaderboard"
                className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>{t('home.social.viewFullLeaderboard')}</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* List */}
            {isLoading ? (
              <div className="py-8 text-center text-slate-500 text-sm">
                {t('common.loading')}
              </div>
            ) : (
              <ul className="space-y-3">
                {leaderboard.slice(0, 4).map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getRankBadge(entry.rank)}
                      <img
                        src={entry.avatarUrl}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                        loading="lazy"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">
                            {entry.username}
                          </span>
                          {entry.isOnline && (
                            <span
                              className="w-2 h-2 rounded-full bg-emerald-400"
                              title={t('common.online')}
                              aria-label={t('common.online')}
                            />
                          )}
                        </div>
                        <span className="text-xs text-slate-400">
                          {entry.winRate}% {t('common.winRate')}
                        </span>
                      </div>
                    </div>

                    <div className="text-end">
                      <span className="block font-bold text-sm text-cyan-400">
                        {entry.elo}
                      </span>
                      <span className="block text-[11px] font-medium text-slate-500 uppercase">
                        {t('common.elo')}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Online Friends / Players Column */}
        <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Users className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {t('home.social.onlineFriendsTitle')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {t('home.social.onlineFriendsSubtitle')}
                  </p>
                </div>
              </div>

              <Link
                to="/chat"
                className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>{t('common.viewAll')}</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* List */}
            {isLoading ? (
              <div className="py-8 text-center text-slate-500 text-sm">
                {t('common.loading')}
              </div>
            ) : (
              <ul className="space-y-3">
                {players.map((player) => {
                  const statusInfo = getStatusDisplay(player.status);
                  return (
                    <li
                      key={player.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={player.avatarUrl}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover border border-slate-700"
                            loading="lazy"
                          />
                          <span
                            className={`absolute bottom-0 end-0 w-2.5 h-2.5 rounded-full ring-2 ring-slate-950 ${statusInfo.dot}`}
                            aria-hidden="true"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white">
                              {player.username}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusInfo.badge}`}
                            >
                              {statusInfo.label}
                            </span>
                          </div>
                          {player.currentActivity && (
                            <span className="text-xs text-slate-400">
                              {player.currentActivity}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        {player.status !== 'offline' ? (
                          <Link
                            to={`/play?challenge=${player.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold transition-colors"
                          >
                            <Swords className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{t('home.social.challengeFriend')}</span>
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-500 font-medium">
                            {player.elo} {t('common.points')}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
