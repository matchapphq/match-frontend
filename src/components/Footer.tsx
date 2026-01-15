export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            © 2026 Match. Tous droits réservés.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-[#5a03cf] transition-colors">
              Confidentialité
            </a>
            <span>•</span>
            <a href="#" className="hover:text-[#5a03cf] transition-colors">
              Conditions
            </a>
            <span>•</span>
            <a href="#" className="hover:text-[#5a03cf] transition-colors">
              Mentions légales
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
