/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";

import Button from "@/app/components/Button";
import COLORS from "../../stylesheets/colors";
import { CheckFat } from "@phosphor-icons/react";
import { Form } from "react-bootstrap";
import Loading from "@/app/components/Loading";
import { logout } from "../login/actions";
import styles from "../../stylesheets/PlanosPage.module.css";
import { useAuthUser } from "@/app/context/UserDataContext";
import { useRouter } from "next/navigation";

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  plan_id: string;
}

export default function PlanosPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { user, isAuthenticated } = useAuthUser();
  const API_URL = process.env.API_URL;
  // Busca os planos disponíveis
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `${API_URL}/api/plan`
        );

        if (!response.ok) {
          throw new Error("Falha ao carregar planos");
        }

        const data = await response.json();

        // Verifica se os planos têm IDs válidos
        setPlans(
          data.map((plan: Plan, index: number) => ({
            ...plan,
            id: plan.id || `temp-id-${index}`,
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePayment = async () => {
    if (!selectedPlan) {
      setError("Por favor, selecione um plano");
      return;
    }

    if (!isAuthenticated || !user) {
      setError("Por favor, faça login para continuar");
      router.push("/Pages/login");
      return;
    }

    setPaymentLoading(true);
    setError(null);

    try {
      const token = user.token;

      if (!token) {
        throw new Error("Sua sessão expirou. Por favor, faça login novamente.");
      }

      const response = await fetch(
        `${API_URL}/api/payment/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan_id: selectedPlan.plan_id,
          }),
        }
      );

      // Verifica se a resposta foi bem sucedida
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao processar pagamento");
      }

      const data = await response.json();
      if (!data.checkout) {
        throw new Error("URL de pagamento não disponível");
      }

      // Redireciona para a página de pagamento do Mercado Pago
      router.push(data.checkout);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao processar pagamento";
      setError(errorMessage);

      // Se for erro de autenticação, força logout
      if (errorMessage.includes("sessão expirou")) {
        logout();
        router.push("/Pages/login");
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Loading />
      </div>
    );
  }
  return (
    <div className={`${styles.container} py-5`}>
      <div className="text-center mb-5">
        <h2 className="mb-4">Escolha seu plano</h2>

        <ul className="list-unstyled text-start mb-4">
          {[
            "Ofereça seus serviços e habilidades",
            "Encontre clientes rapidamente",
            "De maneira eficiente e com apresentação moderna!",
          ].map((item, index) => (
            <li
              key={`benefit-${index}`}
              className="py-2 d-flex align-items-center"
            >
              <CheckFat
                size={16}
                color={COLORS.primary}
                weight="fill"
                className="me-2"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="row justify-content-center">
  {plans.map((plan) => {
    const isSelected = selectedPlan?.id === plan.id;

    return (
      <div key={plan.id} className="col-md-6 col-lg-4 mb-4">
        <div
          className={`card p-4 h-100 border-2 cursor-pointer ${
            isSelected ? "border-primary bg-light" : "border-light"
          }`}
          onClick={() => setSelectedPlan(plan)}
          style={{ transition: "all 0.3s ease", borderRadius: "1rem" }}
        >
          <Form.Check type="radio" id={`plan-${plan.id}`} className="mb-3">
            <Form.Check.Input
              type="radio"
              name="plan"
              checked={isSelected}
              onChange={() => setSelectedPlan(plan)}
              className="me-2"
            />
            <Form.Check.Label className="fw-bold fs-5">
              {plan.name}
            </Form.Check.Label>
          </Form.Check>

          <div className="mb-2 fs-4 text-success fw-semibold">
            R$ {plan.price}/mês
          </div>

          {plan.description && (
            <div className="text-muted">{plan.description}</div>
          )}
        </div>
      </div>
    );
  })}
</div>


      {error && (
        <div className="alert alert-danger text-center mb-4">{error}</div>
      )}

      <div className="d-grid gap-3">
        <Button
          text={
            paymentLoading
              ? "Processando pagamento..."
              : "Continuar com o pagamento"
          }
          color={COLORS.secondary}
          onClick={handlePayment}
          disabled={!selectedPlan || paymentLoading}
        />
      </div>

      <p className="text-center text-muted mt-5">
        A assinatura te permite oferecer seus serviços. Caso você não queira
        assinar, você ainda pode encontrar serviços que está precisando!
      </p>
    </div>
  );
}
