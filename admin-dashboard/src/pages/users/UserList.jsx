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
        <div>
            <h1>Users</h1>
            <form onSubmit={handleAddUser}>
                <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                />
                <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                />

                <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                />

                <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                />

                <button type="submit">Add User</button>


            </form>
            <p>Total users: {items.length}</p>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((user) => {
                        <tr key={user.id}>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td><button onClick= {() => handleDelete(user.id)}> Delete
                                </button>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}
export default UserList