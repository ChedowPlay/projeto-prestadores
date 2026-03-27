/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";


import Button from "../Button";
import COLORS from "@/app/stylesheets/colors";
import { login } from "@/app/Pages/login/actions";
import styles from "@/app/stylesheets/LoginForm.module.css";
import { useAuthUser } from "@/app/context/UserDataContext";
import { useRouter } from "next/navigation";

type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
  success?: boolean;
  providerData?: any;
  token?: string; // Mudança 2 - Adicionado token ao tipo
};

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { loginContext: contextLogin } = useAuthUser(); // Mudança 3 - Usando o novo contexto

  const initialState: LoginState = {
    errors: {},
    message: undefined,
    success: false,
    providerData: null,
    token: undefined,
  };

  const [state, formAction] = useActionState<LoginState, FormData>(
    login,
    initialState
  );
  
  const { pending } = useFormStatus();

  // Mudança 4 - Efeito atualizado para usar o novo contexto
  useEffect(() => {
    if (state?.success && state?.providerData && state?.token) {
      contextLogin(state.token, state.providerData); // Atualiza o contexto unificado
      router.push("/Pages/loggedArea");
    }
  }, [state, router, contextLogin]); // Mudança 5 - Adicionado contextLogin nas dependências

  return (
  
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <div className={styles.title}>
            <h1>Bem vindo de volta!</h1>
            <h2>Acesse o seu portal</h2>
          </div>

          {state?.message && (
            <div className={styles.errorMessage}>{state.message}</div>
          )}

          <form action={formAction}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="seuemail@exemplo.com"
                name="email"
                required
                className={styles.input}
                aria-invalid={!!state?.errors?.email}
                aria-describedby="email-error"
              />
              {state?.errors?.email && (
                <p id="email-error" className={styles.error}>
                  {state.errors.email[0]}
                </p>
              )}

              <label htmlFor="password">Senha</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="********"
                  name="password"
                  required
                  className={styles.input}
                  aria-invalid={!!state?.errors?.password}
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {state?.errors?.password && (
                <p id="password-error" className={styles.error}>
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            <Button
              type="submit"
              color={COLORS.secondary}
              text={pending ? "Entrando..." : "Entrar"}
              className={styles.submitButton}
              disabled={pending}
            />
          </form>

          <div className={styles.footerLinks}>
            <button              
              type="button"
              className={styles.linkButton}
              onClick={() => router.push("/Pages/recuperarSenha")}
            >
              Esqueceu sua senha ?
            </button>

            <p className={styles.registerText}>
              Ainda não faz parte do clube?{" "}
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => router.push("/Pages/cadastrar")}
              >
                Cadastrar
              </button>
            </p>
          </div>
        </div>

        {pending && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}></div>
          </div>
        )}
      </div>
   
  );
};

export default LoginForm;
