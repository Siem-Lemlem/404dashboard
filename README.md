# Dashboard

> A developer's personal resource management system that actually works.

---

## The Problem

As developers, we constantly discover useful tools, documentation sites, APIs, and resources. But finding them again when we need them? That's the 404 error we all know too well.

- Browser bookmarks are a mess  
- Google searches waste time sifting through ads and SEO spam  
- Switching machines means losing everything

---

## The Solution

**404Dashboard** is a curated, searchable collection of your development resources - accessible form anywhere, synced across devices, and designed specifically for developer workflows.

---

## Current Features (MVP)

- **Authentication** - Google OAuth & Email/Password via Firebase  
- **Real-time Sync** - Your resources instantly available across all devices  
- **Smart Search** - Filter by name, description, tags, or category  
- **Organized Categories** - Documentation, Tools, UI/UX, Backend, Frontend, Community, Learning, APIs  
- **Full CRUD** - Create, Read, Update, Delete resources with ease  
- **Secure** - Your data is private, protected by Firestore security rules  
- **Modern UI** - Glassmorphic design that doesn't get in your way  

---

## Tech stack

- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Firebase (Auth, Firestore)
- **Icons:** Lucide React
- **Hosting:** Firebase Hosting *(coming soon)*

---

## Getting Started

### Prerequisites

- Node.js 18+  
- Firebase account  
- npm or yarn  

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Siem-Lemlem/404dashboard.git 
cd 404dashboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Firebase**

- Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
- Enable Authentication (Google & Email/Password)
- Create a Firestore database
- Copy your Firebase config

4. **Create ```bash .env.local``` file in root directory**

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. **Set up Firestore Security Rules**

```bash
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /resources/{resourceId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

6. **Run the development server**

```bash
npm run dev
```

7. **Visit the app**

[404Dashboard](http://localhost:5173)

## Project Structure

<!-- WRLDTREE START -->
```text
. (root/)
├── LICENSE
├── README.md
├── eslint.config.ts
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
│   ├── Screenshot_1.png
│   ├── Screenshot_2.png
│   ├── Screenshot_3.png
│   └── Screenshot_4.png
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── assets/
│   ├── components/
│   │   ├── AddToCollectionModal.tsx
│   │   ├── BulkActionBar.tsx
│   │   ├── CollectionModal.tsx
│   │   ├── CollectionsPanel.tsx
│   │   ├── Dashboard.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ResourceCard.tsx
│   │   ├── ResourceModal.tsx
│   │   ├── SearchBar.tsx
│   │   ├── StatsWidget.tsx
│   │   └── WelcomeModal.tsx
│   ├── firebase.ts
│   ├── firebaseConfig.ts
│   ├── hooks/
│   │   ├── ColorBends.tsx
│   │   ├── FadeContent.tsx
│   │   ├── GradientText.tsx
│   │   ├── LightRays.tsx
│   │   ├── Logo.tsx
│   │   ├── ShinyText.tsx
│   │   ├── UseInView.ts
│   │   └── useKeyboardShortcuts.ts
│   ├── index.css
│   ├── main.tsx
│   ├── pages/
│   │   ├── AuthPage.tsx
│   │   ├── LandingPage.tsx
│   │   └── landing/
│   │       ├── CTA.tsx
│   │       ├── Features.tsx
│   │       ├── Footer.tsx
│   │       ├── Hero.tsx
│   │       ├── NavBar.tsx
│   │       └── Why.tsx
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       ├── exportImport.ts
│       └── fetchMetadata.ts
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.js
```
<!-- WRLDTREE END -->

## Contributing

This is currently a personal project, but contributions are welcome once we reach beta. If you have ideas or find bugs, feel free to open an issue.

## Future Vision

The goal is to make 404Dashboard the default way developers manage their toolkit - think of it as "bookmarks designed by developers, for developers."

## Contact

Built by Siem Lemlem - siemlemlem50@gmail.com

## Status: Active Development|Version:0.1.0(MVP)

## License

404Dashboard is open-source software licensed under the  
**GNU Affero General Public License v3.0 (AGPL-3.0)**.

See the [LICENSE](./LICENSE) file for details.
