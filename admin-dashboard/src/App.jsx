import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/AppRoutes";
// import Products from "./pages/products/Products";

export default function App() {
  const theme = useSelector((state) => state.ui?.theme || "light");
  const preferences = useSelector((state) => state.ui?.preferences);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <>
      <AppRoutes />
      <ToastContainer
        position={preferences?.toastPosition || "top-right"}
        autoClose={preferences?.toastDuration || 3000}
        theme={theme === "dark" ? "dark" : "colored"}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    {/* <Products/> */}

      
    </>
  );
}
