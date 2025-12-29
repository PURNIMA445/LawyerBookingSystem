import React from 'react'
import { isLoggedIn } from '../api/userApi'
import { Navigate, Outlet } from 'react-router-dom'

const AdminRoutes = () => {
    return (
        isLoggedIn() && isLoggedIn().role === 'admin' ? <Outlet /> : <Navigate to={'/login'} />)
}

export default AdminRoutes