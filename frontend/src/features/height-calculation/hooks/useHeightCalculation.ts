import { useState, useCallback } from 'react';
import { calculateHeight as calculateHeightService } from '../services/height-calculation.service';
import {
  HeightCalculationRequest,
  HeightCalculationResponseData,
  UseHeightCalculationResult,
} from '../types/height-calculation.types';

export const useHeightCalculation = (): UseHeightCalculationResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HeightCalculationResponseData | null>(null);

  const calculate = useCallback(async (request: HeightCalculationRequest): Promise<void> => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await calculateHeightService(request);

      if (response.success && response.data) {
        setResult(response.data);
      } else if (response.error) {
        setError(response.error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred during calculation');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResult(null);
  }, []);

  return {
    calculate,
    loading,
    error,
    result,
    reset,
  };
};
