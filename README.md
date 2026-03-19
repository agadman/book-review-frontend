# Bokrecensionsplattform Frontend
Detta projekt är en frontend-applikation för en bokrecensionsplattform där användare kan söka efter böcker, läsa recensioner och skriva egna recensioner. 

## Funktioner 
- Söka efter böcker via Google Books API
- Visa sökresultat på startsidan
- Visa de senaste recensionerna på startsidan
- Visa detaljerad information om en bok på en egen sida
- Registrering och inloggning för användare
- Skapa, redigera och ta bort egna recensioner (CRUD)
- Visa användarens egna recensioner på en profilsida

## Teknologier
- React + TypeScript
- Zustand (state management)
- React Router
- CSS (modulär styling per komponent + global CSS)
- Axios (för backend-API)
- Fetch API (för Google Books API)
- Backend (separat projekt): Node.js + Express + SQLite + JWT

## Struktur (översikt)
Applikationen är uppdelad i flera delar:

- Pages – sidvyer som HomePage, BookDetailsPage och MyProfilePage
- Components – återanvändbara komponenter som Header, Footer, ReviewForm, Layout och ProtectedRoute
- Services – hanterar API-anrop (googleBooksService, reviewService, authService)
- Store – global state med Zustand (authStore, reviewStore, bookStore)
- Types – TypeScript-interfaces för struktur och typkontroll

## Publicerad URL
Kommer snart...