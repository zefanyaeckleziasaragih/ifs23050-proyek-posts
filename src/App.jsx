import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

const LoginPage = lazy(() => import("./features/auth/pages/LoginPage"));
const AuthLayout = lazy(() => import("./features/auth/layouts/AuthLayout"));
const RegisterPage = lazy(() => import("./features/auth/pages/RegisterPage"));
const HomePage = lazy(() => import("./features/todos/pages/HomePage"));
const DetailPage = lazy(() => import("./features/todos/pages/DetailPage"));
const TodoLayout = lazy(() => import("./features/todos/layouts/TodoLayout"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="mt-5 text-center">
          <div className="mb-3">
            <img
              src="/logo.png"
              alt="logo"
              style={{ width: "126px", height: "126px" }}
            />
          </div>
          <div
            className="spinner-border text-primary"
            style={{ width: "48px", height: "48px" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
    >
      <Routes>
        {/* Auth */}
        <Route path="auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        {/* Todos */}
        <Route path="/" element={<TodoLayout />}>
          <Route index element={<HomePage />} />
          <Route path="todos/:todoId" element={<DetailPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
