import { useEffect, useState } from "react";
import { getAdminActiveCarts } from "../../api/carts"; 


export default function Carts() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        if (!user) {
          setError("User not found");
          setLoading(false);
          return;
        }

        const data = await getAdminActiveCarts();

        if (!data || data.length === 0) {
          setError("No carts returned from the API");
          setLoading(false);
          return;
        }

        setCarts(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch carts");
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  return (
   
    <div className="w-full  ">
      <div className="bg-white p-6 md:p-6 rounded-3xl border border-gray-300 shadow-lg mb-4 w-full">
        <span className="text-[#2dd4bf] text-sm tracking-[0.5em] uppercase block mb-2">
          Carts
        </span>
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Cart overview</h1>
        <p className="text-gray-500 text-sm">
          All active carts returned from the API are rendered here with their latest item details.
        </p>
      </div>

    
      <div className="w-full">
        {loading && (
          <div className="bg-white p-6 rounded-2xl border border-gray-400 text-slate-500 text-sm max-w-md animate-pulse">
            Loading active carts…
          </div>
        )}

        {error && (
          <div className=" p-6 rounded-3xl border border-dashed border-gray-400 text-slate-500 text-sm max-w-md">
            {error}
          </div>
        )}

        
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 w-full">
            {carts.map((cart) => (
              <div key={cart._id || cart.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full">
                <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-3">
                  <h2 className="text-base font-semibold text-slate-800">
                    Cart ID: <span className="text-gray-500 font-normal">{cart._id || cart.id}</span>
                  </h2>
                  <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">
                    Active
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {cart.items?.map((item) => (
                    <div key={item._id || item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                      <img
                        src={item.image || "https://placeholder.com"}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-100 bg-slate-50"
                      />

                      <div className="flex-1">
                        <h3 className="font-medium text-slate-800 text-sm mb-0.5">{item.title}</h3>
                        <p className="text-slate-400 text-xs">${item.price}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-slate-700 text-sm font-semibold block">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-xs text-slate-400 block mt-0.5">
                          Total: ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}