// src/App.jsx

import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

const LoginPage = lazy(() => import("./features/auth/pages/LoginPage"));
const AuthLayout = lazy(() => import("./features/auth/layouts/AuthLayout"));
const RegisterPage = lazy(() => import("./features/auth/pages/RegisterPage"));
const HomePage = lazy(() => import("./features/posts/pages/HomePage"));
const DetailPage = lazy(() => import("./features/posts/pages/DetailPage"));
// const CommentPage = lazy(() => import("./features/posts/pages/CommentPage")); // <<< TAMBAHKAN INI
const PostLayout = lazy(() => import("./features/posts/layouts/PostLayout"));
const ProfilePage = lazy(() => import("./features/users/pages/ProfilePage"));

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
        {/* Posts */}
        <Route path="/" element={<PostLayout />}>
          <Route index element={<HomePage />} />
          <Route path="posts/:postId" element={<DetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* <Route path="posts/:postId/comments" element={<CommentPage />} /> */}
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
