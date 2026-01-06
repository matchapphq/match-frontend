    import { ArrowLeft, Construction } from 'lucide-react';
    import { PageType } from '../../App';

    type Props = {
    title: string;
    onNavigate: (page: PageType) => void;
    onBack: () => void;
    };

    export function LegalPlaceholderPage({ title, onNavigate, onBack }: Props) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10">
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-10">
            {/* Bouton retour */}
            <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-[#5a03cf] transition-colors mb-6 mt-3 cursor-pointer"
            style={{ fontWeight: 600 }}
            >
            <ArrowLeft className="w-4 h-4" />
            Retour
            </button>

            {/* Carte glass avec bordure gradient */}
            <div className="relative p-[2px] rounded-3xl bg-gradient-to-r from-[#9cff02] to-[#5a03cf] shadow-2xl">
            <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-black/10">
                <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9cff02] to-[#5a03cf] flex items-center justify-center flex-shrink-0">
                    <Construction className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl italic text-gray-900 mb-2" style={{ fontWeight: 800 }}>
                    {title}
                    </h1>

                    <p className="text-gray-700 text-lg leading-relaxed" style={{ fontWeight: 600 }}>
                    Page en création / écriture en cours.
                    </p>
                    <p className="text-gray-600 mt-2">
                    Merci de revenir prochainement 🙂
                    </p>

                    <div className="mt-6 inline-flex items-center gap-2 text-sm text-gray-600 bg-white/60 border border-black/10 rounded-full px-4 py-2">
                    <span className="w-2 h-2 rounded-full bg-[#9cff02]"></span>
                    Mise à jour bientôt
                    </div>
                </div>
                </div>
            </div>
            </div>

            {/* Petit spacing */}
            <div className="h-10" />
        </div>
        </div>
    );
    }
