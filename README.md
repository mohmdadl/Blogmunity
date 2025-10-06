# Blogmunity – React + Vite Blog App

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38b2ac?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12-ffca28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/141286bd-ece9-4a2d-9137-446c5e65a582/deploy-status)](https://app.netlify.com/sites/dapper-gumption-c5147e/deploys)


[![Stars](https://img.shields.io/github/stars/mohmdadl/Blogmunity?style=social)](https://github.com/mohmdadl/Blogmunity/stargazers)
[![Forks](https://img.shields.io/github/forks/mohmdadl/Blogmunity?style=social)](https://github.com/mohmdadl/Blogmunity/network/members)
[![Issues](https://img.shields.io/github/issues/mohmdadl/Blogmunity)](https://github.com/mohmdadl/Blogmunity/issues)

A modern blogging platform built with React, Firebase, and Tailwind CSS.  
Features Google Sign-In, post CRUD, likes, profiles, theming, and image uploads.  
Deployed on Netlify.

Live Demo: [https://dapper-gumption-c5147e.netlify.app/](https://dapper-gumption-c5147e.netlify.app/)

---

---

## 🎬 Check Out the Demo First!


https://github.com/user-attachments/assets/86e86735-913d-49a1-b4c6-54579a3f72cc

---
## Features

- Google Sign-In with Firebase Auth  
- Create, edit, delete, and view posts  
- Like/unlike posts with real-time updates  
- Post details and edit flow  
- User profiles (/profile and /profile/:uid)  
- Dark/Light theme toggle  
- Responsive UI with Tailwind CSS + DaisyUI  
- Image upload via ImgBB API  
- SPA routing with React Router and Netlify redirects  
---
## Tech Stack

- React 19 + Vite 7  
- React Router DOM 7  
- Tailwind CSS 4 + DaisyUI  
- Firebase 12 (Auth, Firestore)  
- ImgBB API for images  
- Netlify for deployment  

---

## Project Structure

```bash
src/
  App.jsx               # App routes and providers
  main.jsx              # App bootstrap
  css/index.css         # Tailwind/DaisyUI styles
  frebase-config.js     # Firebase init (Auth, Firestore, Google Provider)
  context/ThemeContext  # Theme provider
  components/
    Nav.jsx             # Navigation bar
    PostCard.jsx        # Post card UI
    ThemeToggle.jsx     # Dark/Light switch
    ImageViewer.jsx     # Modal image viewer
  pages/
    Home.jsx            # Post feed
    Login.jsx           # Google Sign-in
    CreatPost.jsx       # Create post
    PostDetails.jsx     # Post details
    EditPost.jsx        # Edit post
    Profile.jsx         # Profile page
    ErrorPage.jsx       # Error boundary
    NotFound.jsx        # 404 page
  services/
    posts.js            # Firestore CRUD utils
    storage.js          # ImgBB upload helper
```
---
## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```
---
