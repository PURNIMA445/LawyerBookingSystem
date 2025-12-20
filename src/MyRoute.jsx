import React from 'react'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Layout from './components/layout/Layout'
const MyRoute = () => {
  return (
    <BrowserRouter>
        <Routes>
             <Route path='/' element={<Layout />}>
            <Route index element={<HomePage/>}></Route>
            {/* <Route path='/first' element={<First />}></Route>
            <Route path='/second' element={<Second/>}></Route>
            <Route path='/third/:name' element={<Third/>}></Route>
            <Route path='*' element={<NotFound />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/register' element={<Register/>}></Route> */}
            </Route> 
        </Routes>
    
    </BrowserRouter>
  )
}

export default MyRoute