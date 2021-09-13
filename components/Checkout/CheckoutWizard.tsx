import React from 'react';
import { Step, StepLabel, Stepper } from '@material-ui/core';

const CheckoutWizard = ({ activeStep = 0 }) => {
  const stepsTitle = [
    'Login',
    'Shipping Address',
    'Payment Method',
    'Place Order',
  ];
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {stepsTitle.map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default CheckoutWizard;
