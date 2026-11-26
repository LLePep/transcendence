import { useState, useRef } from 'react';
import type { FC, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  User as UserIcon,
  Camera,
  Trophy,
  Swords,
  Shield,
  Flame,
  Award,
  Calendar,
  Mail,
  Edit3,
  Check,
  X,
  LogIn,
  UserPlus,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Profile: FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading, updateProfile, uploadAvatar } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSavingBio, setIsSavingBio] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // If loading session
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="text-slate-400 text-sm">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  // If user is not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
        <div className="p-8 sm:p-12 max-w-lg w-full bg-slate-900/60 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 shadow-lg shadow-purple-500/10">
            <UserIcon className="w-8 h-8" aria-hidden="true" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide mb-3">
            {t('auth.notConnected')}
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
            {t('auth.connectToAccessProfile')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('auth.login')}</span>
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('auth.register')}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stats = user.stats || {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    kills: 0,
    deaths: 0,
    highestScore: 0,
    xp: 0,
    level: 1,
    rating: 1000,
  };

  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.wins / stats.gamesPlayed) * 100)
      : 0;

  const kdRatio =
    stats.deaths > 0
      ? (stats.kills / stats.deaths).toFixed(2)
      : stats.kills.toFixed(2);

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage(null);
    setIsUploadingAvatar(true);
    try {
      await uploadAvatar(file);
      setMessage({ type: 'success', text: 'Avatar mis à jour avec succès !' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Échec de l\'upload de l\'avatar';
      setMessage({ type: 'error', text: msg });
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const startEditBio = () => {
    setBioText(user.bio || '');
    setIsEditingBio(true);
  };

  const saveBio = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSavingBio(true);
    try {
      await updateProfile({ bio: bioText });
      setIsEditingBio(false);
      setMessage({ type: 'success', text: 'Bio enregistrée !' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Échec de mise à jour';
      setMessage({ type: 'error', text: msg });
    } finally {
      setIsSavingBio(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-8 max-w-5xl mx-auto w-full py-4">
      {/* Alert Notification */}
      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-sm ${
            message.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
              : 'bg-red-950/40 border-red-800/60 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {message.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="p-1 hover:opacity-80 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Card Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with Upload */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-slate-950 border-2 border-cyan-500/40 flex items-center justify-center overflow-hidden shadow-2xl shadow-cyan-500/10">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl sm:text-5xl font-black text-cyan-400">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              )}

              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg cursor-pointer disabled:opacity-50"
              title={t('profile.changeAvatar')}
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-3 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                  {user.username}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{user.email}</span>
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Membre depuis {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold self-center sm:self-start">
                <span
                  className={`w-2 h-2 rounded-full ${
                    user.status === 'ONLINE'
                      ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                      : user.status === 'IN_GAME'
                      ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                      : 'bg-slate-500'
                  }`}
                />
                <span className="text-slate-200">
                  {user.status === 'ONLINE'
                    ? t('common.online')
                    : user.status === 'IN_GAME'
                    ? t('common.inGame')
                    : t('common.offline')}
                </span>
              </div>
            </div>

            {/* Bio Section */}
            <div className="pt-2">
              {isEditingBio ? (
                <form onSubmit={saveBio} className="space-y-2">
                  <textarea
                    value={bioText}
                    onChange={(e) => setBioText(e.target.value)}
                    maxLength={160}
                    placeholder={t('profile.bioPlaceholder')}
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={isSavingBio}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
                    >
                      {isSavingBio ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Check className="w-3 h-3" />
                      )}
                      <span>{t('profile.saveBio')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingBio(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                    >
                      {t('profile.cancel')}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-start gap-2 group">
                  <p className="text-xs sm:text-sm text-slate-300 italic">
                    {user.bio ? `« ${user.bio} »` : 'Aucune bio pour le moment.'}
                  </p>
                  <button
                    type="button"
                    onClick={startEditBio}
                    className="p-1 text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
                    title={t('profile.editBio')}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Career Stats Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>{t('profile.careerStats')}</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* ELO Rating */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-950/20 border border-amber-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                {t('profile.rating')}
              </span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {stats.rating}
            </div>
          </div>

          {/* Level & XP */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-950/20 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                {t('profile.level')}
              </span>
              <Flame className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              Niv. {stats.level}
            </div>
            <div className="text-[11px] text-purple-300/80 mt-1">
              {stats.xp} {t('profile.xp')}
            </div>
          </div>

          {/* Win Rate */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-950/20 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                {t('profile.winRate')}
              </span>
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {winRate}%
            </div>
            <div className="text-[11px] text-cyan-300/80 mt-1">
              {stats.wins}V / {stats.losses}D / {stats.draws}N
            </div>
          </div>

          {/* Games Played */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 to-sky-950/20 border border-sky-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                {t('profile.gamesPlayed')}
              </span>
              <Swords className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {stats.gamesPlayed}
            </div>
          </div>

          {/* K / D Ratio */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              {t('profile.kdRatio')}
            </span>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {kdRatio}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {stats.kills} {t('profile.kills')} / {stats.deaths} {t('profile.deaths')}
            </div>
          </div>

          {/* Highest Score */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              {t('profile.highestScore')}
            </span>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {stats.highestScore} pts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
