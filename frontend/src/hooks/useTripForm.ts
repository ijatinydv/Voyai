'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/useToast';
import { tripService } from '@/services/trip.service';
import { useTripsStore } from '@/store/trips.store';
import type { BudgetType, Interest, StepDirection, TripFormValues, UseTripFormResult } from '@/types';

export const interests = [
  'Food',
  'Culture',
  'Adventure',
  'Shopping',
  'Nature',
  'Nightlife',
  'History',
  'Art',
  'Sports',
  'Wellness',
] as const;

export type { Interest };

const stepOneSchema = z.object({
  destination: z.string().trim().min(2, 'Enter a destination to continue'),
  numberOfDays: z.number().int().min(1).max(30),
});

const stepTwoSchema = z.object({
  budgetType: z.enum(['low', 'medium', 'high'], {
    required_error: 'Choose a budget tier',
    invalid_type_error: 'Choose a budget tier',
  }),
  interests: z.array(z.enum(interests)).min(1, 'Choose at least one interest'),
});

const tripFormSchema = stepOneSchema.merge(stepTwoSchema);

const loadingMessages = [
  '✈️ Planning your adventure to {destination}...',
  '🗺️ Building your day-by-day itinerary...',
  '💰 Estimating your travel budget...',
  '🏨 Finding the best hotels...',
  '🧳 Preparing your packing list...',
];

export function useTripForm(): UseTripFormResult {
  const router = useRouter();
  const toast = useToast();
  const addTrip = useTripsStore((state) => state.addTrip);
  const updateCurrentTrip = useTripsStore((state) => state.updateCurrentTrip);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<StepDirection>('next');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const form = useForm<TripFormValues>({
    defaultValues: {
      destination: '',
      numberOfDays: 5,
      budgetType: '',
      interests: [],
    },
    mode: 'onChange',
  });

  const destination = form.watch('destination');

  const loadingMessage = useMemo(() => {
    const fallbackDestination = destination.trim() || 'your destination';
    return loadingMessages[messageIndex]?.replace('{destination}', fallbackDestination) ?? loadingMessages[0]!;
  }, [destination, messageIndex]);

  useEffect(() => {
    if (!isGenerating) return undefined;

    setMessageIndex(0);
    setProgress(0);

    const messageTimer = window.setInterval(() => {
      setMessageIndex((index) => (index + 1) % loadingMessages.length);
    }, 2000);

    const progressStart = Date.now();
    const progressTimer = window.setInterval(() => {
      const elapsed = Date.now() - progressStart;
      const nextProgress = Math.min(90, Math.round((elapsed / 12000) * 90));
      setProgress(nextProgress);
    }, 120);

    return () => {
      window.clearInterval(messageTimer);
      window.clearInterval(progressTimer);
    };
  }, [isGenerating]);

  const applyErrors = (result: z.SafeParseReturnType<unknown, unknown>) => {
    if (result.success) return;

    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof TripFormValues | undefined;
      if (field) form.setError(field, { type: 'manual', message: issue.message });
    });
  };

  const validateStep = (step: number): boolean => {
    form.clearErrors();
    const values = form.getValues();
    const schema = step === 0 ? stepOneSchema : step === 1 ? stepTwoSchema : tripFormSchema;
    const result = schema.safeParse(values);
    applyErrors(result);
    return result.success;
  };

  const goNext = async () => {
    if (!validateStep(currentStep)) return;

    setDirection('next');
    setCurrentStep((step) => Math.min(2, step + 1));
  };

  const goBack = () => {
    setDirection('back');
    setCurrentStep((step) => Math.max(0, step - 1));
  };

  const setNumberOfDays = (value: number) => {
    form.setValue('numberOfDays', value, { shouldValidate: true, shouldDirty: true });
  };

  const selectBudget = (budget: BudgetType) => {
    form.setValue('budgetType', budget, { shouldValidate: true, shouldDirty: true });
    form.clearErrors('budgetType');
  };

  const toggleInterest = (interest: Interest) => {
    const selected = form.getValues('interests');
    const nextInterests = selected.includes(interest)
      ? selected.filter((item) => item !== interest)
      : [...selected, interest];

    form.setValue('interests', nextInterests, { shouldValidate: true, shouldDirty: true });
    if (nextInterests.length > 0) form.clearErrors('interests');
  };

  const submit = async () => {
    if (!validateStep(2)) return;

    const parsed = tripFormSchema.safeParse(form.getValues());
    if (!parsed.success) {
      applyErrors(parsed);
      return;
    }

    setIsGenerating(true);

    try {
      const createdTrip = await tripService.createTrip({
        destination: parsed.data.destination.trim(),
        numberOfDays: parsed.data.numberOfDays,
        budgetType: parsed.data.budgetType,
        interests: parsed.data.interests.map((interest) => interest.toLowerCase()),
      });
      addTrip(createdTrip);

      const generatedTrip = await tripService.generateTrip(createdTrip._id);
      updateCurrentTrip(generatedTrip);
      setProgress(100);
      router.push(`/trips/${generatedTrip._id}`);
    } catch (error) {
      setIsGenerating(false);
      toast.error(error instanceof Error ? error.message : 'Unable to generate your trip.');
    }
  };

  return {
    form,
    currentStep,
    direction,
    isGenerating,
    loadingMessage,
    progress,
    goNext,
    goBack,
    submit,
    setNumberOfDays,
    selectBudget,
    toggleInterest,
  };
}
