# PLM (Product Lifecycle Management) SaaS Frontend

A modern, premium SaaS frontend for a Product Lifecycle Management system built with React, Vite, Tailwind CSS, and TypeScript.

## 🎨 Features

- **Modern SaaS Design**: Premium, clean UI with dark/light mode support
- **Smooth Animations**: Fluid transitions and interactive elements
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Role-Based Access Control**: Engineering, Approver, Operations, and Admin roles
- **Comprehensive Modules**: Products, BOMs, ECOs, Reports, and Settings

### Core Modules

#### 🔐 Authentication
- Login and Signup pages
- JWT token-based authentication
- Secure token storage in localStorage
- Auto-redirect for unauthorized access

#### 📊 Dashboard
- Summary statistics (Total Products, Active BOMs, Pending ECOs)
- Recent ECO activity timeline
- Quick action buttons

#### 📦 Products Management
- View product catalog with search and filtering
- Create new products with pricing and version control
- Product status management (Active/Archived)

#### 🧾 Bills of Materials (BOMs)
- BOM list with product associations
- Material and operation tracking
- Version management

#### 🔄 Engineering Change Orders (ECOs)
- Create and manage ECOs for products and BOMs
- Workflow progression (New → Approval → Done)
- Change tracking with side-by-side diff view
- Approval workflow with role-based permissions

#### 📈 Reports
- ECO history and change tracking
- Filterable by date, status, and type
- Summary statistics

#### ⚙️ Settings (Admin Only)
- ECO stage configuration
- Approval rules management
- User role and permission settings

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or npm 9+
- Git

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your API base URL:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Opens at: `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── layouts/            # Layout components (Sidebar, Navbar)
├── services/           # API service layer
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main app component with routing
├── main.tsx            # Entry point
└── index.css           # Global Tailwind styles

public/
├── vite.svg            # Vite logo
└── react.svg           # React logo
```

## 🔐 Authentication Flow

1. User navigates to `/login` or `/signup`
2. Credentials are sent to backend
3. JWT token and user info stored in localStorage
4. Token auto-attached to all requests via Axios interceptor
5. Expired tokens trigger redirect to login
6. Protected routes check authentication

### Demo Credentials
```
Email: demo@example.com
Password: password123
```

## 🎨 Design System

- **Primary Color**: Blue (#0ea5e9)
- **Dark Mode**: Full support with Tailwind CSS
- **Spacing**: Consistent 4px-based grid
- **Typography**: Inter font family

## 🔌 API Integration

Base URL: `http://localhost:8000/api`

All requests include JWT token:
```
Authorization: Bearer <token>
```

## 🌙 Dark Mode

Toggle with sun/moon icon in navbar. Preference saved to localStorage.

## 📦 Dependencies

- react: UI library
- react-router-dom: Routing
- axios: HTTP client
- tailwindcss: Styling
- lucide-react: Icons
- react-hot-toast: Notifications
- class-variance-authority: Component variants

## 🛠️ Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🤝 Development

- All components are functional with React hooks
- TypeScript for type safety
- Tailwind CSS for styling
- Axios for API calls

## 🐛 Troubleshooting

**Port already in use?**
```bash
npm run dev -- --port 3000
```

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 Documentation

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)

## 🔜 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced search and filtering
- [ ] Bulk import/export
- [ ] Audit logs
- [ ] Multi-language support
- [ ] PDF export

## 📝 License

Proprietary - All rights reserved


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
