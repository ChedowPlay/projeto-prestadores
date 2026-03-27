import { Col, Row } from "react-bootstrap";

import Button from "@/app/components/Button";
import COLORS from "@/app/stylesheets/colors";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

const AboutSection = () => {
    const router = useRouter();

    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
          const offset = 80;
          const sectionPosition =
            section.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: sectionPosition, behavior: "smooth" });
        }
      };

    return (
        <section className="position-relative py-5 sobreColor text-white text-center">
            <div>
                <Row className="justify-content-center position-relative">
                    <Col xs={12} className="text-center mb-4">
                        <h2>Sobre o Di Boa Club</h2>
                    </Col>
                    <Col xs={12} md={10} lg={10} className="position-relative d-md-flex d-lg-block align-items-center">
                        {/* Texto para dispositivos maiores que tablet */}
                        <p className="text-dark text-justify p-3 bg-white border-black border-2 rounded shadow-bottom d-none d-lg-block d-md-none">
                        O Di Boa Club é uma plataforma inovadora que tem como objetivo aproximar clientes e profissionais qualificados em diversas áreas de serviço. Seja para pequenos reparos, reformas, assistência técnica, cuidados pessoais ou qualquer outra demanda, nossa missão é facilitar o encontro entre quem precisa de ajuda e quem está pronto para oferecer um atendimento de qualidade. Com poucos cliques, o usuário encontra profissionais de confiança, combina prazos e valores, tudo com segurança, agilidade e transparência. Incentivamos o profissionalismo e promovemos conexões que geram impacto positivo na vida das pessoas.
                        </p>
                        {/* Texto para tablets */}
                        <p className="text-white text-justify d-none d-md-block d-lg-none ">
                        O Di Boa Club é uma plataforma inovadora que tem como objetivo aproximar clientes e profissionais qualificados em diversas áreas de serviço. Seja para pequenos reparos, reformas, assistência técnica, cuidados pessoais ou qualquer outra demanda, nossa missão é facilitar o encontro entre quem precisa de ajuda e quem está pronto para oferecer um atendimento de qualidade. Com poucos cliques, o usuário encontra profissionais de confiança, combina prazos e valores, tudo com segurança, agilidade e transparência. Incentivamos o profissionalismo e promovemos conexões que geram impacto positivo na vida das pessoas.
                        </p>
                        {/* Texto para dispositivos móveis */}
                        <p className="text-white text-justify p-3 d-block d-md-none ">
                        O Di Boa Club é uma plataforma inovadora que tem como objetivo aproximar clientes e profissionais qualificados em diversas áreas de serviço. Seja para pequenos reparos, reformas, assistência técnica, cuidados pessoais ou qualquer outra demanda, nossa missão é facilitar o encontro entre quem precisa de ajuda e quem está pronto para oferecer um atendimento de qualidade. Com poucos cliques, o usuário encontra profissionais de confiança, combina prazos e valores, tudo com segurança, agilidade e transparência. Incentivamos o profissionalismo e promovemos conexões que geram impacto positivo na vida das pessoas.
                        </p>
                    </Col>
                    {/* Dog para dispositivos móveis */}
                    <div className="d-block d-md-none w-100 text-center mt-3">
                            <Image 
                                src="/images/AboutDog.png"
                                alt="About Dog"
                                width={200}
                                height={170}
                                className="mx-auto"
                            />
                        </div>
                        {/* Dog para tablets */}                        
                        <div className="d-none d-md-block d-lg-none ms-3">
                            <Image 
                                src="/images/AboutDog.png"
                                alt="About Dog"
                                width={250}
                                height={220}
                            />
                        </div>
                    <Col xs={12}  lg={10} className="mt-3">
                        <div className="d-flex flex-column flex-lg-row justify-content-center gap-3">
                            <Button className=" w-lg-auto botaoContratar" text="Quero contratar" color={COLORS.secondary}  onClick={()=>{scrollToSection("explorar");}}/>
                            <Button className="w-lg-auto botaoContratar" text="Quero ser contratado" color={COLORS.secondary} onClick={()=>{router.push("/Pages/cadastrar")}} />
                        </div>
                    </Col>
                </Row>
            </div>
        </section>
    );
};

export default AboutSection;
