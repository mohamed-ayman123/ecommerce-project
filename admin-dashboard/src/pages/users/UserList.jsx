import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers, deleteUsers } from '../../Api/users'
import{
    setUsersLoading,
    setUsers,
    setUsersError,
} from '../../store/slices/usersSlice'



const UserList = () => {
    const dispatch = useDispatch()
    const { items, isLoading, error} = useSelector(
        (state) => state.users
    )
    useEffect (() => {
        const fetchUsers = async () =>{
        try {
            dispatch ( setUsersLoading (true))
            const data = await getAllUsers ()
            dispatch(setUsers(data))
        } catch (error) {
            dispatch(setUsersError(error.message))
        }
    }
    fetchUsers()
    }, [])
    const handleDelete = async (id) => {
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