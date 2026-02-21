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
import BookAppointment from './pages/BookAppointment'
import Lawyers from './pages/Lawyers'
import AppointmentDetails from './pages/lawyer/AppointmentDetails'
import UpdateProfile from './pages/lawyer/UpdateProfile'
import AdminLayout from './components/layout/AdminLayout'
import AdminUsers from './pages/admin/AdminUsers'
import AdminLawyers from './pages/admin/AdminLawyers'
import AdminAppointments from './pages/admin/AdminAppointments'
import AdminAdmins from './pages/admin/AdminAdmins'
import AdminLawyerProfile from './pages/LawyerProfile'
import AdminClientProfile from './pages/admin/ClientProfile'
import LawyerProfile from './pages/LawyerProfile'

const MyRoute = () => {
  return (

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<LandingPage />} />
          {/* <Route path='/home' element={<HomePage />} /> */}
          <Route path='/aboutus' element={<Aboutus />} />
          <Route path='/services' element={<Services />} />
          <Route path='/lawyers' element={<Lawyers />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/terms' element={<TermsAndConditions />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path="/services/:id" element={<ServiceDetailsPage />} />



          <Route path='/' element={<ClientRoutes />}>
            <Route path='profile' element={<Profile />} />
          </Route>

          <Route path='/lawyers/:lawyerId' element={<AdminLawyerProfile />} />
          <Route path='/bookappointment' element={<BookAppointment />} />
        </Route>

        <Route path='lawyer' element={<LawyerRoutes />}>
          <Route path='dashboard' element={<LawyerProfile />} />
          <Route path='appointments/:id' element={<AppointmentDetails />} />
          <Route path="profile/edit" element={<UpdateProfile />} />

        </Route>

        <Route path='/' element={<AdminRoutes />}>
          <Route path="admin" element={<AdminLayout />}>

            <Route path='dashboard' element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="lawyers" element={<AdminLawyers />} />
            <Route path='lawyers/:lawyerId' element={<AdminLawyerProfile />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="admins" element={<AdminAdmins />} />
            <Route path='clients/:clientId' element={<AdminClientProfile />} />

          </Route>
        </Route>


        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>

    </BrowserRouter>

  )
}

export default MyRoute