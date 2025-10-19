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

## Roadmap

### Phase 1: Core Polish *(In Progress)*

- [ ] Onboarding flow with sample data  
- [ ] Toast notifications  
- [ ] Better error handling  
- [ ] Sorting (by name, date, category)  
- [ ] Keyboard shortcuts (Cmd/Ctrl + K)  
- [ ] Export/Import (JSON, CSV)  
- [ ] Usage statistics dashboard  

### Phase 2: Power User Features

- [ ] Bulk operations  
- [ ] Advanced filters  
- [ ] Auto-fetch metadata (page titles, descriptions)  
- [ ] Folders/collections  
- [ ] Favorites and pinning  
- [ ] Recently accessed tracking  

### Phase 3: Chrome Extension

- [ ] Right-click context menu "Save to 404Dashboard"  
- [ ] Quick access popup  
- [ ] Omnibox search integration  
- [ ] Auto-categorization  
- [ ] Full sync with web app  

### Phase 4: Community Features

- [ ] Community resource hub  
- [ ] Resource submission system  
- [ ] VirusTotal API integration  
- [ ] Public sharing profiles  
- [ ] Upvoting system  

### Phase 5: Launch

- [ ] Landing page  
- [ ] Documentation site  
- [ ] Performance optimization  
- [ ] Chrome Web Store submission  
- [ ] Public beta  

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

```bash
404dashboard/
├── src/
│   ├── components/
│   │   └── Dashboard.jsx       # Main dashboard component
│   ├── pages/
│   │   └── AuthPage.jsx        # Authentication page
│   ├── firebase.js             # Firebase configuration
│   ├── App.jsx                 # Root component with auth state
│   └── main.jsx                # Entry point
├── public/
├── .env.local                  # Environment variables (not tracked)
├── .gitignore
├── package.json
└── README.md
```

## Contributing

This is currently a personal project, but contributions are welcome once we reach beta. If you have ideas or find bugs, feel free to open an issue.

## Future Vision

The goal is to make 404Dashboard the default way developers manage their toolkit - think of it as "bookmarks designed by developers, for developers." With the Chrome extension, it becomes a seamless part of your browsing workflow, and with community features, we can all benefit from each other's curated collections.

## License

MIT(to be added)

## Contact

Built by Siem Lemlem - siemlemlem50@gmail.com

## Status: Active Development|Version:0.1.0(MVP)
