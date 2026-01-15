# Styles - Match Platform

Ce dossier contient tous les fichiers CSS et la documentation relative aux styles de la plateforme Match.

---

## 📁 Fichiers

### `/styles/globals.css`
**Fichier CSS principal** contenant :
- Variables CSS (couleurs, tokens de design)
- Thème clair et dark mode
- Typographie de base (h1, h2, h3, p, label, button, input)
- **Styles de curseur pour tous les éléments interactifs** ✨
- Utilities Match (glass-card, gradient-border, text-gradient)

### `cursor-guide.md`
**Guide complet des curseurs** incluant :
- Liste de tous les curseurs appliqués automatiquement
- Classes utilitaires disponibles
- Bonnes pratiques d'accessibilité
- Exemples de code

---

## 🎨 Design System Match

### Couleurs principales
```css
--primary: #5a03cf;      /* Violet Match */
--secondary: #9cff02;    /* Vert Match */
```

### Règles d'or Match
1. **Peu de couleurs pleines**, beaucoup de transparence
2. **Dégradés subtils**
3. **Bordures dégradées** plutôt que fonds dégradés
4. **Liquid glass partout** (glassmorphism)
5. **Pas d'icônes décoratives** - Privilégier la lisibilité

---

## 🖱️ Curseurs interactifs

Tous les éléments cliquables ont automatiquement le bon curseur :
- ✅ Boutons → `cursor: pointer`
- ✅ Liens → `cursor: pointer`
- ✅ Éléments désactivés → `cursor: not-allowed`
- ✅ Champs texte → `cursor: text`
- ✅ États de chargement → `cursor: wait`

**Voir [cursor-guide.md](./cursor-guide.md) pour plus de détails**

---

## 🌙 Dark Mode

Le dark mode est géré via la classe `.dark` sur l'élément root :

```tsx
// Activer le dark mode
document.documentElement.classList.add('dark');

// Désactiver le dark mode
document.documentElement.classList.remove('dark');
```

---

## 📚 Ressources

- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Design tokens](https://www.figma.com/design-systems/)
- [Glassmorphism](https://hype4.academy/tools/glassmorphism-generator)

---

**Maintenu par :** Équipe Match  
**Dernière mise à jour :** 7 janvier 2026
