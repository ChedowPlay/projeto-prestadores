"use client";

import COLORS from "@/app/stylesheets/colors";
import NavbarComponent from "../../components/Navbar";
import { useRouter } from "next/navigation";

const Settings = () => {
  const router = useRouter();

  return (
    <>
      <NavbarComponent isLogin={false} isLogged={true} isRegister={false} />
      <div className="container py-5">
        {/* Voltar */}
        <div className="mb-4 mt-5">
          <a
            onClick={() => { router.back() }}
            className="text-decoration-none text-dark fw-bold"
            style={{
              display: "inline-block",
              paddingTop: "10px",
              marginTop: "40px",
              backgroundColor: COLORS.white,
            }}
          >
            Voltar
          </a>
        </div>

        {/* Título */}
        <h1 className="mb-4 text-start">Configurações</h1>

        {/* Seção de Assinaturas */}
        <section className="mb-5">
          <h2 className="h4 mb-3">Assinaturas</h2>
          <div className="d-flex flex-column gap-3 align-items-start">
           
            <button
              onClick={() => router.push("/Pages/planos")}
              className="btn btn-outline-dark text-start px-4 py-2 mb-2 col-12 col-sm-8 col-md-5 col-lg-4"
            >
              Alterar Assinatura
            </button>  
            <button
              color={COLORS.white}
              onClick={() => {}}
              className="btn btn-outline-danger text-start px-4 py-2 mb-2 col-12 col-sm-8 col-md-5 col-lg-4"
            > 
            Cancelar Assinatura
             </button> 
          
          </div>
        </section>

        {/* Seção Geral */}
        <section className="mb-5">
          <h2 className="h4 mb-3">Geral</h2>
          <div className="d-flex flex-column gap-3 align-items-start">
            <button
              color={COLORS.white}
              onClick={() => router.push("/Pages/recuperarSenha")}
              className="btn btn-outline-secondary text-start px-4 py-2 mb-2 col-12 col-sm-8 col-md-5 col-lg-4"
            >
              Alterar Senha
            </button> 
            <button
              color={COLORS.white}
              onClick={() => {}}
              className="btn btn-outline-danger text-start px-4 py-2 mb-2 col-12 col-sm-8 col-md-5 col-lg-4"
            >
              Deletar Conta
            </button> 
            <button
              color={COLORS.white}
              onClick={() => router.push("/Pages/editarPerfil")}
              className="btn btn-outline-primary text-start px-4 py-2 mb-2 col-12 col-sm-8 col-md-5 col-lg-4"
            >
              Editar perfil
             </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Settings;
