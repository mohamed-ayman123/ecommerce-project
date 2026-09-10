import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "./Sidebar";
import NavBar from "./Navbar";
import { fetchProducts } from "@/store/slices/productsSlice";

export default function AppLayout() {
  const dispatch = useDispatch();
  const hasProducts = useSelector(
    (state) => Boolean(state.products?.items?.length)
  );
  const isProductsLoading = useSelector(
    (state) => Boolean(state.products?.isLoading)
  );

  // Prefetch product catalog on dashboard entry so line items & order stats have immediate metadata
  useEffect(() => {
    if (!hasProducts && !isProductsLoading) {
      dispatch(fetchProducts({ limit: 100 }));
    }
  }, [dispatch, hasProducts, isProductsLoading]);

  return (
    <div className="flex min-h-screen bg-bg-main dark:bg-dark-bg-main">
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