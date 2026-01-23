import { useState } from 'react';
import { X, FileText, Plus, Edit, Trash2, Save, Globe } from 'lucide-react';
import type { ReminderTemplate } from '../../../data/mockData';
import { toast } from 'sonner';

interface TemplatesModalProps {
  onClose: () => void;
  templates: ReminderTemplate[];
  restaurants: any[];
  onAddTemplate: (template: ReminderTemplate) => void;
  onUpdateTemplate: (id: number, template: Partial<ReminderTemplate>) => void;
  onDeleteTemplate: (id: number) => void;
}

export function TemplatesModal({ 
  onClose, 
  templates, 
  restaurants,
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate
}: TemplatesModalProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    restaurantId: 'all' as number | 'all'
  });

  const handleSave = (templateId?: number) => {
    if (!formData.name || !formData.message) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (templateId) {
      // Update existing template
      onUpdateTemplate(templateId, {
        name: formData.name,
        message: formData.message,
        restaurantId: formData.restaurantId,
      });
      toast.success('Template mis à jour avec succès');
      setEditingId(null);
    } else {
      // Create new template
      const newTemplate: ReminderTemplate = {
        id: Date.now(),
        name: formData.name,
        message: formData.message,
        restaurantId: formData.restaurantId,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      onAddTemplate(newTemplate);
      toast.success('Template créé avec succès');
      setShowNewForm(false);
    }

    setFormData({ name: '', message: '', restaurantId: 'all' });
  };

  const handleEdit = (template: ReminderTemplate) => {
    setEditingId(template.id);
    setFormData({
      name: template.name,
      message: template.message,
      restaurantId: template.restaurantId
    });
  };

  const handleDelete = (id: number, isDefault: boolean) => {
    if (isDefault) {
      toast.error('Les templates par défaut ne peuvent pas être supprimés');
      return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      onDeleteTemplate(id);
      toast.success('Template supprimé');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowNewForm(false);
    setFormData({ name: '', message: '', restaurantId: 'all' });
  };

  const getRestaurantName = (restaurantId: number | 'all') => {
    if (restaurantId === 'all') return 'Tous les restaurants';
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant?.nom || 'Restaurant inconnu';
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
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Gérer les templates
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {templates.length} template(s) disponible(s)
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

        {/* Add New Template Button */}
        {!showNewForm && !editingId && (
          <button
            onClick={() => setShowNewForm(true)}
            className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] hover:from-[#6a13df] hover:to-[#8a33ff] text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Créer un nouveau template
          </button>
        )}

        {/* New Template Form */}
        {showNewForm && (
          <div className="mb-6 p-5 bg-gradient-to-r from-[#5a03cf]/5 to-[#9cff02]/5 rounded-xl border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Nouveau template</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom du template
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Rappel match important"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a03cf]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Restaurant
                </label>
                <select
                  value={formData.restaurantId}
                  onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value === 'all' ? 'all' : Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a03cf]"
                >
                  <option value="all">Tous les restaurants</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Variables disponibles: {prenom}, {personnes}, {match}, {date}, {heure}"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a03cf] resize-none h-32"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  💡 Utilisez les variables pour personnaliser: {'{prenom}'}, {'{personnes}'}, {'{match}'}, {'{date}'}, {'{heure}'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleSave()}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] hover:from-[#6a13df] hover:to-[#8a33ff] text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Templates List */}
        <div className="space-y-3">
          {templates.map((template) => {
            const isEditing = editingId === template.id;
            
            return (
              <div 
                key={template.id}
                className={`bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border ${
                  template.isDefault 
                    ? 'border-blue-200 dark:border-blue-800' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {isEditing ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom du template
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a03cf]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Restaurant
                      </label>
                      <select
                        value={formData.restaurantId}
                        onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value === 'all' ? 'all' : Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a03cf]"
                      >
                        <option value="all">Tous les restaurants</option>
                        {restaurants.map((restaurant) => (
                          <option key={restaurant.id} value={restaurant.id}>
                            {restaurant.nom}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a03cf] resize-none h-32"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSave(template.id)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] hover:from-[#6a13df] hover:to-[#8a33ff] text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Enregistrer
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Template
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {template.name}
                          </h4>
                          {template.isDefault && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium">
                              <Globe className="w-3 h-3" />
                              Par défaut
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {getRestaurantName(template.restaurantId)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(template)}
                          className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg text-gray-500 hover:text-[#5a03cf] transition-all"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {!template.isDefault && (
                          <button
                            onClick={() => handleDelete(template.id, template.isDefault)}
                            className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg text-gray-500 hover:text-red-500 transition-all"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        "{template.message}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
