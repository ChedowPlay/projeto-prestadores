"use client";

import Footer from "@/app/components/Section/Footer";
import NavbarComponent from "@/app/components/Navbar";
import ThreeStepComponentPassword from "./utils/threeStepComponent/ThreeStepComponentPassword";

export default function RecuperarSenha() {
  return (
    <>
    <div>
        <NavbarComponent isLogin={true} isLogged={false} />  
        <ThreeStepComponentPassword/>
        <Footer/>
      </div>
    </>
  )
}
