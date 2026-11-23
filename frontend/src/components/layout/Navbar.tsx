import { useState } from 'react';
import type { FC, ReactNode } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Gamepad2,
  Trophy,
  MessageSquare,
  User,
  LogIn,
  UserPlus,
  Menu,
  X,
  Swords,
} from 'lucide-react';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import type { NavItem } from '../../types/navigation';

export const Navbar: FC = () => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: (NavItem & { icon: ReactNode })[] = [
    {
      key: 'play',
      labelKey: 'nav.play',
      path: '/play',
      icon: <Swords className="w-4 h-4 me-1.5" aria-hidden="true" />,
    },
    {
      key: 'leaderboard',
      labelKey: 'nav.leaderboard',
      path: '/leaderboard',
      icon: <Trophy className="w-4 h-4 me-1.5" aria-hidden="true" />,
    },
    {
      key: 'chat',
      labelKey: 'nav.chat',
      path: '/chat',
      icon: <MessageSquare className="w-4 h-4 me-1.5" aria-hidden="true" />,
    },
    {
      key: 'profile',
      labelKey: 'nav.profile',
      path: '/profile',
      icon: <User className="w-4 h-4 me-1.5" aria-hidden="true" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div className="text-start">
              <span className="block font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
                {t('nav.brand')}
              </span>
              <span className="block text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                {t('nav.brandSub')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`
              }
            >
              {t('nav.home')}
            </NavLink>
            {navLinks.map((link) => (
              <NavLink
                key={link.key}
                to={link.path}
                className={({ isActive }) =>
                  `inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`
                }
              >
                {link.icon}
                <span>{t(link.labelKey)}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Actions: LanguageSwitcher + Auth */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />

            <div className="h-5 w-px bg-slate-800" aria-hidden="true" />

            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
              <span>{t('nav.login')}</span>
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 rounded-lg shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" aria-hidden="true" />
              <span>{t('nav.register')}</span>
            </Link>
          </div>

          {/* Mobile Right Bar: LanguageSwitcher + Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={t('nav.toggleMenu')}
              aria-expanded={mobileMenuOpen}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                isActive
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`
            }
          >
            {t('nav.home')}
          </NavLink>
          {navLinks.map((link) => (
            <NavLink
              key={link.key}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`
              }
            >
              {link.icon}
              <span>{t(link.labelKey)}</span>
            </NavLink>
          ))}

          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-base font-medium text-slate-300 hover:text-white bg-slate-900 rounded-lg"
            >
              <LogIn className="w-5 h-5" aria-hidden="true" />
              <span>{t('nav.login')}</span>
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-base font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-lg shadow-md shadow-cyan-500/20"
            >
              <UserPlus className="w-5 h-5" aria-hidden="true" />
              <span>{t('nav.register')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
