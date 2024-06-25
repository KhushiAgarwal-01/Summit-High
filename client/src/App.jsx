import React from 'react'
import { BrowserRouter,Route,Routes } from "react-router-dom";
import Home from './pages/Home'
import SignIn from './pages/Signin'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import About from './pages/About'
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import ListingCreate from './pages/ListingCreate';


function App() {
  return (
   <BrowserRouter>
   <Header />
    <Routes>
        <Route  path='/' element={<Home />}/>
        <Route  path='/Sign-in' element={<SignIn />}/>
        <Route  path='/Sign-up' element={<SignUp />}/>
        <Route  path='/About' element={<About />}/>
        <Route element={<PrivateRoute />}> 
        <Route  path='/Profile' element={<Profile />}/>
        <Route path='/create-listing' element={<ListingCreate />}/>
        </Route>

    </Routes> 
  
   </BrowserRouter>
  )
}

export default App
