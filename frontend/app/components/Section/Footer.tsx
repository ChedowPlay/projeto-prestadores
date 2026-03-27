import { Col, Row } from "react-bootstrap";

import Facebook from "@/public/images/Facebook.png";
import Image from "next/image";
import Instagram from "@/public/images/Instagram.png";
import Linkedin from "@/public/images/Linkedin.png";
import styles from "@/app/stylesheets/Footer.module.css";

const Footer = () => {
    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
          const offset = 80; 
          const sectionPosition = section.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: sectionPosition, behavior: "smooth" });
        }
      };

    return (
        <footer className={`${styles.footer} bg-white py-4 py-md-5`}>
            <div >
                <Row className="align-items-end
                 text-center text-md-start">
                    {/* Logo + Ícones de Redes Sociais */}
                    <Col xs={12} md={3} className="ps-0 d-flex ms-2 flex-column align-items-start align-items-md-start">
                        <Image
                            src="/Logo_DiBoa.svg"
                            alt="Di Boa Logo"
                            width={60}
                            height={66}
                        />
                        <div className="d-flex justify-content-center gap-3 mt-5">
                            <a 
                                href="https://www.instagram.com" 
                                target="_blank" 
                                rel="noopener noreferrer">
                                <Image src={Instagram} alt="Instagram" width={28} height={25} />
                            </a>
                            <a 
                                href="https://www.linkedin.com" 
                                target="_blank" 
                                rel="noopener noreferrer">
                                <Image src={Linkedin} alt="Linkedin" width={25} height={25} />
                            </a>
                            <a 
                                href="https://www.facebook.com" 
                                target="_blank" 
                                rel="noopener noreferrer">
                                <Image src={Facebook} alt="Facebook" width={25} height={25} />
                            </a>
                        </div>
                    </Col>

                    {/* Links de Navegação */}
                    <Col xs={12} md={6} className={`${styles.navLinks} mb-4 mb-md-0`}>
                        <nav className="d-flex flex-column flex-md-row flex-wrap justify-content-center align-middle justify-content-md-end gap-3 gap-md-3">
                            <a 
                            href="#sobre" 
                            className={`${styles.navLink} text-dark`}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection("sobre");
                              }}
                            >
                                Sobre Nós
                            </a>
                            <a 
                            href="#explorar" 
                            className={`${styles.navLink} text-dark`}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection("explorar");
                              }}
                            >
                                Ofereça seu Serviço
                            </a>
                            <a 
                            href="#precos" 
                            className={`${styles.navLink} text-dark`}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection("precos");
                              }}
                            >
                                Plano e Valor
                            </a>
                            <a href="#" className={`${styles.navLink} text-dark`}>Contato</a>
                        </nav>
                    </Col>
                </Row>

                <hr className={`${styles.divider} my-3 my-md-4`} />

                {/* Links Legais */}
                <Row className="text-center">
                    <Col>
                        <div className={`${styles.legalLinks} d-flex flex-column flex-md-row justify-content-between align-items-center gap-2`}>
                            <a 
                                href="/Política de Uso e Privacidade Diboa.pdf" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.legalLink} text-muted`} 
                            >
                                Política e Termos de Uso
                            </a>
                            <p className={`${styles.copyright} text-muted mb-0`}>© 2025 Di Boa Club</p>
                        </div>
                    </Col>
                </Row>
            </div>
        </footer>
    );
};

export default Footer;
