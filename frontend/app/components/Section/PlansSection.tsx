"use client";

import { Col, Container, Row } from "react-bootstrap";
import React, { useState } from "react";

import Button from "../Button";
import COLORS from "@/app/stylesheets/colors";
import Image from "next/image";
import styles from "@/app/stylesheets/PlansSection.module.css";
import { useRouter } from "next/navigation";

const PlansSection = () => {
    const router = useRouter(); 

    const handlePayment = () => {
        router.push("/Pages/cadastrar");
      };

    // Adiciona borda azul no card selecionado
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const handleSelectPlan = (planName: string) => {
        setSelectedPlan(planName);
    };

    return (
        <Container className="py-5">
            <h2 className="text-center mb-4">
                Preços e Assinaturas para Prestadores de Serviços
            </h2>

            <ul className="list-unstyled text-start mb-4">
                <li className="p-2">
                    <Image src="/images/check.png" alt="check" width={20} height={20} className="me-2" /> 
                    Ofereça seus serviços e habilidades.
                </li>
                <li className="p-2">
                    <Image src="/images/check.png" alt="check" width={20} height={20} className="me-2" /> 
                    Compartilhe fotos e vídeos mostrando seu trabalho.
                </li>
                <li className="p-2">
                    <Image src="/images/check.png" alt="check" width={20} height={20} className="me-2" /> 
                    Encontre clientes rapidamente.
                </li>
            </ul>

            <Row className="g-1 justify-content-center">
                {[ 
                    { name: "Di Boa", price: "R$ 89,90/mês", photos: 5, videos: 2, services: 2, icon: "/images/Vector.png", iconSize: 10 },
                    { name: "Bem Di Boa", price: "R$ 159,90/mês", photos: 12, videos: 6, services: 5, icon: "/images/check.png", iconSize: 20 },
                    { name: "Di Boa Total", price: "R$ 249,90/mês", photos: 40, videos: 30, services: 10, icon: "/images/check.png", iconSize: 20 }
                ].map((plan, index) => (
                    <Col key={index} lg={4} md={4} sm={12}>
                        <div 
                            className={`${styles.planCard} ${selectedPlan === plan.name ? styles.selectedCard : ""}`}
                            onClick={() => handleSelectPlan(plan.name)}
                        >
                            <div className={styles.planHeader}>
                                <h3 className="fw-bold">{plan.name}</h3>
                            </div>
                            <div className={styles.customHr}><hr /></div>

                            <div className={styles.planPrice}>
                                <p className="fs-4 fw-bold">
                                    <span className={styles.priceValue}>{plan.price.split("/")[0]}</span> 
                                    <span className={styles.pricePeriod}>/{plan.price.split("/")[1]}</span>
                                </p> 
                            </div>
                            <div className={styles.customHr}><hr /></div>

                            <div className={styles.planContent}>
                                <ul className="list-unstyled">
                                    <li className="p-3"> Compartilhe até {plan.photos} fotos do seu trabalho</li>
                                    <div className={styles.customHr}><hr /></div>
                                    <li className="p-3"> Compartilhe até {plan.videos} vídeos</li>
                                    <div className={styles.customHr}><hr /></div>
                                    <li className="p-3"> Ofereça até {plan.services} serviços</li>
                                    <div className={styles.customHr}><hr /></div>
                                    <li className="p-3">
                                        <Image 
                                            src={plan.icon} 
                                            alt="icon" 
                                            width={plan.iconSize} 
                                            height={plan.iconSize} 
                                            className="me-2" 
                                        /> 
                                        Prioridade na visibilidade*
                                    </li>
                                    <div className={styles.customHr}><hr /></div>
                                </ul>
                                <div className="d-flex justify-content-center">
                                    <Button 
                                        onClick={handlePayment}
                                        className={`${styles.largeButton} m-2 d-flex justify-content-center align-items-center text-center mt-3`} 
                                        text={`Assinar Plano ${plan.name}`} 
                                        color={COLORS.secondary} 
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
            <p className="text-center mt-4">
                * A prioridade na visibilidade do serviço Di Boa Club destaca profissionais com maior relevância nas buscas, aumentando sua exposição para atrair mais clientes.
            </p>
        </Container>
    );
};

export default PlansSection;
