export function Footer() {
  return (
    <footer className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 px-6 py-4 mt-auto">
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <p>© 2025 Match. Tous droits réservés.</p>
        <div className="flex items-center gap-4">
          <a href="/terms" className="hover:text-[#5a03cf] transition-colors">
            Conditions
          </a>
          <a href="#" className="hover:text-[#5a03cf] transition-colors">
            Confidentialité
          </a>
          <a href="#" className="hover:text-[#5a03cf] transition-colors">
            Aide
          </a>
        </div>
      </div>
    </footer>
  );
}
