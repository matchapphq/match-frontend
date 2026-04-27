import { X, History, Mail, MessageSquare, Smartphone, Calendar, Clock, Users, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ReminderHistoryEntry } from '../../../data/mockData';

interface HistoryModalProps {
  onClose: () => void;
  history: ReminderHistoryEntry[];
  matchs: any[];
}

export function HistoryModal({ onClose, history, matchs }: HistoryModalProps) {
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'whatsapp':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'email':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'sms':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'whatsapp':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full p-6 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Historique des rappels
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {history.length} rappel(s) envoyé(s)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <History className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                Aucun historique
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Vos rappels envoyés apparaîtront ici
              </p>
            </div>
          ) : (
            history.map((entry) => {
              const match = matchs?.find(m => m.id === entry.matchId);
              const sentDate = new Date(entry.sentAt);
              
              return (
                <div 
                  key={entry.id}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-4">
                    {/* Match Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] flex items-center justify-center text-2xl shadow-lg shadow-[#5a03cf]/20 flex-shrink-0">
                      {match ? match.sport : <Calendar className="w-6 h-6 text-white" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {entry.matchName}
                          </h4>
                          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDistanceToNow(sentDate, { addSuffix: true, locale: fr })}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5" />
                              {entry.recipientCount} destinataire(s)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getMethodColor(entry.method)}`}>
                            {getMethodIcon(entry.method)}
                            {entry.method.toUpperCase()}
                          </span>
                          {entry.status === 'success' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Envoyé
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Template & Message */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Template:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{entry.templateName}</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                            "{entry.message}"
                          </p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Envoyé par {entry.sentBy}</span>
                        <span>{sentDate.toLocaleString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
