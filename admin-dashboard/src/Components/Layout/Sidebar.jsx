
import { Link } from "react-router-dom";

import {
  FaGauge,
  FaUsers,
  FaBox,
  FaPlus,
  FaFileInvoice,
  FaCartShopping,
  FaGear,
} from "react-icons/fa6";

function Sidebar({ darkMode }) {
  return (
    <aside
      className={`flex min-h-screen w-[360px] flex-col border-r px-6 py-7 transition-colors duration-300 ${
        darkMode
          ? "border-slate-800 bg-[#020617] text-white"
          : "border-gray-200 bg-white text-gray-900"
      }`}
    >
      {/* Logo / Title */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium tracking-[6px] text-green-400">
          COMMERCE
        </p>

        <h2 className="text-2xl font-bold">
          Admin electronics
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">

        <Link
          to="/"
          className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition ${
            darkMode
              ? "text-white hover:bg-green-800"
              : "text-gray-700 hover:bg-green-200"
          }`}
        >
          <FaGauge className="text-lg" />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/users"
          className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition ${
            darkMode
              ? "text-white hover:bg-green-800"
              : "text-gray-700 hover:bg-green-200"
          }`}
        >
          <FaUsers className="text-lg" />
          <span>Users</span>
        </Link>

        {/* Products Active */}
        <Link
          to="/products"
          className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition ${
            darkMode
              ? "border border-slate-700 bg-green-800 text-white"
              : "border border-gray-200 bg-green-200 text-gray-900"
          }`}
        >
          <FaBox className="text-lg" />
          <span>Products</span>
        </Link>

        <Link
          to="/products/add"
          className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition ${
            darkMode
              ? "text-white hover:bg-green-800"
              : "text-gray-700 hover:bg-green-200"
          }`}
        >
          <FaPlus className="text-lg" />
          <span>Add Product</span>
        </Link>

        <Link
          to="/orders"
          className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition ${
            darkMode
              ? "text-white hover:bg-green-800"
              : "text-gray-700 hover:bg-green-200"
          }`}
        >
          <FaFileInvoice className="text-lg" />
          <span>Orders</span>
        </Link>

        <Link
          to="/carts"
          className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition ${
            darkMode
              ? "text-white hover:bg-green-800"
              : "text-gray-700 hover:bg-green-200"
          }`}
        >
          <FaCartShopping className="text-lg" />
          <span>Carts</span>
        </Link>

        <Link
          to="/settings"
          className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition ${
            darkMode
              ? "text-white hover:bg-green-800"
              : "text-gray-700 hover:bg-green-200"
          }`}
        >
          <FaGear className="text-lg" />
          <span>Settings</span>
        </Link>
      </nav>

     
    </aside>
  );
}

export default Sidebar;

