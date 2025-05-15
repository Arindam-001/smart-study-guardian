
import { useState } from 'react';

export const useSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const startSubmission = () => {
    setIsSubmitting(true);
  };

  const completeSubmission = () => {
    setSubmitting(false);
    setSubmitted(true);
  };

  const setSubmitting = (value: boolean) => {
    setIsSubmitting(value);
  };

  return {
    isSubmitting,
    submitted,
    startSubmission,
    completeSubmission,
    setSubmitting
  };
};
