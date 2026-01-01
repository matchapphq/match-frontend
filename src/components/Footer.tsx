export function Footer() {
  return (
    <footer className="px-6 md:px-8 py-12 border-t border-gray-300/60 bg-white/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <p className="text-gray-700 mb-4" style={{ fontWeight: '600' }}>
            Copyright © 2025 Match SAS • Tous droits réservés.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-[#5a03cf] transition-colors">Engagement de confidentialité</a>
            <span className="hidden md:inline text-gray-400">•</span>
            <a href="#" className="hover:text-[#5a03cf] transition-colors">Utilisation des cookies</a>
            <span className="hidden md:inline text-gray-400">•</span>
            <a href="#" className="hover:text-[#5a03cf] transition-colors">Conditions d'utilisation</a>
            <span className="hidden md:inline text-gray-400">•</span>
            <a href="#" className="hover:text-[#5a03cf] transition-colors">Ventes et remboursements</a>
            <span className="hidden md:inline text-gray-400">•</span>
            <a href="#" className="hover:text-[#5a03cf] transition-colors">Mentions légales</a>
            <span className="hidden md:inline text-gray-400">•</span>
            <a href="#" className="hover:text-[#5a03cf] transition-colors">Plan du site</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
