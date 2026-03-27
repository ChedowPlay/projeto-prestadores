'use client';

import Footer from "@/app/components/Section/Footer";
import LoginForm from "@/app/components/LoginForm/LoginForm";
import NavbarComponent from "@/app/components/Navbar";
import React from "react";

const LoginPage = () => {
  
  return (
    <div>
      <NavbarComponent isLogin={true} isLogged={false} />  
      <LoginForm/>
      <Footer/>
    </div>
  );
};

export default LoginPage;
