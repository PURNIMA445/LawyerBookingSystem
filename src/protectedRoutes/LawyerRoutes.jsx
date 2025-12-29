import React from 'react'
import { isLoggedIn } from '../api/userApi'
import { Navigate, Outlet } from 'react-router-dom'

const LawyerRoutes = () => {
    return (
        isLoggedIn() && isLoggedIn().role === 'lawyer' ? <Outlet /> : <Navigate to={'/login'} />)
}

export default LawyerRoutes