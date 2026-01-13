import type { ReactNode } from 'react';

export type WizardStep = 'book' | 'child-info' | 'preview';

interface PersonalizationWizardProps {
    currentStep: WizardStep;
    onStepChange?: (step: WizardStep) => void;
    children: ReactNode;
}

interface StepConfig {
    id: WizardStep;
    label: string;
    number: number;
}

const steps: StepConfig[] = [
    { id: 'book', label: 'Book', number: 1 },
    { id: 'child-info', label: 'Child Info', number: 2 },
    { id: 'preview', label: 'Preview', number: 3 },
];

export default function PersonalizationWizard({
    currentStep,
    onStepChange,
    children,
}: PersonalizationWizardProps) {
    const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

    const getStepStatus = (_step: StepConfig, index: number) => {
        if (index < currentStepIndex) {
            return 'completed';
        } else if (index === currentStepIndex) {
            return 'current';
        } else {
            return 'upcoming';
        }
    };

    const handleStepClick = (step: StepConfig, index: number) => {
        // Only allow clicking on completed steps or current step
        if (index <= currentStepIndex && onStepChange) {
            onStepChange(step.id);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Progress Stepper */}
                <div className="mb-8">
                    <nav aria-label="Progress" className="w-full">
                        <ol className="flex items-start justify-center w-full">
                            {steps.map((step, index) => {
                                const status = getStepStatus(step, index);
                                const isCompleted = status === 'completed';
                                const isCurrent = status === 'current';
                                const isUpcoming = status === 'upcoming';

                                return (
                                    <li
                                        key={step.id}
                                        className="relative flex-1 flex flex-col items-center"
                                    >
                                        {/* Connector Line - Before the circle (for all except first) */}
                                        {index > 0 && (
                                            <div
                                                className={`absolute right-1/2 top-7 sm:top-8 h-0.5 transition-all ${
                                                    index <= currentStepIndex
                                                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600'
                                                        : 'bg-gray-300'
                                                }`}
                                                style={{ width: '50%' }}
                                                aria-hidden="true"
                                            />
                                        )}

                                        {/* Step Circle and Label Container - Properly Aligned */}
                                        <div className="flex flex-col items-center w-full relative z-10">
                                            {/* Step Circle - Centered */}
                                            <button
                                                type="button"
                                                onClick={() => handleStepClick(step, index)}
                                                disabled={isUpcoming}
                                                className={`
                                                    relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 transition-all flex-shrink-0
                                                    ${
                                                        isCompleted
                                                            ? 'border-indigo-600 bg-gradient-to-r from-indigo-600 to-blue-600 cursor-pointer hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                                                            : isCurrent
                                                            ? 'border-indigo-600 bg-white cursor-pointer hover:border-indigo-700 shadow-lg ring-2 ring-indigo-200 hover:ring-indigo-300'
                                                            : 'border-gray-300 bg-white cursor-not-allowed'
                                                    }
                                                `}
                                                aria-current={isCurrent ? 'step' : undefined}
                                            >
                                                {isCompleted ? (
                                                    <svg
                                                        className="h-6 w-6 sm:h-7 sm:w-7 text-white"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2.5}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <span
                                                        className={`text-base sm:text-lg font-bold ${
                                                            isCurrent
                                                                ? 'text-indigo-600'
                                                                : 'text-gray-500'
                                                        }`}
                                                    >
                                                        {step.number}
                                                    </span>
                                                )}
                                                <span className="sr-only">{step.label}</span>
                                            </button>

                                            {/* Step Label - Centered below circle */}
                                            <div className="mt-3 text-center w-full">
                                                <p
                                                    className={`text-sm sm:text-base font-semibold whitespace-nowrap ${
                                                        isCurrent
                                                            ? 'text-indigo-600'
                                                            : isCompleted
                                                            ? 'text-gray-900'
                                                            : 'text-gray-500'
                                                    }`}
                                                >
                                                    {step.label}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Connector Line - After the circle (for all except last) */}
                                        {index < steps.length - 1 && (
                                            <div
                                                className={`absolute left-1/2 top-7 sm:top-8 h-0.5 transition-all ${
                                                    index < currentStepIndex
                                                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600'
                                                        : 'bg-gray-300'
                                                }`}
                                                style={{ width: '50%' }}
                                                aria-hidden="true"
                                            />
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    </nav>
                </div>

                {/* Wizard Content */}
                <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
                    {children}
                </div>
            </div>
        </div>
    );
}

