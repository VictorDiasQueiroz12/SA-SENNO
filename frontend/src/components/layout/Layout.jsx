import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="lv-app-shell">
      <Navbar />
      <main className="lv-main">
        <Outlet />
      </main>
    </div>
  );
}
