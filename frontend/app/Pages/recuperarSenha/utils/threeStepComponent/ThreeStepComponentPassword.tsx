import { CheckCircle, Spinner } from "@phosphor-icons/react";
import React, { useState } from "react";

import Button from "../../../../components/Button";
import COLORS from "@/app/stylesheets/colors";
import { StepThree } from "./utils/stepThree";
import { StepTwo } from "./utils/stepTwo";
import { nextStep } from "./utils/nextStep";
import styles from "@/app/stylesheets/ThreeStepComponent.module.css";

const ThreeStepComponentPassword = () => {
  const [currentStep, setCurrentStep] = useState(2);
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleNextStep = (data: { email: string }) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
    nextStep(setCurrentStep);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  return (
    <div className={styles.container}>
      <div className={styles.steps}>
        <div className={styles.stepsItem}>
          <h4>
            Etapa 1
            {currentStep === 2 || currentStep === 1 ? (
              <Spinner size={28} color="#007296" />
            ) : (
              <CheckCircle size={28} color="#019D6E" />
            )}
          </h4>
          <div
            className={styles.progress}
            style={{
              backgroundColor:
                currentStep === 2 || currentStep === 1 ? "#007296" : "#019D6E",
            }}
          ></div>
        </div>
        <div className={styles.stepsItem}>
          <h4>
            Etapa 2 <Spinner size={28} color="#007296" />
          </h4>
          <div
            className={styles.progress}
            style={{
              backgroundColor: "#007296",
            }}
          ></div>
        </div>
      </div>
      {currentStep === 2 && <StepTwo nextStep={handleNextStep} />}
      {currentStep === 3 && <StepThree email={formData.email} />}
      <div className={styles.button}>
        {currentStep !== 1 && (
          <Button
            type="submit"
            color={COLORS.white}
            text="Voltar"
            className={styles.submitButton}
            onClick={prevStep}
          />
        )}
      </div>
    </div>
  );
};

export default ThreeStepComponentPassword;
