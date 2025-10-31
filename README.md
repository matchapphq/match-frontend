# Venue Owner Dashboard

A React + Vite web dashboard for venue owners to manage sports broadcasts, screens, seating availability, and track visitor engagement in real-time.

## Features

- **Authentication**: Secure login for venue owners
- **Dashboard Overview**: Real-time statistics and quick access to key metrics
- **Screen Management**: Add, edit, and delete screens with location tracking
- **Broadcast Assignment**: Assign live matches and events to specific screens
- **Availability Management**: Track and update seat and table availability
- **Engagement Analytics**: Real-time visitor metrics and watch time analytics

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/        # Reusable components
│   └── ProtectedRoute.tsx
├── contexts/          # React context for state management
│   └── AppContext.tsx
├── pages/             # Page components
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Overview.tsx
│   ├── Screens.tsx
│   ├── Broadcasts.tsx
│   ├── Availability.tsx
│   └── Engagement.tsx
├── styles/            # CSS stylesheets
├── types/             # TypeScript type definitions
└── App.tsx            # Main app component with routing
```

## Features in Detail

### Login Page
Venue owners can log in with their credentials (demo mode accepts any email/password).

### Dashboard
- **Overview**: Display active screens, live broadcasts, available seats, and total visitors
- **Screens**: Manage venue screens (add/edit/delete), view current broadcasts
- **Broadcasts**: Assign sports matches/events to specific screens
- **Availability**: Update seat and table availability in real-time
- **Engagement**: View live visitor metrics and engagement analytics

## Technologies Used

- **React 19**: UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **CSS3**: Styling with modern features

## Development

The app uses React Context API for state management. All data is stored in memory for demonstration purposes.

To add new features:
1. Create new components in `src/components/` or `src/pages/`
2. Add routes in `src/App.tsx`
3. Update context in `src/contexts/AppContext.tsx` for global state
4. Add styling in `src/styles/`

---

## Original Vite Template Information

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
