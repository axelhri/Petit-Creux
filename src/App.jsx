import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SharedLayout from "./layouts/SharedLayout.jsx";
import { Home, ErrorPage } from "./pages";
import SingleError from "./components/SingleError.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Share from "./pages/ShareRecipe.jsx";
import SingleRecipe from "./pages/SingleRecipe.jsx";
import { AuthProvider } from "./context/AuthContext"; // Import du AuthProvider

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
        path: "login",
        element: <Login />,
        errorElement: <SingleError />,
      },
      {
        path: "register",
        element: <Register />,
        errorElement: <SingleError />,
      },
      {
        path: "profile",
        element: <Profile />,
        errorElement: <SingleError />,
      },
      {
        path: "share",
        element: <Share />,
        errorElement: <SingleError />,
      },
      {
        path: "recipes/:id",
        element: <SingleRecipe />,
        errorElement: <SingleError />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
