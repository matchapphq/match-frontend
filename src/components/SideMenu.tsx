import { Plus, Star, List, HelpCircle } from 'lucide-react';
import { PageType } from '../App';
import { useState } from 'react';

const menuItems = [
  {
    id: 'programmer-match' as PageType,
    label: 'Programmer un match',
    icon: Plus,
    color: 'bg-gradient-to-br from-[#5a03cf]/80 to-[#7a23ef]/80'
  },
  {
    id: 'mes-avis' as PageType,
    label: 'Voir mes avis',
    icon: Star,
    color: 'bg-gradient-to-br from-[#9cff02]/80 to-[#7cdf00]/80'
  },
  {
    id: 'mes-matchs' as PageType,
    label: 'Voir la liste de mes matchs',
    icon: List,
    color: 'bg-gradient-to-br from-[#5a03cf]/80 to-[#7a23ef]/80'
  }
];

interface SideMenuProps {
  onNavigate: (page: PageType) => void;
}

export function SideMenu({ onNavigate }: SideMenuProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleClick = (id: PageType) => {
    onNavigate(id);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Message envoyé ! Nous vous répondrons à ${email}`);
    setEmail('');
    setMessage('');
    setShowContactForm(false);
  };

  return (
    <div className="sticky top-24">
      <div className="backdrop-blur-xl bg-white/40 border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="mb-6">
          <h2 className="text-gray-900 mb-1" style={{ fontWeight: '700' }}>Actions</h2>
          <p className="text-gray-600 text-sm">Gérez votre établissement</p>
        </div>

        <div className="flex flex-col gap-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isGreen = item.color.includes('9cff02');
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`${item.color} backdrop-blur-md ${
                  isGreen ? 'text-[#5a03cf]' : 'text-white'
                } p-5 rounded-2xl transition-all hover:scale-105 hover:shadow-lg flex items-center gap-3 text-left border border-white/40`}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                <span className="text-base">{item.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowContactForm(!showContactForm)}
          className="w-full mt-6 p-4 backdrop-blur-xl bg-gradient-to-br from-[#5a03cf]/20 to-[#9cff02]/20 hover:from-[#5a03cf]/30 hover:to-[#9cff02]/30 rounded-2xl border-2 border-[#5a03cf]/30 hover:border-[#9cff02]/50 transition-all flex items-center gap-3 text-left"
        >
          <HelpCircle className="w-5 h-5 text-[#5a03cf]" />
          <div>
            <p className="text-gray-900" style={{ fontWeight: '600' }}>
              Besoin d&apos;aide ?
            </p>
            <p className="text-gray-600 text-sm">Contactez notre support</p>
          </div>
        </button>

        {showContactForm && (
          <form onSubmit={handleContactSubmit} className="mt-4 p-4 bg-white rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-gray-900 mb-3" style={{ fontWeight: '600' }}>Contactez-nous</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              required
              className="w-full px-3 py-2 mb-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent text-sm"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message"
              required
              rows={3}
              className="w-full px-3 py-2 mb-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent text-sm"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-2 rounded-xl hover:shadow-lg transition-all text-sm"
              style={{ fontWeight: '600' }}
            >
              Envoyer
            </button>
          </form>
        )}
      </div>
    </div>
  );
}