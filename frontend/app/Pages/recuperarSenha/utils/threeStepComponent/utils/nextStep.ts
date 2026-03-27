export const nextStep = (setCurrentStep: (arg0: (prevStep: number) => number) => void) => {
  setCurrentStep((prevStep: number) => Math.min(prevStep + 1, 3));
};
