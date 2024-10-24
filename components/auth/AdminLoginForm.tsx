'use client';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconMail from '@/components/icon/icon-mail';
import { useRouter } from 'next/navigation';
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { setCookie } from 'cookies-next';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { signIn } from '@/data/admin/authentication';
import { setAdminData, setToken } from '@/store/adminSlice';

const ComponentsAuthLoginForm = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const loginSchema = z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 charecters'),
    });

    type LoginFormData = z.infer<typeof loginSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const mutation = useMutation({
        mutationFn: (data: LoginFormData) => signIn(data.email, data.password),

        onSuccess: (data: any) => {
            if (data.token === undefined) return;
            localStorage.setItem('accessToken', data.token);
            dispatch(setToken(data?.token));
            dispatch(setAdminData(data?.admin));
            setCookie('accessToken', data.token, {
                maxAge: 60 * 60 * 24 * 365,
                httpOnly: false, //When set to true, the cookie is not accessible via JavaScript
                secure: false, //This flag means the cookie will only be sent over HTTPS. If you're testing locally using HTTP (without SSL), the cookie will not be set. You can remove this attribute during local testing.
                path: '/',
            });
            router.push('/admin');
            mutation.isPending = false;
        },
        onError: (error: any) => {
            console.error('on error ', error);
            toast.error(error.message);
        },
    });

    const onSubmit = (data: LoginFormData) => {
        mutation.isPending = true;
        mutation.mutate(data);
    };

    return (
        <form className="space-y-5 dark:text-white" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="Email">Email</label>
                <div className="relative text-white-dark">
                    <input
                        id="Email"
                        type="email"
                        placeholder="Enter Email"
                        className={`form-input ps-10 placeholder:text-white-dark ${errors.email ? 'border-red-500' : ''}`}
                        {...register('email')}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconMail fill={true} />
                    </span>
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>
            </div>
            <div>
                <label htmlFor="Password">Password</label>
                <div className="relative text-white-dark">
                    <input
                        id="Password"
                        type="password"
                        placeholder="Enter Password"
                        className={`form-input ps-10 placeholder:text-white-dark ${errors.password ? 'border-red-500' : ''}`}
                        {...register('password')}
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
                    </span>
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>
            </div>

            <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                {mutation.isPending ? 'Signing in...' : 'Sign in'}
            </button>
        </form>
    );
};

export default ComponentsAuthLoginForm;
