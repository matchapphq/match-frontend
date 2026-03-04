import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center rounded-full border border-gray-200/80 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition-colors hover:border-[#5a03cf]/20 hover:text-[#5a03cf] dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-[#9cff02]/20 dark:hover:text-[#9cff02]"
    >
      {label}
    </Link>
  );
}

export function PublicFooter() {
  return (
    <footer className="relative backdrop-blur-2xl bg-white/40 dark:bg-black/40 border-t border-[#5a03cf]/10 dark:border-white/10 py-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#5a03cf]/70 to-transparent dark:hidden" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex justify-center md:justify-start">
            <img
              src={logo}
              alt="Match"
              className="h-6 dark:brightness-150"
              style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(6297%) hue-rotate(268deg) brightness(83%) contrast(122%)' }}
            />
          </div>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © 2026 Match. Tous droits réservés.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
            <FooterLink to="/terms" label="CGU" />
            <FooterLink to="/terms-of-sale" label="CGV" />
            <FooterLink to="/privacy" label="Confidentialité" />
          </div>
        </div>
      </div>
    </footer>
  );
}
