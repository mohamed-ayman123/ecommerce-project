import { Outlet } from "react-router-dom";
import SideBar from "./Sidebar";
import NavBar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg-main)] dark:bg-[var(--color-dark-bg-main)]">
      <SideBar />

      <div className="flex min-w-0 flex-1 flex-col">
        <NavBar />

        <main className="min-w-0 flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}