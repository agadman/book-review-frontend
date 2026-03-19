import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import "./Auth.css";

const RegisterPage = () => {
  // State för input-fält och felmeddelande
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const setUser = useAuthStore((state) => state.setUser); // Funktion för att spara user i zustand store
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Vänligen fyll i användarnamn och lösenord");
      return;
    }

    try {
      setError(null);

      const data = await register({ username, password }); // API-anrop för registrering

      // Sparar användare och token i store om registreringen lyckas
      if (data.token) {
        setUser({username}, data.token);
      }

      navigate("/");

    } catch (err: unknown) {
        if (err instanceof AxiosError) {
            setError(err.response?.data?.message || "Registrering misslyckades");
        } else {
            setError("Ett oväntat fel inträffade");
        }
    }
  };

  return (
    <div className="auth-wrapper">
      <h1>Registrera konto</h1>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          className="auth-input"
          placeholder="Användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-button" type="submit">Registrera</button>
      </form>

      {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default RegisterPage;