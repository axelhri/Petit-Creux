import { createBrowserRouter, RouterProvider } from "react-router-dom";

import SharedLayout from "./layouts/SharedLayout.jsx";
import { Home, ErrorPage } from "./pages";
import SingleError from "./components/SingleError.jsx";
import Login from "./pages/Login.jsx"; // Import du composant Login

const router = createBrowserRouter([
  {
    path: "/",
    element: <SharedLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
        errorElement: <SingleError />,
      },
      {
        path: "login", // Route pour la page de login
        element: <Login />,
        errorElement: <SingleError />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
