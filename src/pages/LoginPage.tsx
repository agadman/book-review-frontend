import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const data = await login({ username, password });
      setUser(username, data.token); // sparar det i store
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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Logga in</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginPage;