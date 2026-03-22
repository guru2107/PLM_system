import React from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';

export interface Step {
  id: string;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, currentStep, onStepClick, className }, ref) => {
    return (
      <div ref={ref} className={className}>
        <div className="relative">
          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-dark-700" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-primary-500 transition-all duration-300"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => onStepClick?.(index)}
                className="flex flex-col items-center cursor-pointer group"
                disabled={!onStepClick}
              >
                {/* Step circle */}
                <div
                  className={clsx(
                    'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all mb-2',
                    index < currentStep
                      ? 'bg-primary-500 text-white'
                      : index === currentStep
                      ? 'bg-primary-500 text-white ring-4 ring-primary-100 dark:ring-primary-900/30'
                      : 'bg-gray-200 dark:bg-dark-700 text-gray-600 dark:text-dark-400'
                  )}
                >
                  {index < currentStep ? (
                    <Check size={20} />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Label */}
                <span className={clsx(
                  'text-sm font-semibold text-center',
                  index <= currentStep
                    ? 'text-dark-900 dark:text-white'
                    : 'text-gray-600 dark:text-dark-400'
                )}>
                  {step.label}
                </span>

                {/* Description */}
                {step.description && (
                  <span className="text-xs text-gray-500 dark:text-dark-400 mt-1 text-center max-w-xs">
                    {step.description}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

Stepper.displayName = 'Stepper';
