import NavBar from "./Components/Layout/Navbar";
import AppRoutes from "./routes/AppRoutes";
import SideBar from "./Components/Layout/Sidebar"

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-main)] md:flex-row dark:bg-[var(--color-dark-bg-main)]">
      <div className="order-2 md:order-1">
         <SideBar/>
      </div>

      <div className="order-1 flex min-w-0 flex-1 flex-col md:order-2">
        
        <NavBar/>

        <main className="min-w-0 flex-1 p-4 md:p-8">
          
          <AppRoutes/>
        </main>
      </div>
    </div>
  )
}
