import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";
import { useCallback, useEffect, useRef, useState } from "react";

import Button from "../../Button";
import COLORS from "@/app/stylesheets/colors";
import Image from "next/image";
import styles from "@/app/stylesheets/stepThree.module.css";
import { useAuthUser } from "@/app/context/UserDataContext";
import { useRouter } from "next/navigation";

interface StepThreeProps {
  formData: { email: string; password: string; name: string };
}

export const StepThree = ({ formData }: StepThreeProps) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(120);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { verifyOtp } = useAuthUser();

  const handleSubmit = async () => {
    if (!otp || otp.length < 6) {
      setError("Por favor, insira um código válido de 6 dígitos");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await verifyOtp(formData.email, otp, formData.password);

      if (result.success) {
        toast.success("Verificação concluída com sucesso!", {
          position: "bottom-center",
          autoClose: 2000,
          onClose: () => router.push("/Pages/planos"),
          theme: "dark",
        });
      } else {
        setError(result.error || "Código inválido. Tente novamente.");
      }
    } catch (error) {
      setError("Erro durante a verificação. Por favor, tente novamente.");
      console.error("Verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Timer para reenvio de OTP
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTimer]);

  const revalidateEmail = async () => {
    try {
      setTime(120);
      startTimer();
  
      // Obter o token dos cookies ou do estado da aplicação
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];
  
      // Preparar o corpo da requisição
      const bodyData: { email: string; token?: string } = {
        email: formData.email
      };
  
      // Adicionar o token apenas se existir
      if (token) {
        bodyData.token = token;
      }
  
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData) // Envia email + token (se existir)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Falha ao reenviar código");
      }
  
      toast.success("Novo código enviado com sucesso!", {
        position: "bottom-center",
        autoClose: 2000,
        theme: "dark",
      });
  
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao reenviar código. Tente novamente.",
        {
        position: "bottom-center",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
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
            Enviamos um código para {formData.email}. Por favor, verifique e
            insira o código abaixo para confirmar seu cadastro no Marca Modelo
          </h2>
        </div>

        <div className={styles.dog}>
          <Image
            src="/images/cadastro/cadastro-dog.png"
            width={500}
            height={279}
            alt="Ilustração de cachorro"
            priority
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="otp">Insira o código de 6 dígitos:</label>
          <input
            type="text" // Tipo text para permitir qualquer caractere
            id="otp"
            placeholder="Insira o código"
            name="otp"
            required
            className={styles.input}
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              setError(null); // Limpa erros ao digitar
            }}
            disabled={loading}
            maxLength={6} // Mantém o limite de 6 caracteres
            autoComplete="one-time-code" // Melhora a autocompletação em dispositivos móveis
          />

          {error && <p className={styles.error}>{error}</p>}

          <Button
            color={COLORS.secondary}
            text={loading ? "Verificando..." : "Continuar"}
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={loading || otp.length < 6}
          />

          <Button
            color={COLORS.white}
            text="Enviar código novamente"
            className={styles.submitButton}
            disabled={time > 0}
            onClick={revalidateEmail}
          />

          {time > 0 && (
            <p className={styles.timer}>
              Aguarde {formatTime(time)} para solicitar novo código
            </p>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};
