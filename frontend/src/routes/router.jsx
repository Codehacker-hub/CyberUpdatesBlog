import React, { Suspense , lazy} from 'react';
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";

// Lazy load route components for better performance
const HomePage = lazy(() => import("./HomePage.jsx"));
const AboutPage = lazy(() => import("./AboutPage.jsx"));
const PostListPage = lazy(() => import("./PostListPage.jsx"));
const SinglePostPage = lazy(() => import("./SinglePostPage.jsx"));
const WritePage = lazy(() => import("./WritePage.jsx"));
const LoginPage = lazy(() => import("./LoginPage.jsx"));
const RegisterPage = lazy(() => import("./RegisterPage.jsx"));

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Suspense fallback={<div>Loading...</div>}><HomePage /></Suspense> },
      { path: "/home", element: <Suspense fallback={<div>Loading...</div>}><HomePage /></Suspense> },
      { path: "/about", element: <Suspense fallback={<div>Loading...</div>}><AboutPage /></Suspense> },
      { path: "/posts", element: <Suspense fallback={<div>Loading...</div>}><PostListPage /></Suspense> },
      { path: "/:slug", element: <Suspense fallback={<div>Loading...</div>}><SinglePostPage /></Suspense> },
      { path: "/write", element: <Suspense fallback={<div>Loading...</div>}><WritePage /></Suspense> },
      { path: "/login", element: <Suspense fallback={<div>Loading...</div>}><LoginPage /></Suspense> },
      { path: "/signup", element: <Suspense fallback={<div>Loading...</div>}><RegisterPage /></Suspense> },
    ],
  },
]);

export default router;
