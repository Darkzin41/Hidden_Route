import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../features/auth/ProtectedRoute.jsx";
import { AdminLayout } from "../shared/layout/AdminLayout.jsx";
import { PublicLayout } from "../shared/layout/PublicLayout.jsx";
import { Loader } from "../shared/ui/Loader.jsx";

const HomePage = lazy(() => import("../pages/public/HomePage.jsx"));
const BeachesPage = lazy(() => import("../pages/public/BeachesPage.jsx"));
const BeachDetailPage = lazy(
  () => import("../pages/public/BeachDetailPage.jsx"),
);
const AboutPage = lazy(() => import("../pages/public/AboutPage.jsx"));
const ContactPage = lazy(() => import("../pages/public/ContactPage.jsx"));
const NotFoundPage = lazy(() => import("../pages/public/NotFoundPage.jsx"));
const LoginPage = lazy(() => import("../pages/admin/LoginPage.jsx"));
const DashboardPage = lazy(() => import("../pages/admin/DashboardPage.jsx"));
const BeachesAdminPage = lazy(
  () => import("../pages/admin/BeachesAdminPage.jsx"),
);
const PartnersAdminPage = lazy(
  () => import("../pages/admin/PartnersAdminPage.jsx"),
);
const ReviewsAdminPage = lazy(
  () => import("../pages/admin/ReviewsAdminPage.jsx"),
);
const MessagesAdminPage = lazy(
  () => import("../pages/admin/MessagesAdminPage.jsx"),
);

export function AppRoutes() {
  return (
    <Suspense fallback={<Loader fullPage label="Preparando a rota…" />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="praias" element={<BeachesPage />} />
          <Route path="praias/:slug" element={<BeachDetailPage />} />
          <Route path="sobre" element={<AboutPage />} />
          <Route path="contato" element={<ContactPage />} />
        </Route>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="praias" element={<BeachesAdminPage />} />
            <Route path="parceiros" element={<PartnersAdminPage />} />
            <Route path="avaliacoes" element={<ReviewsAdminPage />} />
            <Route path="mensagens" element={<MessagesAdminPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
