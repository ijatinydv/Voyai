'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AuthForm } from '@/components/auth/AuthForm';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type RegisterValues = z.infer<typeof registerSchema>;
type PasswordStrength = 'weak' | 'fair' | 'strong';

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score >= 4) return 'strong';
  if (score >= 2) return 'fair';
  return 'weak';
}

const strengthClasses: Record<PasswordStrength, string> = {
  weak: 'bg-red-500',
  fair: 'bg-amber-500',
  strong: 'bg-emerald-600',
};

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerAccount, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const password = watch('password');
  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const strengthWidth = strength === 'strong' ? 'w-full' : strength === 'fair' ? 'w-2/3' : 'w-1/3';

  const onSubmit = async (values: RegisterValues) => {
    const didRegister = await registerAccount(values.name, values.email, values.password);
    if (didRegister) router.push('/dashboard');
  };

  return (
    <AuthForm title="Begin the journey" subtitle="Create your account and turn ideas into polished travel plans.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input label="Name" autoComplete="name" placeholder="Avery Stone" error={errors.name?.message} {...register('name')} />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="space-y-3">
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="space-y-2">
            <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
              <div className={cn('h-full rounded-full transition-all duration-150 ease-out', strengthWidth, strengthClasses[strength])} />
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
              Password strength: <span className="text-navy-800">{strength}</span>
            </p>
          </div>
        </div>
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
          Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-stone-600">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-emerald-800 transition-colors duration-150 ease-out hover:text-emerald-900">
          Sign in
        </Link>
      </p>
    </AuthForm>
  );
}
