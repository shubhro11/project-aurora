import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

const RegisterModal = lazy(() => import("../layouts/RegisterModal"));
const LoginModal = lazy(() => import("../layouts/LoginModal"));

const LandingPage = lazy(() => import("../pages/LandingPage"));
const Chat = lazy(() => import("../pages/Chat"));
const ChatArea = lazy(() => import("../components/ChatSection/ChatArea"));

const RestrictedRoute = lazy(() => import("./RestrictedRoute"));
const PrivateRoute = lazy(() => import("../routes/PrivateRoute"));

const Page404 = lazy(() => import("../pages/Page404"));

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <Routes>
      {/* 404 Route */}
      <Route path="*" element={<Page404 />} />

      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes: Redirect to /chat if already logged in */}
      <Route
        path="/login"
        element={
          <RestrictedRoute isAuthenticated={isAuthenticated}>
            <LoginModal />
          </RestrictedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <RestrictedRoute isAuthenticated={isAuthenticated}>
            <RegisterModal />
          </RestrictedRoute>
        }
      />

      {/* Private Routes: Redirect to /login if not logged in */}
      <Route
        path="/chat"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Chat />
          </PrivateRoute>
        }
      />

      <Route
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Chat />
          </PrivateRoute>
        }
      >
        {/* Only the content inside the Outlet changes here */}
        <Route path="/chat/:id" element={<ChatArea />} />
      </Route>

    </Routes>
  );
};

export default AppRoutes;
