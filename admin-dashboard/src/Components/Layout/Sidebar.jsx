import { NavLink } from 'react-router-dom';

const navItems = [
  {
    to: "/dashboard",
    end: true,
    label: "Dashbord",
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
  return (
    <aside className="mx-4 mt-4 flex-shrink-0 rounded-3xl bg-[var(--color-primary-dark)] shadow-xl shadow-slate-900/5 md:mx-0 md:mt-0 md:h-dvh md:w-72 md:rounded-none md:py-5">
      {/* عنوان Commerce / Admin Panel - يظهر فقط من md فما فوق */}
      <div className="mb-10 mx-5 hidden md:block">
        <p className="text-sm uppercase tracking-[0.4em] text-[var(--color-text-gold)]">
          Commerce
        </p>
        <h1 className="mt-3 text-2xl font-bold text-[var(--color-text-light)]">
          Admin Panel
        </h1>
      </div>

      {/* بالجوال: شريط أفقي قابل للسكرول | بالشاشات الكبيرة: عمودي */}
      <nav className="flex gap-1 overflow-x-auto px-3 py-3 md:ml-5 md:mb-5 md:flex-col md:gap-0 md:overflow-visible md:px-0 md:py-0">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className="relative block flex-shrink-0 overflow-hidden md:flex-shrink"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`absolute inset-0 origin-right bg-[var(--color-bg-main)] transition-transform duration-500 ease-out dark:bg-[var(--color-dark-bg-main)] ${
                     isActive ? "scale-x-100 rounded-full md:rounded-l-full md:rounded-r-none" : "scale-x-0"
                  }`}
                />
                <span
                  className={`relative z-10 flex items-center justify-center gap-2 whitespace-nowrap rounded-l-full px-3 py-2 text-sm md:justify-start md:gap-3 md:rounded-none md:px-4 md:py-3 ${
                    isActive
                      ? "font-bold text-[var(--color-text-primary)] dark:text-[var(--color-text-gold)]"
                      : "text-slate-300 hover:rounded-l-full hover:bg-[var(--color-primary-medium)] hover:text-[var(--color-text-primary)] md:hover:rounded-l-full"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#DDA136"
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

      {/* قسم Live - يظهر فقط من md فما فوق */}
      <div className="mt-auto m-5 hidden rounded-3xl bg-gradient-to-br from-[var(--color-primary-dark)] via-[var(--color-primary-medium)] to-[var(--color-accent-gold)] p-4 text-white shadow-xl shadow-cyan-900/20 md:block">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-text-gold)]">
          Live
        </p>
        <p className="mt-2 text-base font-semibold">
          Connected to the E-commerce API
        </p>
      </div>
    </aside>
  );
}

export default SideBar;