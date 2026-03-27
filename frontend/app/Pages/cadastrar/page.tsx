'use client';

import Footer from "@/app/components/Section/Footer";
import NavbarComponent from "@/app/components/Navbar";
import React from "react";
import ThreeStepComponent from "@/app/components/threeStepComponent/ThreeStepComponent.";

const Cadastrar = () => {
  return (
      <div>
        <NavbarComponent isRegister={true} isLogged={false} isLogin={false} />  
        <ThreeStepComponent/>
        <Footer/>
      </div>
  );
};

export default Cadastrar;
