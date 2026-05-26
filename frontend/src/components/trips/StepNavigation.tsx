import { Button } from '@/components/ui/Button';

interface StepNavigationProps {
  currentStep: number;
  isGenerating: boolean;
  onBack: () => void;
  onNext: () => void;
  onGenerate: () => void;
}

export function StepNavigation({ currentStep, isGenerating, onBack, onNext, onGenerate }: StepNavigationProps) {
  const isLastStep = currentStep === 2;

  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      <Button variant="ghost" onClick={onBack} disabled={currentStep === 0 || isGenerating}>
        Back
      </Button>
      {isLastStep ? (
        <Button size="lg" className="flex-1" onClick={onGenerate} isLoading={isGenerating}>
          Generate My Voyai Trip
        </Button>
      ) : (
        <Button onClick={onNext}>Next</Button>
      )}
    </div>
  );
}
