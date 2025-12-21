import React from 'react'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Layout from './components/layout/Layout'
import Aboutus from './pages/Aboutus'
const MyRoute = () => {
  return (
    <BrowserRouter>
        <Routes>
             <Route path='/' element={<Layout />}>
            <Route index element={<HomePage/>}></Route>
             <Route path='/aboutus' element={<Aboutus />}></Route>
            </Route> 
        </Routes>
    
    </BrowserRouter>
  )
}

export default MyRoute