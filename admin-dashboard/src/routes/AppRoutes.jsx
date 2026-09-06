import { Routes, Route } from 'react-router-dom'
function AppRoutes(){
    return(
        <>
            <Routes>
                <Route path='/dashboard' element={<h2>dashboard</h2>} />
                <Route path='/dashboard/products' element={<h2>Products</h2>} />
                <Route path='/dashboard/users' element={<h2>users</h2>} />                
                <Route path='/dashboard/products/new' element={<h2>add products</h2>} />
                <Route path='/dashboard/orders' element={<h2>orders</h2>} />
                <Route path='/dashboard/carts' element={<h2>carts</h2>} />
                <Route path='/dashboard/settings' element={<h2>settings</h2>} />
            </Routes>
        </>
    );
}
export default AppRoutes;