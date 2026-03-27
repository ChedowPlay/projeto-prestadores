import Button from "../../Button";
import COLORS from "@/app/stylesheets/colors";
import styles from "@/app/stylesheets/stepOne.module.css";

// import Image from "next/image";
// import { signIn } from "next-auth/react";


interface StepOneProps {
  nextStep: (data: { email: string; password: string; name: string }) => void;
}

export const StepOne = ({ nextStep }: StepOneProps) => {
 

  const handleContinue = () => {
    nextStep({ email: '', password: '', name: '' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.title}>
          <h1>Bem vindo ao Marca Modelo</h1>
          <h2>Crie sua conta para oferecer os seus serviços</h2>
        </div>

        <Button
          type="submit"
          color={COLORS.secondary}
          text="Continuar com email"
          className={styles.submitButton}
          onClick={handleContinue}
        />
        {/*<div className={styles.socialButtons}>
          <button  onClick={() =>
              signIn("facebook", { callbackUrl: '/Pages/planos' })
            }className={styles.facebook}>
            <Image src="/images/login/facebook.png" width={20} height={20} style={{ marginRight: 10 }} alt="Facebook Login" />
            Entrar com Facebook
          </button>
          <button onClick={() => {signIn('google', { callbackUrl: '/Pages/planos' })}}>
            <Image src="/images/login/google.png" width={20} height={20} style={{ marginRight: 10 }} alt="Google Login" />
            Entrar com Google
          </button>
        </div> */}
      </div>
      <div className={styles.cadastrar}>
        <p>
          Ao clicar, você está concordando com nossos <a href="#">Termos de Serviço</a> e <a href="#">Política de Privacidade.</a>
        </p>
      </div>
    </div>
  );
};
