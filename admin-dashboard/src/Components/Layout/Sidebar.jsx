import {NavLink} from 'react-router-dom'
function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col bg-white/90  py-5 text-slate-900 shadow-xl shadow-slate-900/5 ">
      <div className="mb-10 mx-5 ">
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-400">
                Commerce
            </p>

            <h1 className="mt-3 text-2xl font-bold text-black">
                Admin Panel
            </h1>
      </div>
      <nav className=" ml-5 mb-5">
        
        <NavLink
            to="/dashboard "
            className="relative block overflow-hidden"
        >
            {({ isActive }) => (
                <>
                
                <span
                    className={`absolute inset-0 origin-right bg-slate-100 transition-transform duration-500 ease-out ${
                    isActive ? 'scale-x-100 rounded-l-full' : 'scale-x-0'
                    }`}
                />

                {/* محتوى الرابط */}
                <span
                    className={`relative z-10 flex items-center gap-3 px-4 py-3 ${
                    isActive
                        ? 'font-bold text-black'
                        : 'text-slate-300 hover:bg-slate-100  hover:text-black hover:rounded-l-full'
                    }`}
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    >
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>

                    Dashboard
                </span>
                </>
            )}
        </NavLink>
        
        <NavLink
            to="/dashboard/users"
            className="relative block overflow-hidden"
        >
            {({ isActive }) => (
                <>
                
                <span
                    className={`absolute inset-0 origin-right bg-slate-100 transition-transform duration-500 ease-out ${
                    isActive ? 'scale-x-100 rounded-l-full' : 'scale-x-0'
                    }`}
                />

                {/* محتوى الرابط */}
                <span
                    className={`relative z-10 flex items-center gap-3 px-4 py-3 ${
                    isActive
                        ? 'font-bold text-black'
                        : 'text-slate-300 hover:bg-slate-100  hover:text-black hover:rounded-l-full'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users h-4 w-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        Users
                </span>
                </>
            )}
        </NavLink>
        <NavLink
            to="/dashboard/products"
            end
            className="relative block overflow-hidden"
        >
            {({ isActive }) => (
                <>
                
                <span
                    className={`absolute inset-0 origin-right bg-slate-100 transition-transform duration-500 ease-out ${
                    isActive ? 'scale-x-100 rounded-l-full' : 'scale-x-0'
                    }`}
                />

                {/* محتوى الرابط */}
                <span
                    className={`relative z-10 flex items-center gap-3 px-4 py-3 ${
                    isActive
                        ? 'font-bold text-black'
                        : 'text-slate-300 hover:bg-slate-100  hover:text-black hover:rounded-l-full'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package h-4 w-4"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path><path d="M12 22V12"></path><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"></path><path d="m7.5 4.27 9 5.15"></path></svg>
                    Products
                </span>
                </>
            )}
        </NavLink>
        <NavLink
            to="/dashboard/products/new"
            end
            className="relative block overflow-hidden"
        >
            {({ isActive }) => (
                <>
                
                <span
                    className={`absolute inset-0 origin-right bg-slate-100 transition-transform duration-500 ease-out ${
                    isActive ? 'scale-x-100 rounded-l-full' : 'scale-x-0'
                    }`}
                />

                {/* محتوى الرابط */}
                <span
                    className={`relative z-10 flex items-center gap-3 px-4 py-3 ${
                    isActive
                        ? 'font-bold text-black'
                        : 'text-slate-300 hover:bg-slate-100  hover:text-black hover:rounded-l-full'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus h-4 w-4"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                    add Products
                </span>
                </>
            )}
        </NavLink>
        <NavLink
            to="/dashboard/orders"
            className="relative block overflow-hidden"
        >
            {({ isActive }) => (
                <>
                
                <span
                    className={`absolute inset-0 origin-right bg-slate-100 transition-transform duration-500 ease-out ${
                    isActive ? 'scale-x-100 rounded-l-full' : 'scale-x-0'
                    }`}
                />

                {/* محتوى الرابط */}
                <span
                    className={`relative z-10 flex items-center gap-3 px-4 py-3 ${
                    isActive
                        ? 'font-bold text-black'
                        : 'text-slate-300 hover:bg-slate-100  hover:text-black hover:rounded-l-full'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text h-4 w-4"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                    Orders
                </span>
                </>
            )}
        </NavLink>
        <NavLink
            to="/dashboard/carts"
            className="relative block overflow-hidden"
        >
            {({ isActive }) => (
                <>
                
                <span
                    className={`absolute inset-0 origin-right bg-slate-100 transition-transform duration-500 ease-out ${
                    isActive ? 'scale-x-100 rounded-l-full' : 'scale-x-0'
                    }`}
                />

                {/* محتوى الرابط */}
                <span
                    className={`relative z-10 flex items-center gap-3 px-4 py-3 ${
                    isActive
                        ? 'font-bold text-black'
                        : 'text-slate-300 hover:bg-slate-100  hover:text-black hover:rounded-l-full'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart h-4 w-4"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
                    carts
                </span>
                </>
            )}
        </NavLink>
        <NavLink
            to="/dashboard/settings"
            
            className="relative block overflow-hidden"
        >
            {({ isActive }) => (
                <>
                
                <span
                    className={`absolute inset-0 origin-right bg-slate-100 transition-transform duration-500 ease-out ${
                    isActive ? 'scale-x-100 rounded-l-full' : 'scale-x-0'
                    }`}
                />

                {/* محتوى الرابط */}
                <span
                    className={`relative z-10 flex items-center gap-3 px-4 py-3 ${
                    isActive
                        ? 'font-bold text-black'
                        : 'text-slate-300 hover:bg-slate-100  hover:text-black hover:rounded-l-full'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings h-4 w-4"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    Settings
                </span>
                </>
            )}
        </NavLink>
         
      </nav>
      <div className="mt-auto rounded-3xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 p-4 text-white shadow-xl shadow-cyan-900/20 m-5 ">
        <p className="text-xs uppercase tracking-[0.3em] text-white/80">Live</p>
        <p className="mt-2 text-base font-semibold">Connected to the E-commerce API</p>
      </div>

    </aside>
  )
}
export default Sidebar;