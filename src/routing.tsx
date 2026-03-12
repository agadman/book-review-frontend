import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookDetailsPage from "./pages/BookDetailsPage";

const router = createBrowserRouter([
  { 
    path: "/", 
    element: <HomePage /> 
}, 
{
    path: "/books/:id",
    element: <BookDetailsPage />
}        
]);

export default router;