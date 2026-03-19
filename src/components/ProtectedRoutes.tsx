
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "../store/authStore";

// Props för ProtectedRoute: tar emot barn-komponenter
interface ProtectedRouteProps {
    children: ReactNode
}
// Renderar barn-komponenter endast om användaren är inloggad (har token)

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    // Hämtar token från zustand store
    const token = useAuthStore((state) => state.token);

    // Om ingen token finns: navigera till login
    if (!token) {
        return <Navigate to="/loggain" replace />
    }

    // Om token finns: rendera barn-komponenterna
    return <>{children}</>
}

export default ProtectedRoute;