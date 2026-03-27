import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useActionState, useState } from "react";

import Button from "../../Button";
import COLORS from "@/app/stylesheets/colors";
import { register } from "@/app/Pages/cadastrar/actions";
import styles from "@/app/stylesheets/stepTwo.module.css";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { validadePassword } from "./validatePassword";

interface StepTwoProps {
  nextStep: (data: { email: string; password: string; name: string }) => void;
}

export const StepTwo = ({ nextStep }: StepTwoProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordConfirmError, setPasswordConfirmError] = useState<
    string | null
  >(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, registerAction] = useActionState(register, undefined);
  const [name, setName] = useState<string>("");
  const { pending } = useFormStatus();
  const [emailError, setEmailError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const passwordValidation = validadePassword(password);
    if (!passwordValidation.success) {
      setPasswordError(passwordValidation.error);
      return;
    }
    if (password !== passwordConfirm) {
      setPasswordConfirmError("As senhas não coincidem.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("name", name);

    const result = await register(state, formData);
    if (result?.errors) {
      setEmailError("Email já cadastrado");
    } else {
      nextStep({ email, password, name });
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
          <h1>Bem vindo ao Di Boa Club</h1>
          <h2>Crie sua conta para oferecer os seus serviços</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <p>Nome Completo</p>
            <input
              type="name"
              id="name"
              placeholder="Seu nome completo"
              name="name"
              value={name}
              required
              className={styles.input}
              onChange={(e) => setName(e.target.value)}
            />
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
            {emailError && <h4 className={styles.error}>{emailError}</h4>}
            <p>Senha</p>
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
            {passwordError && <h4 className={styles.error}>{passwordError}</h4>}
            <p>Confirme sua senha</p>
            <div className={styles.passwordWrapper}>
              <input
                type={showPasswordConfirm ? "text" : "password"}
                id="passwordConfirm"
                placeholder="********"
                name="passwordConfirm"
                required
                className={styles.input}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              >
                {showPasswordConfirm ? (
                  <EyeSlash size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
            {passwordConfirmError && (
              <h4 className={styles.error}>{passwordConfirmError}</h4>
            )}
          </div>
          <Button
            type="submit"
            color={COLORS.secondary}
            text="Continuar"
            className={styles.submitButton}
            disabled={pending}
          />
        </form>
      </div>
      <div className={styles.cadastrar}>
        <p>
          Já faz parte do clube?{" "}
          <a onClick={() => router.push("/Pages/login")}>Login</a>
        </p>
      </div>
    </div>
  );
};
