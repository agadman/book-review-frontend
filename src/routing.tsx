import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookDetailsPage from "./pages/BookDetailsPage";
import MyProfilePage from "./pages/MyProfilePage";
import Layout from "./components/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
        { 
            path: "/", 
            element: <HomePage /> 
        }, 
        {
            path: "/books/:id",
            element: <BookDetailsPage />
        },
        {
            path: "/profile",
            element: <MyProfilePage />
        } 
    ]
  },
     
]);

export default router;