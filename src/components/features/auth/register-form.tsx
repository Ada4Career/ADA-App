'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { z } from 'zod';

import api from '@/lib/axios';
import { setToken } from '@/lib/cookies';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import useAuthStore from '@/store/useAuthStore';

import { API_BASE_URL } from '@/constant/config';

import { ApiError, ApiReturn } from '@/types/api.types';
import { UserInterface } from '@/types/entities/user.types';
import { RegisterAndLoginResponse } from '@/types/response/auth';

interface RegisterFormProps {
  onLoginClick: () => void;
}

const formSchema = z.object({
  email: z
    .string()
    .min(2)
    .max(50)
    .email({ message: 'Please input valid email' }),
  password: z.string().min(8).max(50),
  role: z.enum(['human_resources', 'jobseeker'], {
    message: 'Please select a role',
  }),
});

export function RegisterForm({ onLoginClick }: RegisterFormProps) {
  const router = useRouter();
  const { login } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
  });

  const { mutateAsync, isPending } = useMutation<
    ApiReturn<RegisterAndLoginResponse>,
    ApiError,
    z.infer<typeof formSchema>
  >(
    async (data) => {
      const dataStr = {
        email: data.email,
        password: data.password,
        role: [data.role],
      };
      const response = await api.post(`${API_BASE_URL}/user/register`, dataStr);

      const token = response.data.data.token;
      setToken(token);
      const meResponse = await api.get<ApiReturn<UserInterface>>(
        `${API_BASE_URL}/me`
      );
      const meData = meResponse.data.data;
      login({
        ...meData,
        token: token,
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success('Register Successfully');
        router.push('/onboarding');
      },
    }
  );

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutateAsync(values);
    // Handle registration logic here
  };

  return (
    <div className='space-y-4 py-2 pb-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter your email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder='' type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className='w-full border-gradient-ms'>
                      <SelectValue placeholder='Select Role' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='jobseeker'>Job Seeker</SelectItem>
                      <SelectItem value='human_resources'>HR</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex items-center space-x-2'>
            <Checkbox id='terms' required />
            <Label htmlFor='terms' className='text-sm font-normal'>
              I agree to the{' '}
              <Button
                variant='link'
                className='h-auto p-0 text-sm font-normal'
                type='button'
              >
                Terms of Service
              </Button>{' '}
              and{' '}
              <Button
                variant='link'
                className='h-auto p-0 text-sm font-normal'
                type='button'
              >
                Privacy Policy
              </Button>
            </Label>
          </div>
          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </Form>
      <div className='mt-4 text-center'>
        <p className='text-sm text-muted-foreground mb-2'>
          Already have an account?
        </p>
        <Button
          type='button'
          variant='link'
          onClick={onLoginClick}
          className='w-full'
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}
