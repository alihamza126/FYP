'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { FormData, signinSchema, zodResolver } from '@/lib/validatoins'
import toast from 'react-hot-toast'

const Login = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    const searchParams = useSearchParams();
    const pathname = searchParams.get("callbackUrl") || '/';


    if (status === 'authenticated' && session) {
      router.replace('/');
    }



    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        toast.loading('Logging in...', { id: 'login' });
        
        try {
           signIn("credentials", {
               email: data.email,
               password: data.password,
               redirect: false, // Prevent automatic redirection
               callbackUrl: pathname,
            }).then((res) => {
                if (res?.error) {
                    return toast.error(res.error);
                }
                if (res?.ok) {
                    router.replace(pathname);
                }
            }).catch((err) => {
                toast.error(err);
            })

        } catch (error) {
            // already handled in toast
        } finally {
            toast.dismiss('login');
            setIsLoading(false);
        }
    };

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='Login' subHeading='Login' />
            </div>
            <div className="login-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col">
                        <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
                            <div className="heading4">Login</div>
                            <form className="md:mt-7 mt-4" onSubmit={handleSubmit(onSubmit)}>
                                <div className="email ">
                                    <input
                                        className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                        id="username"
                                        type="email"
                                        placeholder="Email address *"
                                        {...register("email", { required: true })}
                                        required />
                                    {errors.email && (
                                        <p className="text-red text-sm py-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div className="relative mt-5">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password *"
                                        disabled={isLoading}
                                        className="border-line px-4 py-3 w-full rounded-lg"
                                        {...register('password', { required: 'Password is required' })}
                                    />
                                    <Icon.Eye
                                        size={24}
                                        className="absolute z-30 right-3 top-3 cursor-pointer"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    />
                                    {errors.password && <p className="text-red text-sm mt-1">{errors.password.message}</p>}
                                </div>
                                <div className="flex items-center justify-between mt-5">
                                    <div className='flex items-center'>
                                        <div className="block-input">
                                            <input
                                                type="checkbox"
                                                name='remember'
                                                id='remember'
                                            />
                                            <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox' />
                                        </div>
                                        <label htmlFor='remember' className="pl-2 cursor-pointer">Remember me</label>
                                    </div>
                                    <Link href="/forgot" className='font-semibold hover:underline'>Forgot Your Password?</Link>
                                </div>
                                <div className="block-button md:mt-7 mt-4">
                                    <button className="button-main">
                                        {isLoading ? 'Loading...' : 'Login'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
                            <div className="text-content">
                                <div className="heading4">New Customer</div>
                                <div className="mt-2 text-secondary">Be part of our growing family of new customers! Join us today and unlock a world of exclusive benefits, offers, and personalized experiences.</div>
                                <div className="block-button md:mt-7 mt-4">
                                    <Link href={'/register'} className="button-main">Register</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Login