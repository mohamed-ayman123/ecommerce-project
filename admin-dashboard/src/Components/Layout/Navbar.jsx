// import { FaMoon, FaSun, FaBell, FaArrowRightFromBracketوAddTeam02Icon  } from "react-icons/fa6";
// import logo from "../../assets/images/logo.jpg";

// function Navbar({ darkMode, setDarkMode }) {
//   return (
//     <header
//       className={`flex h-20 items-center justify-between border-b px-8 transition-colors duration-300 ${
//         darkMode
//           ? "border-slate-800 bg-[#020617] text-white"
//           : "border-gray-200 bg-white text-gray-900"
//       }`}
//     >
//       {/* Logo*/}
//       <div className="flex items-center gap-3">
//         <img
//           src={logo}
//           alt="Logo"
//           className="h-15 w-20 object-contain"
//         />

//         <div>
//           <h1 className="text-xl font-bold">
//             Electronics Dashboard
//           </h1>

//           <p
//             className={`text-sm ${
//               darkMode ? "text-slate-400" : "text-gray-500"
//             }`}
//           >
//             Welcome back to your electronics dashboard
//           </p>
//         </div>
//       </div>

//       {/* Right Side */}
//       <div className="flex items-center gap-4">

//         {/* Noti */}
//         <button
//           className={`relative rounded-xl p-2.5 ${
//             darkMode
//               ? "bg-[#161f30] hover:bg-slate-700"
//               : "bg-gray-100 hover:bg-gray-200"
//           }`}
//         >
//           <FaBell
//             size={18}
//             className={darkMode ? "text-gray-300" : "text-gray-700"}
//           />

//           <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
//         </button>

//         {/* Dark / Light */}
//         <button
//           onClick={() => setDarkMode(!darkMode)}
//           className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
//             darkMode
//               ? "bg-slate-800 text-yellow-400 hover:bg-green-700"
//               : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//           }`}
//         >
//           {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
//         </button>

//         {/* Admin */}
//         <div
//           className={`flex items-center gap-3 rounded-xl border px-4 py-1.5 ${
//             darkMode
//               ? "border-slate-700/30 bg-[#161f30]"
//               : "border-gray-200 bg-gray-100"
//           }`}
//         >
//           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
//              <HugeiconsIcon icon={AddTeam02Icon} size={20} />
//           </div>

//           <div className="flex flex-col text-left">
//             <span className="text-xs font-bold tracking-wider">
//               Admin
//             </span>

//             <span
//               className={`-mt-0.5 text-[10px] ${
//                 darkMode ? "text-gray-400" : "text-gray-500"
//               }`}
//             >
//               electronics
//             </span>
//           </div>
//         </div>

//         {/* Logout */}
//         <button className="flex items-center gap-2 rounded-xl bg-[#e04f5f] px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600">
//           <FaArrowRightFromBracket size={16} />
//           <span>Logout</span>
//         </button>

//       </div>
//     </header>
//   );
// }

// export default Navbar;

///////////////////////////////////////////////////
import { FaMoon, FaSun, FaBell, FaArrowRightFromBracket } from "react-icons/fa6";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddTeam02Icon } from "@hugeicons/core-free-icons";

import logo from "../../assets/images/logo.jpg";

function Navbar({ darkMode, setDarkMode }) {
  return (
    <header
      className={`flex h-20 items-center justify-between border-b px-8 transition-colors duration-300 ${
        darkMode
          ? "border-slate-800 bg-[#020617] text-white"
          : "border-gray-200 bg-white text-gray-900"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="Logo"
          className="h-16 w-20 object-contain"
        />

        <div>
          <h1 className="text-xl font-bold">
            Electronics Dashboard
          </h1>

          <p
            className={`text-sm ${
              darkMode ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Welcome back to your electronics dashboard
          </p>
        </div>
      </div>

      {/* Right  */}
      <div className="flex items-center gap-4">

        {/* Noti */}
        <button
          className={`relative rounded-xl p-2.5 ${
            darkMode
              ? "bg-[#161f30] hover:bg-slate-700"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <FaBell
            size={18}
            className={darkMode ? "text-gray-300" : "text-gray-700"}
          />

          {/* Notification Dot */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Dark / Light */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
            darkMode
              ? "bg-slate-800 text-yellow-400 hover:bg-green-700"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>

        {/* Admin */}
        <div
          className={`flex items-center gap-3 rounded-xl border px-4 py-1.5 ${
            darkMode
              ? "border-slate-700/30 bg-[#161f30]"
              : "border-gray-200 bg-gray-100"
          }`}
        >
          {/* Avatar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
            <HugeiconsIcon
              icon={AddTeam02Icon}
              size={20}
            />
          </div>

          {/* Admin Info */}
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold tracking-wider">
              Admin
            </span>

            <span
              className={`-mt-0.5 text-[10px] ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              electronics
            </span>
          </div>
        </div>

        {/* Logout */}
        <button className="flex items-center gap-2 rounded-xl bg-[#e04f5f] px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600">
          <FaArrowRightFromBracket size={16} />
          <span>Logout</span>
        </button>

      </div>
    </header>
  );
}

export default Navbar;