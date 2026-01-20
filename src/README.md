# 🎯 Match Platform

Plateforme web permettant aux restaurateurs de gérer les réservations pour regarder des événements sportifs dans leurs établissements.

---

## 📚 Documentation

### **Documentation Principale**

- **[📖 Documentation API](/doc/README_API.md)** - Documentation complète des APIs
- **[🚀 Quick Start](/doc/QUICK_START.md)** - Guide de démarrage rapide
- **[🏗️ Architecture API](/doc/API_IMPLEMENTATION_SUMMARY.md)** - Vue d'ensemble de l'implémentation API
- **[📁 Index Documentation](/doc/INDEX.md)** - Index de toute la documentation

### **Guides Techniques**

- **[📖 Guidelines](./guidelines/Guidelines.md)** - Conventions de code TypeScript/React strict
- **[🎨 Attributions](./Attributions.md)** - Licences et crédits
- **[🔌 API Documentation](./API_DOCUMENTATION.md)** - Point d'entrée vers la documentation API

---

## 🚀 Quick Start

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

---

## 🎨 Design System Match

**Couleurs officielles :**
- Vert : `#9cff02`
- Violet : `#5a03cf`

**Règles d'or :**
- ✅ Peu de couleurs pleines, beaucoup de transparence
- ✅ Dégradés subtils
- ✅ Bordures dégradées plutôt que fonds dégradés
- ✅ Liquid glass partout (backdrop-blur-xl)
- ✅ Suppression icônes décoratives
- ✅ Priorité à la lisibilité

---

## 🏗️ Structure

```
/
├── components/              # Composants React (legacy)
├── src/                     # Nouvelle architecture
│   ├── features/            # Features par domaine
│   ├── components/          # Composants communs
│   ├── types/               # Types TypeScript
│   ├── utils/               # Utilitaires
│   └── constants/           # Constantes
├── context/                 # Contextes React
├── data/                    # Mock data
├── styles/                  # CSS global
└── guidelines/              # Documentation
```

---

## 🔧 Stack Technique

- **Frontend :** React 18 + TypeScript
- **Build :** Vite
- **Styling :** Tailwind CSS v4
- **State :** Context API
- **UI :** shadcn/ui (personnalisé)
- **Icons :** Lucide React
- **Charts :** Recharts
- **QR :** qr-scanner

---

## ✨ Features

### **Gestion Restaurants**
- CRUD complet
- Multi-établissements (1 abonnement = 1 établissement)
- Booking mode (INSTANT / REQUEST)
- Photos, horaires, capacité

### **Gestion Matchs**
- Programmation depuis catalogue API
- Filtres par sport
- Gestion capacité
- Stats détaillées

### **Réservations**
- Confirmation automatique (INSTANT)
- Approbation manuelle (REQUEST)
- QR codes validation
- Notifications multi-canal

### **Parrainage**
- Code unique par utilisateur
- Récompenses (boosts)
- Stats conversions
- Partage multi-canal

### **Boosts**
- 3 types de boosts
- Achat par pack
- Application sur matchs
- Analytics

### **Onboarding**
- Flow complet 5 étapes
- Paiement Stripe
- Facturation (30€/mois ou 300€/an)

---

## 📱 Multi-langue

- 🇫🇷 Français (défaut)
- 🇬🇧 Anglais

---

## 🎯 Tarification

- **Abonnement mensuel :** 30€/mois
- **Abonnement annuel :** 300€/an (2 mois gratuits)
- **Règle :** 1 établissement = 1 abonnement distinct

---

## 🔐 Authentification

- Login / Register
- Session persistante
- Onboarding obligatoire
- Multi-rôles (venue owner / user)

---

## 📊 Status Projet

| Module | Frontend | Backend | Status |
|--------|----------|---------|--------|
| **Restaurants** | ✅ 100% | ⚠️ 60% | Prêt UI |
| **Matchs** | ✅ 100% | ⚠️ 60% | Prêt UI |
| **Réservations** | ✅ 100% | ⚠️ 40% | Prêt UI |
| **Parrainage** | ✅ 100% | ❌ 0% | Prêt UI |
| **Boosts** | ✅ 100% | ❌ 20% | Prêt UI |
| **Dashboard** | ✅ 100% | ⚠️ 50% | Prêt UI |
| **Onboarding** | ✅ 100% | ⚠️ 70% | Prêt UI |
| **Notifications** | ✅ 100% | ❌ 0% | Bloquant |

**Global : Frontend 95% ✅ | Backend 40% ⚠️**

---

## 🚦 Prochaines Étapes

### **Court Terme (Beta Privée)**
- ✅ Frontend complet
- ⏳ Deploy infrastructure
- ⏳ Emails basiques
- ⏳ CGU/Privacy Policy
- ⏳ 5-10 restaurants beta

### **Moyen Terme (API Backend)**
- ⏳ ~85 endpoints manquants
- ⏳ Système notifications complet
- ⏳ Tests E2E
- ⏳ Monitoring

### **Long Terme (Launch Public)**
- ⏳ Legal complet (RGPD)
- ⏳ Marketing pages
- ⏳ Support client
- ⏳ Scale infrastructure

---

## 📞 Contact

Pour toute question sur l'architecture ou la documentation, consulter :
- [📁 Documentation complète](/doc/INDEX.md)
- [🏗️ Architecture API](/doc/API_IMPLEMENTATION_SUMMARY.md)

---

**Match - Regarder le sport, vivre l'ambiance.** 🍻⚽