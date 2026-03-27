import { Col, Row } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

import BrandMark from "@/app/components/BrandMark";
import styles from "@/app/stylesheets/Footer.module.css";

const Footer = () => {
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const offset = 88;
      const sectionPosition =
        section.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: sectionPosition, behavior: "smooth" });
    }
  };

  return (
    <footer className={`${styles.footer} py-4 py-md-5`}>
      <div className={styles.innerShell}>
        <Row className="align-items-end text-center text-md-start g-4">
          <Col xs={12} md={4} className="d-flex flex-column align-items-start">
            <BrandMark subtitle="apresentação da plataforma" />
            <p className={styles.footerText}>
              Projeto reposicionado como demo, com foco em clareza visual,
              navegação fluida e apresentação moderna.
            </p>
            <div className="d-flex justify-content-center gap-3 mt-3">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FaInstagram />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FaLinkedinIn />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FaFacebookF />
              </a>
            </div>
          </Col>

          <Col xs={12} md={8} className={`${styles.navLinks} mb-4 mb-md-0`}>
            <nav className="d-flex flex-column flex-md-row flex-wrap justify-content-center justify-content-md-end gap-3">
              <a
                href="#sobre"
                className={styles.navLink}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("sobre");
                }}
              >
                Sobre a demo
              </a>
              <a
                href="#explorar"
                className={styles.navLink}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("explorar");
                }}
              >
                Explorar serviços
              </a>
              <a
                href="#precos"
                className={styles.navLink}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("precos");
                }}
              >
                Planos demo
              </a>
              <a
                href="#faq"
                className={styles.navLink}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("faq");
                }}
              >
                FAQ
              </a>
            </nav>
          </Col>
        </Row>

        <hr className={`${styles.divider} my-3 my-md-4`} />

        <Row className="text-center">
          <Col>
            <div className={`${styles.legalLinks} d-flex flex-column flex-md-row justify-content-between align-items-center gap-2`}>
              <a
                href="#sobre"
                className={styles.legalLink}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("sobre");
                }}
              >
                Condições de uso desta demo
              </a>
              <p className={`${styles.copyright} mb-0`}>
                © 2026 Marca Modelo • demonstração visual
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;
