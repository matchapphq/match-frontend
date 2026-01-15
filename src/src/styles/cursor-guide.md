# Guide des curseurs - Match Platform

## 📌 Vue d'ensemble

Tous les éléments cliquables et interactifs du site Match ont maintenant des curseurs appropriés pour améliorer l'UX. Les styles sont appliqués automatiquement via `/styles/globals.css`.

---

## ✅ Curseurs appliqués automatiquement

### 🖱️ Curseur `pointer` (main)

**Appliqué automatiquement à :**
- Tous les `<button>`
- Tous les `<a>`
- Tous les `<select>`
- Labels avec attribut `for`
- Éléments avec `[role="button"]`
- Éléments avec `[type="button"]`, `[type="submit"]`, `[type="reset"]`
- Éléments avec `[tabindex]` (sauf `-1`)
- Checkboxes et radios
- Éléments avec `[onclick]`
- Éléments avec classes `.clickable-card`, `.clickable-container`
- Cards Match : `.match-card`, `.restaurant-card`, `.reservation-card`, `.stat-card`
- Navigation : `.nav-item`, `.sidebar-item`, `.menu-link`
- Menus : `[role="menuitem"]`, `[role="option"]`, `[role="tab"]`

**Exemple :**
```tsx
// Ces éléments auront automatiquement cursor: pointer
<button>Cliquez-moi</button>
<a href="/dashboard">Dashboard</a>
<div role="button">Action</div>
<label htmlFor="email">Email</label>
<div className="match-card">Card</div>
```

---

### 🚫 Curseur `not-allowed`

**Appliqué automatiquement à :**
- Tous les éléments avec `:disabled`
- Éléments avec `[aria-disabled="true"]`
- Éléments avec classe `.disabled`

**Exemple :**
```tsx
<button disabled>Désactivé</button>
<button aria-disabled="true">Désactivé</button>
<div className="disabled">Désactivé</div>
```

**Note :** Ces éléments ont aussi automatiquement `opacity: 0.5`

---

### ⏳ Curseur `wait` (sablier)

**Appliqué automatiquement à :**
- Éléments avec `[aria-busy="true"]`
- Éléments avec classe `.loading`

**Exemple :**
```tsx
<button aria-busy="true">Chargement...</button>
<div className="loading">En cours...</div>
```

---

### 📝 Curseur `text` (I-beam)

**Appliqué automatiquement à :**
- Tous les `<input type="text">`, `type="email"`, `type="password"`, etc.
- Tous les `<textarea>`
- Éléments avec `[contenteditable="true"]`

**Exemple :**
```tsx
<input type="text" placeholder="Votre nom" />
<textarea placeholder="Votre message" />
```

---

### ✊ Curseur `grab` / `grabbing`

**Appliqué automatiquement à :**
- Éléments avec `[draggable="true"]`
- Au survol : `grab`
- Au clic : `grabbing`

**Exemple :**
```tsx
<div draggable="true">Glissez-moi</div>
```

---

## 🎨 Classes utilitaires disponibles

Si vous avez besoin de forcer un curseur spécifique, utilisez ces classes :

### Curseurs de base
```css
.cursor-pointer      /* Main pointée */
.cursor-default      /* Flèche normale */
.cursor-not-allowed  /* Interdit */
.cursor-wait         /* Sablier */
.cursor-text         /* I-beam (texte) */
```

### Curseurs de mouvement
```css
.cursor-grab         /* Main ouverte */
.cursor-grabbing     /* Main fermée */
.cursor-move         /* Croix de déplacement */
```

### Curseurs spéciaux
```css
.cursor-help         /* Point d'interrogation */
.cursor-zoom-in      /* Loupe + */
.cursor-zoom-out     /* Loupe - */
```

**Exemple d'utilisation :**
```tsx
<div className="cursor-help">Aide disponible</div>
<div className="cursor-zoom-in">Cliquez pour zoomer</div>
```

---

## 🎯 Classes spécifiques Match

Pour les composants Match, ces classes sont disponibles :

```css
.clickable-card       /* Cartes cliquables génériques */
.clickable-container  /* Conteneurs cliquables */
.match-card          /* Cartes de matchs */
.restaurant-card     /* Cartes de restaurants */
.reservation-card    /* Cartes de réservations */
.stat-card          /* Cartes de statistiques */
.icon-button        /* Boutons icônes */
.qr-scanner-btn     /* Bouton scanner QR */
.scan-button        /* Bouton de scan */
.menu-item          /* Items de menu */
.nav-item           /* Items de navigation */
.sidebar-item       /* Items de sidebar */
.menu-link          /* Liens de menu */
```

**Toutes ces classes ont `cursor: pointer` et `transition: all 0.2s ease`**

**Exemple :**
```tsx
<div className="restaurant-card">
  <h3>Mon Restaurant</h3>
  <p>Description...</p>
</div>
```

---

## 💡 Bonnes pratiques

### ✅ À FAIRE

1. **Utiliser les attributs HTML sémantiques**
   ```tsx
   <button type="button">Action</button>
   <a href="/page">Lien</a>
   ```

2. **Utiliser les roles ARIA appropriés**
   ```tsx
   <div role="button" tabIndex={0}>Custom Button</div>
   ```

3. **Marquer les éléments désactivés correctement**
   ```tsx
   <button disabled>Désactivé</button>
   <button aria-disabled="true">Désactivé (ARIA)</button>
   ```

4. **Indiquer les états de chargement**
   ```tsx
   <button aria-busy={isLoading}>
     {isLoading ? 'Chargement...' : 'Enregistrer'}
   </button>
   ```

### ❌ À ÉVITER

1. **Ne pas utiliser `onClick` sur des `<div>` sans `role="button"`**
   ```tsx
   // ❌ Mauvais
   <div onClick={handleClick}>Cliquez</div>
   
   // ✅ Bon
   <button onClick={handleClick}>Cliquez</button>
   // OU
   <div role="button" tabIndex={0} onClick={handleClick}>Cliquez</div>
   ```

2. **Ne pas oublier l'accessibilité clavier**
   ```tsx
   // ✅ Bon
   <div 
     role="button" 
     tabIndex={0}
     onClick={handleClick}
     onKeyDown={(e) => e.key === 'Enter' && handleClick()}
   >
     Action
   </div>
   ```

3. **Ne pas mettre `cursor: pointer` sur des éléments non-interactifs**
   ```tsx
   // ❌ Mauvais
   <p className="cursor-pointer">Texte simple</p>
   
   // ✅ Bon (seulement si cliquable)
   <p onClick={handleClick} role="button" tabIndex={0}>Texte cliquable</p>
   ```

---

## 🧪 Test de compatibilité

Ces styles de curseur sont compatibles avec :
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Tous les navigateurs modernes

---

## 📚 Ressources

- [MDN - cursor property](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)
- [ARIA roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
- [Tailwind CSS Cursor](https://tailwindcss.com/docs/cursor)

---

**Date de création :** 7 janvier 2026  
**Version :** 1.0  
**Maintenu par :** Équipe Match
