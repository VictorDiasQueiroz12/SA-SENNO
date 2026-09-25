import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";

import Feed from "./pages/Feed";
import MapExplorer from "./pages/MapExplorer";
import Ranking from "./pages/Ranking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SightingDetail from "./pages/SightingDetail";
import SightingForm from "./pages/SightingForm";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReports from "./pages/admin/AdminReports";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Feed />} />
        <Route path="/mapa" element={<MapExplorer />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/avistamentos/:id" element={<SightingDetail />} />

        <Route path="/avistamentos/novo" element={
          <ProtectedRoute><SightingForm /></ProtectedRoute>
        } />
        <Route path="/avistamentos/:id/editar" element={
          <ProtectedRoute><SightingForm /></ProtectedRoute>
        } />
        <Route path="/perfil" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/notificacoes" element={
          <ProtectedRoute><Notifications /></ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/denuncias" element={
          <ProtectedRoute adminOnly><AdminReports /></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
