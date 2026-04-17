import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useHeightCalculation } from '../hooks/useHeightCalculation';
import { UnitType } from '../types/height-calculation.types';
import './HeightCalculator.css';

export const HeightCalculator: React.FC = () => {
  const { calculate, loading, error, result, reset } = useHeightCalculation();
  
  const [value, setValue] = useState<string>('');
  const [unit, setUnit] = useState<UnitType>('meters');
  const [additionalParam1, setAdditionalParam1] = useState<string>('');
  const [additionalParam2, setAdditionalParam2] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  const validateInput = (): boolean => {
    setValidationError('');

    if (!value || value.trim() === '') {
      setValidationError('Height value is required');
      return false;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setValidationError('Please enter a valid number');
      return false;
    }

    if (numValue < 0) {
      setValidationError('Height cannot be negative');
      return false;
    }

    if (numValue > 10000) {
      setValidationError('Height cannot exceed 10,000');
      return false;
    }

    if (additionalParam1 && isNaN(parseFloat(additionalParam1))) {
      setValidationError('Additional parameter 1 must be a valid number');
      return false;
    }

    if (additionalParam2 && isNaN(parseFloat(additionalParam2))) {
      setValidationError('Additional parameter 2 must be a valid number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    const request: any = {
      value: parseFloat(value),
      unit,
    };

    if (additionalParam1 || additionalParam2) {
      request.parameters = {};
      if (additionalParam1) {
        request.parameters.additionalParam1 = parseFloat(additionalParam1);
      }
      if (additionalParam2) {
        request.parameters.additionalParam2 = parseFloat(additionalParam2);
      }
    }

    await calculate(request);
  };

  const handleReset = () => {
    setValue('');
    setUnit('meters');
    setAdditionalParam1('');
    setAdditionalParam2('');
    setValidationError('');
    reset();
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setValidationError('');
  };

  return (
    <div className="height-calculator-container">
      <div className="height-calculator-card">
        <h1 className="height-calculator-title">Height Calculator</h1>
        
        <form onSubmit={handleSubmit} className="height-calculator-form">
          <div className="form-group">
            <label htmlFor="height-value" className="form-label">
              Height Value *
            </label>
            <input
              id="height-value"
              type="number"
              step="any"
              value={value}
              onChange={handleValueChange}
              className="form-input"
              placeholder="Enter height value"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="unit" className="form-label">
              Unit
            </label>
            <select
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value as UnitType)}
              className="form-select"
              disabled={loading}
            >
              <option value="meters">Meters</option>
              <option value="feet">Feet</option>
              <option value="centimeters">Centimeters</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="param1" className="form-label">
              Additional Parameter 1 (optional)
            </label>
            <input
              id="param1"
              type="number"
              step="any"
              value={additionalParam1}
              onChange={(e) => setAdditionalParam1(e.target.value)}
              className="form-input"
              placeholder="Optional parameter"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="param2" className="form-label">
              Additional Parameter 2 (optional)
            </label>
            <input
              id="param2"
              type="number"
              step="any"
              value={additionalParam2}
              onChange={(e) => setAdditionalParam2(e.target.value)}
              className="form-input"
              placeholder="Optional parameter"
              disabled={loading}
            />
          </div>

          {validationError && (
            <div className="error-message validation-error" role="alert">
              {validationError}
            </div>
          )}

          {error && (
            <div className="error-message api-error" role="alert">
              {error}
            </div>
          )}

          <div className="button-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Calculating...' : 'Calculate'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </form>

        {result && (
          <div className="result-container" role="region" aria-label="Calculation Result">
            <h2 className="result-title">Result</h2>
            <div className="result-details">
              <div className="result-item">
                <span className="result-label">Calculated Height:</span>
                <span className="result-value">
                  {result.calculatedHeight.toFixed(result.precision)}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Unit:</span>
                <span className="result-value">{result.unit}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Precision:</span>
                <span className="result-value">{result.precision} decimal places</span>
              </div>
              <div className="result-item">
                <span className="result-label">Calculation Time:</span>
                <span className="result-value">{result.calculationTime}ms</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
