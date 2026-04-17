import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeightCalculator } from '../components/HeightCalculator';
import * as heightCalculationService from '../services/height-calculation.service';

jest.mock('../services/height-calculation.service');

const mockedCalculateHeight = heightCalculationService.calculateHeight as jest.MockedFunction<
  typeof heightCalculationService.calculateHeight
>;

describe('HeightCalculator Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component', () => {
    render(<HeightCalculator />);
    
    expect(screen.getByText('Height Calculator')).toBeInTheDocument();
    expect(screen.getByLabelText(/Height Value/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Unit/i)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    render(<HeightCalculator />);
    
    const calculateButton = screen.getByRole('button', { name: /Calculate/i });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('Height value is required')).toBeInTheDocument();
    });
  });

  it('should validate numeric input', async () => {
    render(<HeightCalculator />);
    
    const input = screen.getByLabelText(/Height Value/i);
    await userEvent.type(input, 'abc');

    const calculateButton = screen.getByRole('button', { name: /Calculate/i });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid number')).toBeInTheDocument();
    });
  });

  it('should validate negative values', async () => {
    render(<HeightCalculator />);
    
    const input = screen.getByLabelText(/Height Value/i);
    await userEvent.type(input, '-50');

    const calculateButton = screen.getByRole('button', { name: /Calculate/i });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('Height cannot be negative')).toBeInTheDocument();
    });
  });

  it('should validate maximum value', async () => {
    render(<HeightCalculator />);
    
    const input = screen.getByLabelText(/Height Value/i);
    await userEvent.type(input, '999999');

    const calculateButton = screen.getByRole('button', { name: /Calculate/i });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('Height cannot exceed 10,000')).toBeInTheDocument();
    });
  });

  it('should submit valid form and display result', async () => {
    mockedCalculateHeight.mockResolvedValue({
      success: true,
      data: {
        calculatedHeight: 100,
        unit: 'meters',
        precision: 2,
        calculationTime: 5,
      },
    });

    render(<HeightCalculator />);
    
    const input = screen.getByLabelText(/Height Value/i);
    await userEvent.type(input, '100');

    const calculateButton = screen.getByRole('button', { name: /Calculate/i });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('Result')).toBeInTheDocument();
      expect(screen.getByText('100.00')).toBeInTheDocument();
      expect(screen.getByText('meters')).toBeInTheDocument();
    });
  });

  it('should handle API errors', async () => {
    mockedCalculateHeight.mockResolvedValue({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input provided',
      },
    });

    render(<HeightCalculator />);
    
    const input = screen.getByLabelText(/Height Value/i);
    await userEvent.type(input, '100');

    const calculateButton = screen.getByRole('button', { name: /Calculate/i });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid input provided')).toBeInTheDocument();
    });
  });

  it('should reset form', async () => {
    render(<HeightCalculator />);
    
    const input = screen.getByLabelText(/Height Value/i) as HTMLInputElement;
    await userEvent.type(input, '100');

    expect(input.value).toBe('100');

    const resetButton = screen.getByRole('button', { name: /Reset/i });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('should handle unit selection', async () => {
    render(<HeightCalculator />);
    
    const unitSelect = screen.getByLabelText(/Unit/i) as HTMLSelectElement;
    
    fireEvent.change(unitSelect, { target: { value: 'feet' } });
    
    expect(unitSelect.value).toBe('feet');
  });

  it('should handle optional parameters', async () => {
    mockedCalculateHeight.mockResolvedValue({
      success: true,
      data: {
        calculatedHeight: 220,
        unit: 'meters',
        precision: 2,
        calculationTime: 8,
      },
    });

    render(<HeightCalculator />);
    
    const heightInput = screen.getByLabelText(/Height Value/i);
    await userEvent.type(heightInput, '100');

    const param1Input = screen.getByLabelText(/Additional Parameter 1/i);
    await userEvent.type(param1Input, '10');

    const param2Input = screen.getByLabelText(/Additional Parameter 2/i);
    await userEvent.type(param2Input, '2');

    const calculateButton = screen.getByRole('button', { name: /Calculate/i });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(mockedCalculateHeight).toHaveBeenCalledWith({
        value: 100,
        unit: 'meters',
        parameters: {
          additionalParam1: 10,
          additionalParam2: 2,
        },
      });
    });
  });

  it('should show loading state during calculation', async () => {
    mockedCalculateHeight.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        success: true,
        data: {
          calculatedHeight: 100,
          unit: 'meters',
          precision: 2,
          calculationTime: 5,
        },
      }), 100))
    );

    render(<HeightCalculator />);
    
    const input = screen.getByLabelText(/Height Value/i);
    await userEvent.type(input, '100');

    const calculateButton = screen.getByRole('button', { name: /Calculate/i });
    fireEvent.click(calculateButton);

    expect(screen.getByText('Calculating...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Calculate')).toBeInTheDocument();
    });
  });
});
