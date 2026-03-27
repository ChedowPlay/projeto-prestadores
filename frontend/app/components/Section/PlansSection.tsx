"use client";

import { Col, Container, Row } from "react-bootstrap";
import React, { useState } from "react";
import { FiCheckCircle, FiZap } from "react-icons/fi";

import Button from "../Button";
import COLORS from "@/app/stylesheets/colors";
import styles from "@/app/stylesheets/PlansSection.module.css";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Essencial Demo",
    price: "R$ 89,90/mês",
    photos: 5,
    videos: 2,
    services: 2,
    featured: false,
  },
  {
    name: "Profissional Demo",
    price: "R$ 159,90/mês",
    photos: 12,
    videos: 6,
    services: 5,
    featured: true,
  },
  {
    name: "Premium Demo",
    price: "R$ 249,90/mês",
    photos: 40,
    videos: 30,
    services: 10,
    featured: false,
  },
];

const PlansSection = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>("Profissional Demo");

  return (
    <Container className="py-5">
      <h2 className="text-center mb-3">Planos demonstrativos para prestadores</h2>
      <p className="text-center text-secondary mx-auto mb-4" style={{ maxWidth: 680 }}>
        Os planos abaixo ajudam a apresentar a proposta comercial da Marca Modelo de forma clara,
        moderna e comparável durante a demo.
      </p>

      <ul className="list-unstyled text-start mb-4 mx-auto" style={{ maxWidth: 720 }}>
        {[
          "Ofereça seus serviços e habilidades",
          "Compartilhe fotos e vídeos do seu trabalho",
          "Ganhe mais visibilidade na apresentação da plataforma",
        ].map((item) => (
          <li key={item} className="p-2 d-flex align-items-center gap-2">
            <FiCheckCircle color="#2563eb" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <Row className="g-3 justify-content-center">
        {plans.map((plan) => (
          <Col key={plan.name} lg={4} md={6} sm={12}>
            <div
              className={`${styles.planCard} ${selectedPlan === plan.name ? styles.selectedCard : ""}`}
              onClick={() => setSelectedPlan(plan.name)}
            >
              <div className={styles.planHeader}>
                <div>
                  <h3 className="fw-bold mb-1">{plan.name}</h3>
                  <p className="text-secondary mb-0">
                    Ideal para demonstrar diferentes níveis de exposição.
                  </p>
                </div>
                {plan.featured && (
                  <span className={styles.featuredTag}>
                    <FiZap size={14} /> destaque
                  </span>
                )}
              </div>

              <div className={styles.planPrice}>
                <p className="fs-4 fw-bold mb-0">
                  <span className={styles.priceValue}>{plan.price.split("/")[0]}</span>
                  <span className={styles.pricePeriod}>/{plan.price.split("/")[1]}</span>
                </p>
              </div>

              <div className={styles.planContent}>
                <ul className="list-unstyled mb-0">
                  <li className="p-3">Compartilhe até {plan.photos} fotos do seu trabalho</li>
                  <div className={styles.customHr}><hr /></div>
                  <li className="p-3">Compartilhe até {plan.videos} vídeos do seu trabalho</li>
                  <div className={styles.customHr}><hr /></div>
                  <li className="p-3">Cadastre até {plan.services} serviços</li>
                  <div className={styles.customHr}><hr /></div>
                  <li className="p-3 d-flex align-items-center gap-2">
                    <FiCheckCircle color="#2563eb" />
                    Prioridade na visibilidade da demo
                  </li>
                </ul>
                <div className="d-flex justify-content-center">
                  <Button
                    onClick={() => router.push("/Pages/cadastrar")}
                    className={`${styles.largeButton} m-2 d-flex justify-content-center align-items-center text-center mt-3`}
                    text={`Selecionar ${plan.name}`}
                    color={COLORS.secondary}
                  />
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <p className="text-center mt-4 text-secondary">
        * A prioridade de visibilidade da Marca Modelo destaca perfis com maior relevância durante a demonstração da plataforma.
      </p>
    </Container>
  );
};

export default PlansSection;
