import { Col, Row } from "react-bootstrap";
import { FiCheckCircle, FiLayers, FiZap } from "react-icons/fi";

import Button from "@/app/components/Button";
import COLORS from "@/app/stylesheets/colors";
import React from "react";
import { useRouter } from "next/navigation";

const AboutSection = () => {
  const router = useRouter();

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const offset = 88;
      const sectionPosition =
        section.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: sectionPosition, behavior: "smooth" });
    }
  };

  const highlights = [
    "Reposicionamento da marca como demo",
    "Visual mais moderno e simples",
    "Transições suaves e sensação de fluidez",
  ];

  return (
    <section className="position-relative py-5 sobreColor text-white text-center">
      <div className="container">
        <Row className="justify-content-center position-relative g-4">
          <Col xs={12} className="text-center mb-2">
            <h2>Sobre a Marca Modelo</h2>
            <p className="text-white-50 mx-auto" style={{ maxWidth: 760 }}>
              A Marca Modelo agora apresenta o projeto em formato demonstrativo,
              valorizando clareza, modernidade e uma navegação mais leve.
            </p>
          </Col>

          <Col xs={12} lg={7}>
            <div className="text-dark text-start p-4 bg-white border-0 rounded-4 shadow-lg h-100">
              <p className="mb-3">
                A proposta da Marca Modelo é aproximar clientes e profissionais de
                forma intuitiva, com uma experiência visual mais atual e orientada
                à apresentação do produto.
              </p>
              <p className="mb-0">
                Nesta versão, o foco está em comunicar valor rapidamente, guiar o
                usuário pelas principais ações e criar uma jornada mais agradável
                para explorar serviços, comparar planos e entender a solução.
              </p>
            </div>
          </Col>

          <Col xs={12} lg={5}>
            <div className="p-4 rounded-4 border border-light-subtle bg-white bg-opacity-10 h-100 text-start">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FiZap />
                <strong className="text-white">O que mudou nesta demo</strong>
              </div>
              <div className="d-grid gap-3">
                {highlights.map((item, index) => (
                  <div key={item} className="d-flex align-items-start gap-2">
                    {index === 1 ? <FiLayers className="mt-1" /> : <FiCheckCircle className="mt-1" />}
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          <Col xs={12} lg={10} className="mt-3">
            <div className="d-flex flex-column flex-lg-row justify-content-center gap-3">
              <Button className="w-lg-auto botaoContratar" text="Explorar serviços" color={COLORS.secondary} onClick={() => scrollToSection("explorar")} />
              <Button className="w-lg-auto botaoContratar" text="Quero participar" color={COLORS.secondary} onClick={() => router.push("/Pages/cadastrar")} />
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default AboutSection;
