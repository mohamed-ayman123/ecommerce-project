import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { closeMobileSidebar } from '../../store/slices/uiSlice';

const navItems = [
  {
    to: "/dashboard",
    end: true,
    label: "Dashboard",
    icon: (
      <>
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </>
    ),
  },
  {
    to: "/dashboard/users",
    label: "Users",
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    to: "/dashboard/products",
    end: true,
    label: "Products",
    icon: (
      <>
        <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
        <path d="M12 22V12" />
        <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
        <path d="m7.5 4.27 9 5.15" />
      </>
    ),
  },
  {
    to: "/dashboard/products/new",
    end: true,
    label: "Add Products",
    icon: (
      <>
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </>
    ),
  },
  {
    to: "/dashboard/orders",
    label: "Orders",
    icon: (
      <>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </>
    ),
  },
  {
    to: "/dashboard/carts",
    label: "Carts",
    icon: (
      <>
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </>
    ),
  },
  {
    to: "/dashboard/settings",
    label: "Settings",
    icon: (
      <>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
];

function SideBar() {
  const dispatch = useDispatch();
  const isMobileSidebarOpen = useSelector((state) => state.ui?.isMobileSidebarOpen);

  const handleNavClick = () => {
    dispatch(closeMobileSidebar());
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          role="presentation"
          aria-hidden="true"
          onClick={() => dispatch(closeMobileSidebar())}
          className="fixed inset-0 top-20 z-30 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-20 bottom-0 left-0 z-40 flex h-[calc(100vh-5rem)] h-[calc(100dvh-5rem)] w-72 flex-shrink-0 flex-col bg-primary-dark border-r border-primary-medium/20 py-4 md:py-5 shadow-2xl transition-transform duration-300 ease-in-out md:top-0 md:h-screen md:sticky md:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="mx-5 mb-4 md:mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-text-gold font-body font-semibold">
              Commerce
            </p>

            <h1 className="mt-1 text-xl font-bold font-heading text-text-light">
              Admin Panel
            </h1>
          </div>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => dispatch(closeMobileSidebar())}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-medium/40 text-slate-200 hover:bg-primary-medium hover:text-white md:hidden cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 md:ml-5 md:px-0">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={handleNavClick}
              className="relative block overflow-hidden"
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute inset-0 origin-right bg-bg-main transition-transform duration-300 ease-out dark:bg-dark-bg-main ${
                      isActive ? "scale-x-100 rounded-l-full" : "scale-x-0"
                    }`}
                  />

                  <span
                    className={`relative z-10 flex items-center gap-3 rounded-l-full px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? "font-bold text-text-primary dark:text-text-gold"
                        : "text-slate-300 hover:bg-white/10 hover:text-white dark:hover:bg-white/10 dark:hover:text-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-text-gold)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 shrink-0"
                    >
                      {item.icon}
                    </svg>

                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Live section */}
        <div className="m-5 mt-auto rounded-2xl bg-gradient-to-br from-primary-dark via-primary-medium to-accent-gold p-4 text-white shadow-xl shadow-cyan-900/20">
          <p className="text-xs uppercase tracking-[0.3em] text-text-gold font-semibold">
            Live
          </p>

          <p className="mt-1 text-sm font-semibold">
            Connected to the E-commerce API
          </p>
        </div>
      </aside>
    </>
  );
}

export default SideBar;