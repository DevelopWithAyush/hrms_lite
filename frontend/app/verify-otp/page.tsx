'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const otpSchema = z.object({
  otp: z.string().min(4, 'OTP must be 4 digits').max(4, 'OTP must be 4 digits'),
});

type OTPFormData = z.infer<typeof otpSchema>;

export default function VerifyOTPPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('loginEmail');
    if (!storedEmail) {
      router.push('/login');
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: OTPFormData) => {
    if (!email) return;

    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/auth/verify-otp', {
        email,
        otp: data.otp,
      });

      if (response.data.success) {
        sessionStorage.removeItem('loginEmail');
        sessionStorage.removeItem('otp');
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verify OTP</CardTitle>
          <CardDescription className="text-center">
            Enter the OTP sent to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 4-digit OTP"
                maxLength={4}
                {...register('otp')}
                disabled={loading}
                autoFocus
              />
              {errors.otp && (
                <p className="text-sm text-destructive">{errors.otp.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => router.push('/login')}
              disabled={loading}
            >
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
