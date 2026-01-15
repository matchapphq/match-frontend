import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'fr' | 'en';

// Translations object - MUST be declared before being used
const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.add': 'Ajouter',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.close': 'Fermer',
    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.or': 'ou',
    'common.and': 'et',
    'common.all': 'Tout',
    'common.none': 'Aucun',
    'common.select': 'Sélectionner',
    'common.optional': 'Optionnel',
    'common.required': 'Requis',
    'common.continue': 'Continuer',
    'common.finish': 'Terminer',
    'common.skip': 'Passer',
    'common.more': 'Plus',
    'common.less': 'Moins',
    'common.show': 'Afficher',
    'common.hide': 'Masquer',
    'common.download': 'Télécharger',
    'common.upload': 'Téléverser',
    'common.copy': 'Copier',
    'common.copied': 'Copié',
    'common.share': 'Partager',
    'common.send': 'Envoyer',
    'common.submit': 'Soumettre',
    'common.view': 'Voir',
    'common.details': 'Détails',
    'common.settings': 'Paramètres',
    'common.logout': 'Déconnexion',
    'common.login': 'Connexion',
    'common.register': 'Inscription',
    'common.email': 'Email',
    'common.password': 'Mot de passe',
    'common.name': 'Nom',
    'common.firstName': 'Prénom',
    'common.lastName': 'Nom de famille',
    'common.phone': 'Téléphone',
    'common.address': 'Adresse',
    'common.city': 'Ville',
    'common.postalCode': 'Code postal',
    'common.country': 'Pays',
    'common.date': 'Date',
    'common.time': 'Heure',
    'common.description': 'Description',
    'common.status': 'Statut',
    'common.active': 'Actif',
    'common.inactive': 'Inactif',
    'common.pending': 'En attente',
    'common.completed': 'Terminé',
    'common.cancelled': 'Annulé',
    'common.total': 'Total',
    'common.subtotal': 'Sous-total',
    'common.price': 'Prix',
    'common.quantity': 'Quantité',

    // App Presentation
    'app.mobileApp': 'Application mobile pour les fans de sport',
    'app.hero.title1': 'Vivez chaque match au',
    'app.hero.title2': 'meilleur endroit',
    'app.hero.subtitle': 'Découvrez les bars et restaurants qui diffusent vos matchs préférés, en temps réel',
    'app.installApp': "Installer l'application",
    'app.howItWorks': 'Comment ça marche',
    
    // Sports Section
    'app.sports.title1': 'Tous vos',
    'app.sports.title2': 'sports préférés',
    'app.sports.subtitle': 'Football, Basketball, Rugby, Tennis et bien plus...',
    'app.sports.football': 'Football',
    'app.sports.basketball': 'Basketball',
    'app.sports.rugby': 'Rugby',
    'app.sports.tennis': 'Tennis',
    'app.sports.volleyball': 'Volleyball',
    'app.sports.handball': 'Handball',
    
    // Features Section
    'app.features.title1': 'Pourquoi',
    'app.features.title2': 'Match ?',
    'app.features.subtitle': 'Tout ce dont vous avez besoin pour trouver le meilleur endroit pour vos matchs',
    'app.features.find.title': 'Trouvez votre match',
    'app.features.find.desc': 'Tous les bars qui diffusent votre match, au même endroit',
    'app.features.realtime.title': 'Infos en temps réel',
    'app.features.realtime.desc': 'Programmation à jour, places disponibles, ambiance live',
    'app.features.nearby.title': 'Autour de vous',
    'app.features.nearby.desc': 'Géolocalisation pour trouver les bars les plus proches',
    
    // How it Works
    'app.howItWorks.title1': 'Comment',
    'app.howItWorks.title2': 'ça marche ?',
    'app.howItWorks.step1.title': 'Téléchargez l\'application',
    'app.howItWorks.step1.desc': 'Disponible gratuitement sur iOS et Android',
    'app.howItWorks.step2.title': 'Choisissez votre match',
    'app.howItWorks.step2.desc': 'Parcourez les matchs du jour ou recherchez votre équipe préférée',
    'app.howItWorks.step3.title': 'Trouvez le meilleur lieu',
    'app.howItWorks.step3.desc': 'Découvrez les bars autour de vous et réservez votre place',
    
    // App Preview
    'app.preview.title1': 'L\'application',
    'app.preview.title2': 'Match',
    'app.preview.subtitle': 'Une expérience mobile intuitive pour ne jamais manquer un match',
    'app.preview.matches.title': 'Liste des matchs',
    'app.preview.matches.desc': 'Tous les matchs en cours et à venir',
    'app.preview.venue.title': 'Fiche lieu',
    'app.preview.venue.desc': 'Infos, photos, avis et réservation',
    'app.preview.map.title': 'Carte interactive',
    'app.preview.map.desc': 'Tous les bars sur une carte',
    
    // Benefits Section
    'app.benefits.title1': 'Pour',
    'app.benefits.title2': 'qui ?',
    'app.benefits.fans': 'Fans de sport passionnés',
    'app.benefits.friends': 'Groupes d\'amis',
    'app.benefits.events': 'Soirées match inoubliables',
    'app.benefits.discover': 'Découverte de nouveaux bars',
    
    // CTA Section
    'app.cta.title': 'Prêt à vivre les matchs autrement ?',
    'app.cta.subtitle': 'Rejoignez des milliers de fans qui utilisent Match pour trouver le meilleur endroit',
    'app.cta.button': 'Installer l\'application Match',
    
    // Footer
    'app.footer.rights': '© 2026 Match. Tous droits réservés.',
    'app.footer.terms': 'Conditions',
    'app.footer.privacy': 'Confidentialité',
    
    // Landing Page
    'landing.title': 'Match',
    'landing.subtitle': 'Gérez vos réservations matchs',
    'landing.description': 'La plateforme complète pour gérer les réservations de vos clients qui souhaitent regarder des événements sportifs dans votre établissement',
    'landing.getStarted': 'Commencer',
    'landing.seeDemo': 'Voir une démo',
    'landing.referral': 'Programme de parrainage',
    'landing.slogan': 'Transformez chaque match en opportunité',
    
    // Login
    'login.title': 'Connexion',
    'login.subtitle': 'Connectez-vous à votre compte',
    'login.email': 'Adresse email',
    'login.password': 'Mot de passe',
    'login.forgotPassword': 'Mot de passe oublié ?',
    'login.submit': 'Se connecter',
    'login.noAccount': 'Pas encore de compte ?',
    'login.createAccount': 'Créer un compte',
    'login.backToHome': 'Retour à l\'accueil',
    'login.error.invalidCredentials': 'Email ou mot de passe incorrect',
    'login.error.fillAllFields': 'Veuillez remplir tous les champs',
    
    // Register
    'register.title': 'Inscription',
    'register.subtitle': 'Créez votre compte restaurateur',
    'register.firstName': 'Prénom',
    'register.lastName': 'Nom',
    'register.email': 'Adresse email',
    'register.phone': 'Téléphone',
    'register.password': 'Mot de passe',
    'register.confirmPassword': 'Confirmer le mot de passe',
    'register.submit': 'Créer mon compte',
    'register.haveAccount': 'Déjà un compte ?',
    'register.signIn': 'Se connecter',
    'register.backToHome': 'Retour à l\'accueil',
    'register.error.fillAllFields': 'Veuillez remplir tous les champs',
    'register.error.passwordMismatch': 'Les mots de passe ne correspondent pas',
    'register.error.emailExists': 'Cet email est déjà utilisé',
  },
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.or': 'or',
    'common.and': 'and',
    'common.all': 'All',
    'common.none': 'None',
    'common.select': 'Select',
    'common.optional': 'Optional',
    'common.required': 'Required',
    'common.continue': 'Continue',
    'common.finish': 'Finish',
    'common.skip': 'Skip',
    'common.more': 'More',
    'common.less': 'Less',
    'common.show': 'Show',
    'common.hide': 'Hide',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.copy': 'Copy',
    'common.copied': 'Copied',
    'common.share': 'Share',
    'common.send': 'Send',
    'common.submit': 'Submit',
    'common.view': 'View',
    'common.details': 'Details',
    'common.settings': 'Settings',
    'common.logout': 'Logout',
    'common.login': 'Login',
    'common.register': 'Register',
    'common.email': 'Email',
    'common.password': 'Password',
    'common.name': 'Name',
    'common.firstName': 'First Name',
    'common.lastName': 'Last Name',
    'common.phone': 'Phone',
    'common.address': 'Address',
    'common.city': 'City',
    'common.postalCode': 'Postal Code',
    'common.country': 'Country',
    'common.date': 'Date',
    'common.time': 'Time',
    'common.description': 'Description',
    'common.status': 'Status',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.pending': 'Pending',
    'common.completed': 'Completed',
    'common.cancelled': 'Cancelled',
    'common.total': 'Total',
    'common.subtotal': 'Subtotal',
    'common.price': 'Price',
    'common.quantity': 'Quantity',

    // App Presentation
    'app.mobileApp': 'Mobile app for sports fans',
    'app.hero.title1': 'Watch every match at the',
    'app.hero.title2': 'best place',
    'app.hero.subtitle': 'Discover bars and restaurants broadcasting your favorite matches, in real-time',
    'app.installApp': 'Install the app',
    'app.howItWorks': 'How it works',
    
    // Sports Section
    'app.sports.title1': 'All your',
    'app.sports.title2': 'favorite sports',
    'app.sports.subtitle': 'Football, Basketball, Rugby, Tennis and much more...',
    'app.sports.football': 'Football',
    'app.sports.basketball': 'Basketball',
    'app.sports.rugby': 'Rugby',
    'app.sports.tennis': 'Tennis',
    'app.sports.volleyball': 'Volleyball',
    'app.sports.handball': 'Handball',
    
    // Features Section
    'app.features.title1': 'Why',
    'app.features.title2': 'Match?',
    'app.features.subtitle': 'Everything you need to find the best place for your matches',
    'app.features.find.title': 'Find your match',
    'app.features.find.desc': 'All bars broadcasting your match, in one place',
    'app.features.realtime.title': 'Real-time info',
    'app.features.realtime.desc': 'Updated schedule, available seats, live atmosphere',
    'app.features.nearby.title': 'Near you',
    'app.features.nearby.desc': 'Geolocation to find the closest bars',
    
    // How it Works
    'app.howItWorks.title1': 'How does',
    'app.howItWorks.title2': 'it work?',
    'app.howItWorks.step1.title': 'Download the app',
    'app.howItWorks.step1.desc': 'Available for free on iOS and Android',
    'app.howItWorks.step2.title': 'Choose your match',
    'app.howItWorks.step2.desc': 'Browse today\'s matches or search for your favorite team',
    'app.howItWorks.step3.title': 'Find the best venue',
    'app.howItWorks.step3.desc': 'Discover bars around you and book your spot',
    
    // App Preview
    'app.preview.title1': 'The',
    'app.preview.title2': 'Match app',
    'app.preview.subtitle': 'An intuitive mobile experience to never miss a match',
    'app.preview.matches.title': 'Match list',
    'app.preview.matches.desc': 'All ongoing and upcoming matches',
    'app.preview.venue.title': 'Venue page',
    'app.preview.venue.desc': 'Info, photos, reviews and booking',
    'app.preview.map.title': 'Interactive map',
    'app.preview.map.desc': 'All bars on a map',
    
    // Benefits Section
    'app.benefits.title1': 'For',
    'app.benefits.title2': 'whom?',
    'app.benefits.fans': 'Passionate sports fans',
    'app.benefits.friends': 'Groups of friends',
    'app.benefits.events': 'Unforgettable match nights',
    'app.benefits.discover': 'Discover new bars',
    
    // CTA Section
    'app.cta.title': 'Ready to experience matches differently?',
    'app.cta.subtitle': 'Join thousands of fans using Match to find the best place',
    'app.cta.button': 'Install the Match app',
    
    // Footer
    'app.footer.rights': '© 2026 Match. All rights reserved.',
    'app.footer.terms': 'Terms',
    'app.footer.privacy': 'Privacy',
    
    // Landing Page
    'landing.title': 'Match',
    'landing.subtitle': 'Manage your match reservations',
    'landing.description': 'The complete platform to manage bookings from your customers who want to watch sports events in your establishment',
    'landing.getStarted': 'Get Started',
    'landing.seeDemo': 'See a demo',
    'landing.referral': 'Referral program',
    'landing.slogan': 'Turn every match into an opportunity',
    
    // Login
    'login.title': 'Login',
    'login.subtitle': 'Sign in to your account',
    'login.email': 'Email address',
    'login.password': 'Password',
    'login.forgotPassword': 'Forgot password?',
    'login.submit': 'Sign in',
    'login.noAccount': 'Don\'t have an account?',
    'login.createAccount': 'Create account',
    'login.backToHome': 'Back to home',
    'login.error.invalidCredentials': 'Invalid email or password',
    'login.error.fillAllFields': 'Please fill in all fields',
    
    // Register
    'register.title': 'Sign Up',
    'register.subtitle': 'Create your restaurant owner account',
    'register.firstName': 'First Name',
    'register.lastName': 'Last Name',
    'register.email': 'Email address',
    'register.phone': 'Phone',
    'register.password': 'Password',
    'register.confirmPassword': 'Confirm Password',
    'register.submit': 'Create my account',
    'register.haveAccount': 'Already have an account?',
    'register.signIn': 'Sign in',
    'register.backToHome': 'Back to home',
    'register.error.fillAllFields': 'Please fill in all fields',
    'register.error.passwordMismatch': 'Passwords do not match',
    'register.error.emailExists': 'This email is already in use',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('match-language');
    return (saved === 'en' || saved === 'fr') ? saved : 'fr';
  });

  useEffect(() => {
    localStorage.setItem('match-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const translation = translations[language]?.[key];
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}