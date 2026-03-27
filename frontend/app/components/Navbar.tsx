"use client";

import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

import BrandMark from "@/app/components/BrandMark";
import Button from "@/app/components/Button";
import COLORS from "../stylesheets/colors";
import Image from "next/image";
import { logout } from "../Pages/login/actions";
import styles from "@/app/stylesheets/Navbar.module.css";
import { useRouter } from "next/navigation";

interface NavbarComponentProps {
  isLogin?: boolean;
  isLogged?: boolean;
  profilePicture?: string;
  isRegister?: boolean;
}

const NavbarComponent = ({
  isLogin,
  isLogged,
  profilePicture,
  isRegister,
}: NavbarComponentProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const offset = 88;
      const sectionPosition =
        section.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: sectionPosition, behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const renderGuestNav = () => (
    <ul className={styles.nav}>
      <li>
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("home");
          }}
        >
          Home
        </a>
      </li>
      <li className={styles.separator}></li>
      <li>
        <a
          href="#explorar"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("explorar");
          }}
        >
          Explorar serviços
        </a>
      </li>
      <li className={styles.separator}></li>
      <li>
        <a
          href="#precos"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("precos");
          }}
        >
          Planos demo
        </a>
      </li>
      <li className={styles.separator}></li>
      <li>
        <a
          href="#sobre"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("sobre");
          }}
        >
          Sobre a Marca Modelo
        </a>
      </li>
      <li className={styles.separator}></li>
      <li>
        <a
          href="#faq"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("faq");
          }}
        >
          FAQ
        </a>
      </li>
      <li className={styles.separator}></li>
      <li>
        <Button
          text="Login"
          color={COLORS.secondary}
          className={styles.navButtonLogin}
          onClick={() => router.push("/Pages/login")}
        />
      </li>
      <li>
        <Button
          text="Cadastrar"
          color={COLORS.white}
          className={styles.navButtonCadastrar}
          onClick={() => router.push("/Pages/cadastrar")}
        />
      </li>
    </ul>
  );

  const renderLoggedNav = () => (
    <ul className={styles.nav}>
      <li>
        <a
          href="#explorar"
          onClick={(e) => {
            e.preventDefault();
            router.push("/Pages/loggedArea");
            setMenuOpen(false);
          }}
        >
          Explorar serviços
        </a>
      </li>
      <li className={styles.separator}></li>
      <li>
        <a
          href="#sobre"
          onClick={(e) => {
            e.preventDefault();
            router.push("/Pages/loggedArea#sobre");
            setMenuOpen(false);
          }}
        >
          Sobre a Marca Modelo
        </a>
      </li>
      <li className={styles.separator}></li>
      <li>
        <a
          href="#faq"
          onClick={(e) => {
            e.preventDefault();
            router.push("/Pages/loggedArea#faq");
            setMenuOpen(false);
          }}
        >
          FAQ
        </a>
      </li>
      <li className={styles.separator}></li>
      <li className={styles.userAvatarWrap}>
        <Image
          className={styles.userCircle}
          src={profilePicture ? profilePicture : "/user-circle.svg"}
          alt="Avatar do usuário"
          width={36}
          height={36}
        />
      </li>
      <li>
        <Button
          text="Configurações"
          color={COLORS.secondary}
          className={styles.navButtonLogin}
          onClick={() => router.push("/Pages/settings")}
        />
      </li>
      <li>
        <Button
          text="Sair"
          color={COLORS.white}
          className={styles.navButtonLogin}
          onClick={logout}
        />
      </li>
    </ul>
  );

  const renderSimpleNav = (isLoginView = false) => (
    <ul className={styles.nav}>
      <li>
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            router.push("/");
            setMenuOpen(false);
          }}
        >
          Home
        </a>
      </li>
      <li className={styles.separator}></li>
      <li>
        <Button
          text={isLoginView ? "Cadastrar" : "Login"}
          color={isLoginView ? COLORS.white : COLORS.secondary}
          className={
            isLoginView ? styles.navButtonCadastrar : styles.navButtonLogin
          }
          onClick={() =>
            router.push(isLoginView ? "/Pages/cadastrar" : "/Pages/login")
          }
        />
      </li>
    </ul>
  );

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.container} ${isLogin ? styles.containerLogin : ""}`}>
        <BrandMark
          onClick={() => router.push("/")}
          className={styles.brandAnchor}
        />

        <button
          className={`${styles.menuToggle} ${menuOpen ? styles.hide : ""}`}
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <FiMenu size={28} />
        </button>

        <div className={`${styles.navCollapse} ${menuOpen ? styles.show : ""}`}>
          <button
            className={styles.closeMenu}
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <FiX size={28} />
          </button>

          {!isRegister && !isLogin && !isLogged && renderGuestNav()}
          {!isRegister && !isLogin && isLogged && renderLoggedNav()}
          {!isRegister && isLogin && !isLogged && renderSimpleNav(true)}
          {isRegister && !isLogin && !isLogged && renderSimpleNav(false)}
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
