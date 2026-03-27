import { FiArrowRight, FiCheckCircle, FiPlayCircle } from "react-icons/fi";

import Button from "../Button";
import COLORS from "@/app/stylesheets/colors";
import React from "react";
import styles from "@/app/stylesheets/HomeSection.module.css";
import { useRouter } from "next/navigation";

const highlights = [
  "Interface mais limpa e intuitiva",
  "Experiência com navegação fluida",
  "Apresentação pronta para demonstração",
];

const HomeSection = () => {
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

  return (
    <section className={styles.homeSection}>
      <div className={styles.heroCard}>
        <div className={styles.copyColumn}>
          <span className={styles.badge}>Marca Modelo • demo</span>
          <h1 className={styles.title}>
            Uma experiência mais moderna, simples e pronta para apresentar.
          </h1>
          <p className={styles.subTitle}>
            Reposicionamos o projeto como uma demo com visual mais leve,
            navegação mais agradável e foco total na descoberta de serviços.
          </p>

          <div className={styles.highlightList}>
            {highlights.map((item) => (
              <div key={item} className={styles.highlightItem}>
                <FiCheckCircle size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className={styles.buttonsLayout}>
            <Button
              className={styles.primaryButton}
              text={
                <span className={styles.buttonContent}>
                  Explorar demo <FiArrowRight size={16} />
                </span>
              }
              color={COLORS.secondary}
              onClick={() => scrollToSection("explorar")}
            />
            <Button
              className={styles.secondaryButton}
              text="Quero participar"
              color={COLORS.white}
              onClick={() => router.push("/Pages/cadastrar")}
            />
          </div>
        </div>

        <div className={styles.previewColumn}>
          <div className={styles.previewShell}>
            <div className={styles.previewHeader}>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className={styles.previewHero}>
              <div>
                <small>Fluxo principal</small>
                <strong>Busca, comparação e contato em poucos passos</strong>
              </div>
              <div className={styles.previewPlay}>
                <FiPlayCircle size={22} />
                <span>demo</span>
              </div>
            </div>

            <div className={styles.previewMetrics}>
              <article>
                <strong>+ fluidez</strong>
                <span>transições suaves entre estados e seções</span>
              </article>
              <article>
                <strong>+ clareza</strong>
                <span>hierarquia visual mais objetiva e moderna</span>
              </article>
              <article>
                <strong>+ foco</strong>
                <span>chamadas principais priorizadas para conversão</span>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
