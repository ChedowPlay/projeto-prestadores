"use client";

import { FiMenu, FiX } from "react-icons/fi";

import Button from "@/app/components/Button";
import COLORS from "../stylesheets/colors";
import Image from "next/image";
import { logout } from "../Pages/login/actions";
import styles from "@/app/stylesheets/Navbar.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const offset = 80;
      const sectionPosition =
        section.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: sectionPosition, behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  // const handleNavigation = (sectionId: string) => {
  //   if (window.location.pathname === "/") {
  //     scrollToSection(sectionId);
  //   } else {
  //     router.push("/");
  //     setTimeout(() => {
  //       scrollToSection(sectionId);
  //     }, 500);
  //   }
  // };

  // const handleSettings = () => {
  //   router.push("/settings");
  // };

  return (
    <>
      {!isRegister && !isLogin && !isLogged && (
        <>
          <nav className={styles.navbar}>
            <div className={styles.container}>
              {/* Logo */}
              <Image
                className={styles.logo_DiBoa}
                src="/Logo_DiBoa.svg"
                alt="Di Boa Logo"
                width={42}
                height={46}
              />

              {/* Hamburger Button */}
              <button
                className={styles.closeMenu}
                onClick={() => setMenuOpen(true)}
                aria-label="Open Menu"
              >
                <FiMenu size={28} />
              </button>

              {/* Collapsible Menu */}
              <div
                className={`${styles.navCollapse} ${
                  menuOpen ? styles.show : ""
                }`}
              >
                <button
                  className={styles.closeMenu}
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close Menu"
                >
                  <FiX size={28} />
                </button>

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
                      Explorar Serviços
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
                      Preços e Assinaturas
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
                      Sobre o Di Boa
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
              </div>
            </div>
          </nav>
        </>
      )}

      {!isRegister && !isLogin && isLogged && (
        <>
          <nav className={styles.navbar}>
            <div className={styles.container}>
              {/* Logo */}
              <Image
                className={styles.logo_DiBoa}
                src="/Logo_DiBoa.svg"
                alt="Di Boa Logo"
                width={42}
                height={46}
              />

              {/* Hamburger Button */}
              <button
                className={styles.closeMenu}
                onClick={() => setMenuOpen(true)}
                aria-label="Close Menu"
              >
                <FiMenu size={28} />
              </button>

              {/* Collapsible Menu */}
              <div
                className={`${styles.navCollapse} ${
                  menuOpen ? styles.show : ""
                }`}
              >
                <button
                  className={styles.closeMenu}
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close Menu"
                >
                  <FiX size={28} />
                </button>

                <ul className={styles.nav}>
                  <li>
                    <a
                      href="#explorar"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push("/Pages/loggedArea");
                      }}
                    >
                      Explorar Serviços
                    </a>
                  </li>
                  <li className={styles.separator}></li>
                  <li>
                    <a
                      href="#sobre"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push("/Pages/loggedArea#sobre");
                      }}
                    >
                      Sobre o Di Boa
                    </a>
                  </li>
                  <li className={styles.separator}></li>
                  <li>
                    <a
                      href="#faq"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push("/Pages/loggedArea#faq");
                      }}
                    >
                      FAQ
                    </a>
                    
                  </li>
                  <li>
                  </li>
                  <li className={styles.separator}></li>
                  <li>
                    <Image
                      className={styles.userCircle}
                      src={profilePicture ? profilePicture : "/user-circle.svg"}
                      alt="User Icon"
                      width={32}
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
              </div>
            </div>
          </nav>
        </>
      )}

      {!isRegister && isLogin && !isLogged && (
        <nav className={styles.navbar}>
          <div className={styles.container_login}>
            {/* Logo */}

            <Image
              className={styles.logo_DiBoa_login}
              src="/Logo_DiBoa.svg"
              alt="Di Boa Logo"
              width={42}
              height={46}
            />

            {/* Hamburger Button */}
            <button
              className={`${styles.hamburger} ${menuOpen ? styles.hide : ""}`}
              onClick={toggleMenu}
              aria-label="Open Menu"
            >
              <FiMenu size={30} />
            </button>

            {/* Collapsible Menu */}
            <div
              className={`${styles.navCollapse} ${menuOpen ? styles.show : ""}`}
            >
              <button
                className={styles.closeMenu}
                onClick={() => setMenuOpen(false)}
                aria-label="Close Menu"
              >
                <FiX size={28} />
              </button>

              <ul className={styles.nav}>
                <li>
                  <a
                    href="#home"
                    onClick={() => {
                      router.push("/");
                    }}
                  >
                    Home
                  </a>
                </li>

                <li className={styles.separator}></li>
                <li>
                  <Button
                    text="Cadastrar"
                    color={COLORS.white}
                    className={styles.navButtonCadastrar}
                    onClick={() => router.push("/Pages/cadastrar")}
                  />
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}

      {isRegister && !isLogin && !isLogged && (
        <>
          <nav className={styles.navbar}>
            <div className={styles.container}>
              {/* Logo */}
              <Image
                className={styles.logo_DiBoa}
                src="/Logo_DiBoa.svg"
                alt="Di Boa Logo"
                width={42}
                height={46}
              />

              {/* Hamburger Button */}
              <button
                className={styles.closeMenu}
                onClick={() => setMenuOpen(false)}
                aria-label="Close Menu"
              >
                <FiX size={28} />
              </button>

              {/* Collapsible Menu */}
              <div
                className={`${styles.navCollapse} ${
                  menuOpen ? styles.show : ""
                }`}
              >
                <button
                  className={styles.closeMenu}
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close Menu"
                >
                  <FiX size={28} />
                </button>
                <ul className={styles.nav}>
                  <li>
                    <a
                      onClick={() => {
                        router.push("/");
                      }}
                    >
                      Home
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
                </ul>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
};

export default NavbarComponent;
