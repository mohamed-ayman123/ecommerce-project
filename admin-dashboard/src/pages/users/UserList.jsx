import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '../../Api/users'
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

     }
    }, [])
}