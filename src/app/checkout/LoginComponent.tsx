"use client"
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { signIn, useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { FormData, signinSchema, zodResolver } from '@/lib/validatoins'
import * as Icon from "@phosphor-icons/react/dist/ssr";

const LoginComponent = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { session: data, status } = useSession();

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
            }).then((res) => {
                if (res?.error) {
                    return toast.error(res.error);
                }
                if (res?.ok) {
                    toast.dismiss('login');
                    toast.success('Login successful');
                }
            }).catch((err) => {
                toast.error(err);
            })

        } catch (error) {
            // already handled in toast
            console.log(error);
        } finally {
            setTimeout(() => {
                toast.dismiss('login');
            }, 1500);

            setIsLoading(false);
        }
    };

    return (
        <div>
            {
                status === 'unauthenticated' && (
                    <>
                        <div className="login bg-surface py-3 px-4 flex justify-between rounded-lg">
                            <div className="left flex items-center"><span className="text-on-surface-variant1 pr-4">Already have an account? </span><span className="text-button text-on-surface hover-underline cursor-pointer">Login</span></div>
                            <div className="right"><i className="ph ph-caret-down fs-20 d-block cursor-pointer"></i></div>
                        </div>
                        <div className="form-login-block mt-3">
                            <form className="p-5 border border-line rounded-lg" onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="email ">
                                        <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
                                            id="username"
                                            type="email"
                                            placeholder="Email address *"
                                            {...register("email", { required: true })}
                                        />
                                        {errors.email && (
                                            <p className="text-red text-sm py-1">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="pass ">
                                        <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg"
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
                                </div>
                                <div className="block-button mt-3">
                                    <button className="button-main button-blue-hover">
                                        {isLoading ? 'Loading...' : 'Login'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default LoginComponent