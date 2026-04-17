import axios, { AxiosError } from 'axios';
import { HeightCalculationRequest, HeightCalculationResponse } from '../types/height-calculation.types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
const CALCULATION_ENDPOINT = `${API_BASE_URL}/api/v1/height-calculation/calculate`;

export const calculateHeight = async (
  request: HeightCalculationRequest
): Promise<HeightCalculationResponse> => {
  try {
    const response = await axios.post<HeightCalculationResponse>(
      CALCULATION_ENDPOINT,
      request,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<HeightCalculationResponse>;
      
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
      
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: axiosError.message || 'Network error occurred',
        },
      };
    }

    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
      },
    };
  }
};
