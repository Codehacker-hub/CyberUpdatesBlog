import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import Loader from "../components/Loader.jsx";

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
      { path: "/", element: <Suspense fallback={<Loader />}><HomePage /></Suspense> },
      { path: "/home", element: <Suspense fallback={<Loader />}><HomePage /></Suspense> },
      { path: "/about", element: <Suspense fallback={<Loader />}><AboutPage /></Suspense> },
      { path: "/posts", element: <Suspense fallback={<Loader />}><PostListPage /></Suspense> },
      { path: "/:slug", element: <Suspense fallback={<Loader />}><SinglePostPage /></Suspense> },
      { path: "/write", element: <Suspense fallback={<Loader />}><WritePage /></Suspense> },
      { path: "/login", element: <Suspense fallback={<Loader />}><LoginPage /></Suspense> },
      { path: "/signup", element: <Suspense fallback={<Loader />}><RegisterPage /></Suspense> },
    ],
  },
]);

export default router;
