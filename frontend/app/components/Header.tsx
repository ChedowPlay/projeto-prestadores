import Button from "./Button";
import COLORS from "../stylesheets/colors";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  return (
    <header className="my-4 container-fluid items-center">
      <nav className="container-fluid d-flex justify-between items-center col-9 justify-content-center">
        <div className="flex items-center me-5">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={42}
            height={46}
            className="me-4"
          />
        </div>

        <Link href="/" className="color-primary me-5 align-self-center">
          <b>Home</b>
        </Link>

        <b className="align-self-center me-5">Explorar Serviços</b>
        <b className="align-self-center me-5">Preços e Assinaturas</b>
        <b className="align-self-center me-5">Sobre o Di Boa</b>

        <div className="ms-2">
          <Link href="/login">
            <Button text={"Fazer Login"} color={COLORS.secondary} />
          </Link>

          <Link href="/register">
            <Button text={"Cadastrar"} color={COLORS.white} onClick={()=>router.push("/Pages/cadastrar")} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
