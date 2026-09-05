import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers, deleteUser, addAdminUser } from '../../Api/users'
import{
    setUsersLoading,
    setUsers,
    setUsersError,
} from '../../store/slices/usersSlice'



const UserList = () => {
    const dispatch = useDispatch()
    const [ formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    })
    const { items, isLoading, error} = useSelector(
        (state) => state.users
    )
    useEffect (() => {
        const fetchUsers = async () =>{
        try {
            dispatch ( setUsersLoading (true))
            const data = await getAllUsers ()
            console.log('USERS DATA:', data)
            dispatch(setUsers(data))
        } catch (error) {
            dispatch(setUsersError(error.message))
        }
    }
    fetchUsers()
    }, [])

    const handleChange = (e) => {
        const {name, value } = e.target

        setFormData ({
            ...formData,
            [name]: value,
        })
    }

    const handleAddUser = async (e) => {
        e.preventDefault()

        try{
            await addAdminUser ( formData )
            const data = await getAllUsers()
            dispatch(setUsers(data))

            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
            })
        } catch (error) {
            console.error(error)
        }
    }


    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this user?'
        )
        if (!confirmed) return
        try {
            await deleteUser(id)
            const data = await getAllUsers()
            dispatch(setUsers(data))
        } catch (error) {
            console.error (error)
        }
    }
    if (isLoading) {
        return <p>Loading users...</p>
    }
    if (error) {
        return <p> {error} </p>
    }
    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Users</h1>
            <p className="mt-1 text-sm sm:text-base text-[#334155]">
                Manage and view all registered users
            </p>
            </div>
            <form 
            onSubmit={handleAddUser} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-[#334155] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#EFF6FF]"
                />
                <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-[#334155] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#EFF6FF]"
                />

                <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-[#334155] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#EFF6FF]"
                />

                <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-[#334155] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#EFF6FF]"
                />
                </div>
                <button type="submit" className="mt-4 w-full sm:w-auto rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">Add User</button>


            </form>
            <div className="mb-4 flex items-center justify-between">
            <p className="text-sm sm:text-base font-medium text-[#33415]">
                Total users: {items.length}
                </p>
                </div>
                <div className="overflow-xauto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-[#EFF6FF] text-[#0F172A]">
                    <tr>
                        <th className="px-4 py-3 font-semibold">Name</th>
                        <th className="px-4 py-3 font-semibold">Email</th>
                        <th className="px-4 py-3 font-semibold">Role</th>
                        <th className="px-4 py-3 font-semibold">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((user) => {
                        <tr key={user.id} className="border-t border-slate-200 text-[#334155] transition hover:bg-[#F8FAFC">
                            <td className="px-4 py-3">{user.firstName} {user.lastName}</td>
                            <td className="px-4 py-3">{user.email}</td>
                            <td className="px-4 py-3">
                                <span className="inline-flex rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-medium text-[#2563EB]">
                                {user.role}
                                </span>
                                </td>
                            <td className="px-4 py-3"><button onClick= {() => handleDelete(user.id)}> Delete
                                </button>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
            </div>
        </div>
    )
}
export default UserList