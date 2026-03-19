// Interface för inloggningsdata som skickas till API
export interface LoginData {
  username: string;
  password: string;
}

// Interface för registreringsdata för en ny användare
export interface RegisterData {
  username: string;
  password: string;
}

// Interface för svaret från API vid inloggning/registrering
export interface AuthResponse {
  token: string;
}

// Interface för en användare i applikationen
export interface User {
  username: string;
}