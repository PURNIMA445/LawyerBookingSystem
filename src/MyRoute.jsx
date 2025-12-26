import React from 'react'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
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
const MyRoute = () => {
  return (
    <BrowserRouter>
        <Routes>
             <Route path='/' element={<Layout />}>
            <Route index element={<LandingPage/>}></Route>
            <Route path='/home' element={<HomePage/>}></Route>
             <Route path='/aboutus' element={<Aboutus />}></Route>
             <Route path='/services' element={<Services />}></Route>
             <Route path='/faq' element={<FAQ/>}></Route>
             <Route path='/contact' element={<Contact/>}></Route>
             <Route path='/terms' element={<TermsAndConditions/>}></Route>
             <Route path='/login' element={<Login/>}></Route>
             <Route path='/signup' element={<SignUp />}></Route>
            </Route> 
        </Routes>
    
    </BrowserRouter>
  )
}

export default MyRoute