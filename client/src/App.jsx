import React from 'react'
import { BrowserRouter,Route,Routes } from "react-router-dom";
import Home from './pages/Home'
import SignIn from './pages/Signin'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import About from './pages/About'
import Header from './components/Header';


function App() {
  return (
   <BrowserRouter>
   <Header />
    <Routes>
        <Route  path='/' element={<Home />}/>
        <Route  path='/Sign-in' element={<SignIn />}/>
        <Route  path='/Sign-up' element={<SignUp />}/>
        <Route  path='/About' element={<About />}/>
        <Route  path='/Profile' element={<Profile />}/>
    </Routes> 
  
   </BrowserRouter>
  )
}

export default App
