import "react-toastify/dist/ReactToastify.css";

import { Eye, EyeSlash } from "@phosphor-icons/react";
import { ToastContainer, toast } from "react-toastify";
import { sendEmailToken, validateToken } from "@/app/Pages/cadastrar/actions";
import { useCallback, useEffect, useState } from "react";

import Button from "../../../../../components/Button";
import COLORS from "@/app/stylesheets/colors";
import Image from "next/image";
import styles from "@/app/stylesheets/stepThree.module.css";
import { useRouter } from "next/navigation";
import { validadePassword } from "./validatePassword";

interface StepThreeProps {
  email: string;
}

export const StepThree = ({ email }: StepThreeProps) => {
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(120);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    const passwordValidation = validadePassword(password);
    if (!passwordValidation.success) {
      setPasswordError(passwordValidation.error);
      setLoading(false);
      return;
    }
    const result = await validateToken(email, otp, password);
    if (result?.errors) {
      setError("Código inválido");
    } else {
      setError(null);
      router.push("/Pages/loggedArea");
    }
    setLoading(false);
  };

  const startTimer = useCallback(() => {
    if (timer) clearInterval(timer);
    const newTimer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(newTimer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    setTimer(newTimer);
  }, [timer]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timer!);
  }, [startTimer, timer]);

  const showToast = () => {
    toast.success("Email enviado com sucesso", {
      position: "bottom-center",
      autoClose: 2000,
      pauseOnHover: true,
      theme: "dark",
    });
  };

  const revalidateEmail = async () => {
    setTime(120);
    startTimer();
    sendEmailToken(email);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };

  return (
    <div className={styles.container}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
      <div className={styles.formWrapper}>
        <div className={styles.title}>
          <h1>Verifique seu e-mail</h1>
          <h2>
            Enviamos um código para {email}. Por favor, verifique e insira o
            código no campo abaixo para redefinir sua senha.
          </h2>
        </div>
        <div className={styles.dog}>
          <Image
            src="/images/cadastro/cadastro-dog.png"
            width={500}
            height={279}
            style={{ marginRight: 10 }}
            alt="Logo"
          />
        </div>
        <div className={styles.formGroup}>
          <p>Insira o código:</p>
          <input
            type="Otp"
            id="Otp"
            placeholder="000000"
            name="Otp"
            required
            className={styles.input}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {error && <h4 className={styles.error}>{error}</h4>}
          <div className={styles.formGroup}>
            <p>Nova Senha</p>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="********"
                name="password"
                required
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {passwordError && <h4 className={styles.error}>{passwordError}</h4>}

          <Button
            color={COLORS.secondary}
            text="Redefinir Senha"
            className={styles.submitButton}
            onClick={handleSubmit}
          />
          <Button
            color={COLORS.white}
            text="Enviar e-mail novamente"
            className={styles.submitButton}
            disabled={time > 0}
            onClick={() => {
              revalidateEmail();
              showToast();
            }}
          />
          {time > 0 ? (
            <div>Aguarde {formatTime(time)} para reenviar o e-mail</div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};
