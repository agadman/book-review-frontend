import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

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
        setUser(username, data.token);
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
    <div>
      <h1>Registrera konto</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Registrera</button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
};

export default RegisterPage;