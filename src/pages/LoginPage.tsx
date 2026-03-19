import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import "./Auth.css";

const LoginPage = () => {
  // State för input-fält
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Funktion från zustand store för att spara användare
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Vänligen fyll i användarnamn och lösenord");
      return;
    }

    try {
      setError(null);
      const data = await login({ username, password }); // API-anrop
      setUser({username}, data.token); // sparar user och token i store
      navigate("/"); 
    } catch (err: unknown) {
        if (err instanceof AxiosError) {
            setError(err.response?.data?.message || "Logga in misslyckades");
        } else {
            setError("Ett oväntat fel inträffade");
        }
    }
  };

   return (
    <div className="auth-wrapper">
      <h1>Logga in</h1>

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

        <button className="auth-button" type="submit">Logga in</button>
      </form>

      {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default LoginPage;