<<<<<<< HEAD
import { useEffect } from "react";
import { useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const theme = useSelector((state) => state.ui?.theme || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <AppRoutes />;
=======

import { useState } from "react";

import Sidebar from "./Components/Layout/Sidebar";
import Navbar from "./Components/Layout/Navbar";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#020617] text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <Sidebar darkMode={darkMode} />

        {/* باقي الصفحة */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Navbar */}
          <Navbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          {/* Content */}
        

        </div>
      </div>
    </div>
  );
>>>>>>> ff4cab3 (Update project)
}

export default App;
