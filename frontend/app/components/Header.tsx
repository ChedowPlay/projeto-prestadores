import BrandMark from "@/app/components/BrandMark";
import Button from "./Button";
import COLORS from "../stylesheets/colors";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className="my-4 container-fluid items-center">
      <nav className="container-fluid d-flex justify-between items-center col-10 justify-content-center gap-4 flex-wrap">
        <BrandMark onClick={() => router.push("/")} />

        <Link href="/" className="color-primary align-self-center text-decoration-none">
          <b>Home</b>
        </Link>

        <b className="align-self-center">Explorar serviços</b>
        <b className="align-self-center">Planos demo</b>
        <b className="align-self-center">Sobre a Marca Modelo</b>

        <div className="ms-2 d-flex flex-wrap gap-2">
          <Link href="/login">
            <Button text={"Fazer login"} color={COLORS.secondary} />
          </Link>

          <Link href="/register">
            <Button
              text={"Cadastrar"}
              color={COLORS.white}
              onClick={() => router.push("/Pages/cadastrar")}
            />
          </Link>
        </div>
      </nav>
    </header>
  );
}
