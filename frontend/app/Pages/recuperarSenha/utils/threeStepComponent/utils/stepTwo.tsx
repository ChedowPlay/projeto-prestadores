import Button from "../../../../../components/Button";
import COLORS from "@/app/stylesheets/colors";
import { sendEmailToken } from "@/app/Pages/cadastrar/actions";
import styles from "@/app/stylesheets/stepTwo.module.css";
import { useState } from "react";

interface StepTwoProps {
  nextStep: (data: { email: string }) => void;
}

export const StepTwo = ({ nextStep }: StepTwoProps) => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (email !== "") {
      await sendEmailToken(email);
      nextStep({ email });
    }
    setLoading(false);
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
          <h1>Recuperar Senha</h1>
          <h2>Confirme seu email</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <p>Email</p>
            <input
              type="email"
              id="email"
              placeholder="seuemail@exemplo.com"
              name="email"
              required
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            color={COLORS.secondary}
            text="Continuar"
            className={styles.submitButton}
          />
        </form>
      </div>
    </div>
  );
};
