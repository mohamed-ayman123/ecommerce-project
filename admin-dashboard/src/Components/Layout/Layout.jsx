import AppRoutes from "../../routes/AppRoutes";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg-main)]">
      <Sidebar />

      <main className="flex-1 p-8">
        <AppRoutes/>
      </main>
    </div>
  )
}
export default Layout;