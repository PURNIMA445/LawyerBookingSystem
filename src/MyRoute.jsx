import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Layout from './components/layout/Layout'
import Aboutus from './pages/Aboutus'
import Services from './pages/services'
import FAQ from './pages/Faq'
import Contact from './pages/Contact'
import TermsAndConditions from './pages/TermsCondition'
import LandingPage from './pages/LandingPage'
import Login from './pages/login'

import SignUp from './pages/signup'
import AdminRoutes from './protectedRoutes/AdminRoutes'
import AdminDashboard from './pages/admin/AdminDashboard'
import ClientRoutes from './protectedRoutes/ClientRoutes'
import Profile from './pages/clients/Profile'
import LawyerRoutes from './protectedRoutes/LawyerRoutes'
import LawyerDashboard from './pages/lawyer/LawyerDashboard'
import ServiceDetailsPage from './pages/ServiceDetailsPage'
import Dashboard from './pages/Dashboard'
import ClientProfile from './pages/ClientProfile'
import LawyerProfile from './pages/LawyerProfile'
import BookAppointment from './pages/BookAppointment'

const MyRoute = () => {
  return (
   
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/aboutus' element={<Aboutus />} />
          <Route path='/services' element={<Services />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/terms' element={<TermsAndConditions />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path="/services/:id" element={<ServiceDetailsPage />} />
          
          <Route path='admin' element={<AdminRoutes />}>

            <Route path='dashboard' element={<AdminDashboard />} />
          </Route>
          <Route path='/' element={<ClientRoutes />}>
            <Route path='profile' element={<Profile />} />
          </Route>
          <Route path='lawyer' element={<LawyerRoutes />}>
            <Route path='dashboard' element={<LawyerDashboard />} />
          </Route>
        </Route>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/clientprofile' element={<ClientProfile />} />
        <Route path='/lawyerprofile' element={<LawyerProfile />} />
        <Route path='/bookappointment' element={<BookAppointment />} />
      </Routes>

    </BrowserRouter>
    
  )
}

export default MyRoute