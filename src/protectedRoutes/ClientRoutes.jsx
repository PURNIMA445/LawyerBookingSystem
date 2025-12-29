import React from 'react'
import { isLoggedIn } from '../api/userApi'
import { Navigate, Outlet } from 'react-router-dom'

const ClientRoutes = () => {
    return (
        isLoggedIn() && isLoggedIn().role === 'client' ? <Outlet /> : <Navigate to={'/login'} />)
}

export default ClientRoutes