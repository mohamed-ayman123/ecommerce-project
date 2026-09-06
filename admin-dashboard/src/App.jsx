
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
}

export default App;
