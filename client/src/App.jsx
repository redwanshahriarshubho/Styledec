import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import Main from "./layouts/Main";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";

// Dashboards (Role-Based)
import UserProfile from "./pages/Dashboard/User/UserProfile";
import MyBookings from "./pages/Dashboard/User/MyBookings";
import Payment from "./pages/Dashboard/User/Payment";

import AdminHome from "./pages/Dashboard/Admin/AdminHome";
import ManageServices from "./pages/Dashboard/Admin/ManageServices";
import ManageBookings from "./pages/Dashboard/Admin/ManageBookings";

import DecoratorHome from "./pages/Dashboard/Decorator/DecoratorHome";
import MyTasks from "./pages/Dashboard/Decorator/MyTasks";

// Route Security Wrappers
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import DecoratorRoute from "./routes/DecoratorRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/services", element: <Services /> },
      { path: "/service/:id", element: <ServiceDetails /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ]
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      // --- Common User Routes ---
      { path: "user-profile", element: <UserProfile /> },
      { path: "my-bookings", element: <MyBookings /> },
      { path: "payment/:id", element: <Payment /> },

      // --- Admin Only Routes ---
      { 
        path: "admin-home", 
        element: <AdminRoute><AdminHome /></AdminRoute> 
      },
      { 
        path: "manage-services", 
        element: <AdminRoute><ManageServices /></AdminRoute> 
      },
      { 
        path: "all-bookings", 
        element: <AdminRoute><ManageBookings /></AdminRoute> 
      },

      // --- Decorator Only Routes ---
      { 
        path: "decorator-home", 
        element: <DecoratorRoute><DecoratorHome /></DecoratorRoute> 
      },
      { 
        path: "my-tasks", 
        element: <DecoratorRoute><MyTasks /></DecoratorRoute> 
      },
    ]
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;