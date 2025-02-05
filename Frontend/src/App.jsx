import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import MainNavBar from './Components/MainNavBar';
import Footer from './Components/Footer';

function App() {


  return (
    <div className="">
      <MainNavBar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;