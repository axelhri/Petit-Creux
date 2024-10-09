import { createBrowserRouter, RouterProvider } from "react-router-dom";

import SharedLayout from "./layouts/SharedLayout.jsx";
import { Home, ErrorPage } from "./pages";
import SingleError from "./components/SingleError.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
