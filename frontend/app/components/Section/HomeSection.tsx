import Button from "../Button";
import COLORS from "@/app/stylesheets/colors";
import Image from "next/image";
import React from "react";
import WindowSize from "@/app/hooks/WindowSize";
import styles from "@/app/stylesheets/HomeSection.module.css";
import { useRouter } from "next/navigation";

const HomeSection = () => {
  const { width } = WindowSize();
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
    <>
      <section className={styles.homeSection}>
        {/* Cachorro */}
        <div className={styles.dog}>
          <div className={styles.adjustDog}></div>
          <Image
            src="/images/dog.png"
            alt="dog"
            className={styles.dog}
            width={417}
            height={417}
          />
        </div>

        {/* Texto Desktop e Tablet dentro da seção */}
        {width >= 700 && (
          <div className={styles.layoutContainer}>
            <div className={`${styles.desktopText} text-white`}>
              <h1 className={styles.Title}>
                <span className={styles.lineOne}>
                  Conheça Profissionais Prontos para
                </span>
                <span className={styles.lineTwo}>
                  Atender às suas Demandas!
                </span>
              </h1>
              <p className={styles.subTitle}>
                Seja qual for a tarefa, nós facilitamos para você.
              </p>
            </div>

            <div className={styles.ButtonsLayout}>
              <Button
                className={styles.buttons}
                text="Quero contratar"
                color={COLORS.secondary}
                onClick={() => {
                  scrollToSection("explorar");
                }}
              />
              <Button
                className={styles.buttons}
                text="Quero ser contratado"
                color={COLORS.secondary}
                onClick={() => {
                  router.push("/Pages/cadastrar");
                }}
              />
            </div>
          </div>
        )}
      </section>

      {/* Texto para Mobile fora da seção */}
      {width < 700 && (
        <div className={styles.mobileContainer}>
          <div className={`${styles.mobileText} text-center text-dark`}>
            <h1 className={styles.Title}>
              Encontre o Profissional Certo
              <br />
              <span>em Minutos!</span>
            </h1>
            <p className={styles.subTitle}>
              Conectamos você aos profissionais certos
              <span> para cada necessidade.</span>
            </p>
          </div>

          <div className={styles.ButtonsLayout}>
            <Button
              className={styles.buttons}
              text="Quero contratar"
              color={COLORS.secondary}
              onClick={() => {
                scrollToSection("explorar");
              }}
            />
            <Button
              className={styles.buttons}
              text="Quero ser contratado"
              color={COLORS.secondary}
              onClick={() => {
                router.push("/Pages/cadastrar");
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default HomeSection;
