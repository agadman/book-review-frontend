import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import "./Auth.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError(null);

      const data = await register({ username, password });

      if (data.token) {
        setUser({username}, data.token);
      }

      navigate("/");

    } catch (err: unknown) {
        if (err instanceof AxiosError) {
            setError(err.response?.data?.message || "Reggistrering misslyckades");
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

        <button className="auth-button" type="submit">
          Registrera
        </button>
      </form>

      {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default RegisterPage;