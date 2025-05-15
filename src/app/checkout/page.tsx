"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import TopNavOne from "@/components/Header/TopNav/TopNavOne"
import MenuOne from "@/components/Header/Menu/MenuOne"
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb"
import Footer from "@/components/Footer/Footer"
import * as Icon from "@phosphor-icons/react/dist/ssr"
import { useCart } from "@/context/CartContext"
import { useSearchParams } from "next/navigation"
import LoginComponent from "./LoginComponent"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import Axios from "@/lib/Axios"
import { useForm } from "react-hook-form"
import { Alert } from "@heroui/react"
import { AlertCircle } from "lucide-react"

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

// Payment form component that uses Stripe Elements
const CheckoutForm = ({ totalAmount }) => {
    const stripe = useStripe()
    const elements = useElements()
    const [errorMessage, setErrorMessage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        if (!stripe || !elements) {
            return
        }

        setIsLoading(true)

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/order-confirmation?totalAmount=${totalAmount}`,
            },

        })

        if (error) {
            setErrorMessage(error.message)
        }

        setIsLoading(false)
    }

    return (
        <form>
            <PaymentElement />
            <div className="block-button md:mt-10 mt-6">
                <button onClick={handleSubmit} className="button-main w-full" disabled={!stripe || isLoading}>
                    {isLoading ? "Processing..." : `Pay $${totalAmount}.00`}
                </button>
            </div>
            {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
        </form>
    )
}

const Checkout = () => {
    const searchParams = useSearchParams()
    const discount = searchParams.get("discount")
    const ship = searchParams.get("ship")

    const { cartState } = useCart()
    let [totalCart, setTotalCart] = useState<number>(0)
    const [activePayment, setActivePayment] = useState<string>("credit-card")
    const [clientSecret, setClientSecret] = useState("");

    const { register, handleSubmit, formState: { errors, isValid }, watch, getValues } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            country: "",
            city: "",
            address: "",
            state: "",
            zip: "",
        },
        mode: "onChange",
    })


    useEffect(() => {
        const newTotal = cartState.cartArray.reduce((sum, item) => sum + item.price * item.quantity, 0)
        setTotalCart(newTotal)
    }, [cartState.cartArray])


    const finalAmount = totalCart - Number(discount) + Number(ship);
    const [intentCreated, setIntentCreated] = useState(false)

    const handlePayment = (item: string) => {
        setActivePayment(item)
    }

    // Create a payment intent when the page loads
    useEffect(() => {
        if (intentCreated) return;
        if (finalAmount > 0 && isValid && cartState.cartArray.length > 0) {
            const shippingInfo = getValues();
            const cartIds = cartState.cartArray.map((item) => ({ productId: item._id, quantity: 1 }));


            Axios.post("/api/v1/payment/create-payment", {
                amount: finalAmount,
                currency: "pkr",
                shippingInfo,
                cartArray: cartIds,
            })
                .then((res) => {
                    setClientSecret(res.data.clientSecret)
                    setIntentCreated(true)
                })
                .catch((err) => console.log(err));
        }
    }, [finalAmount, isValid])

    const appearance = {
        theme: "stripe",
        variables: {
            colorPrimary: "#000000",
        },
    }

    const options = {
        clientSecret,
        appearance,
    }



    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className="relative w-full">
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading="Shopping cart" subHeading="Shopping cart" />
            </div>
            <div className="cart-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex justify-between">
                        <div className="left w-1/2">
                            <LoginComponent />
                            <div className="information mt-5">
                                <div className="heading5">Information</div>
                                <div className="form-checkout mt-5">
                                    <form>
                                        <div className="grid sm:grid-cols-2 gap-4 gap-y-5 flex-wrap">
                                            <div className="">
                                                <input
                                                    className="border-line px-4 py-3 w-full rounded-lg"
                                                    id="firstName"
                                                    type="text"
                                                    {...register("firstName", { required: true })}
                                                    placeholder="First Name *"
                                                    required
                                                />
                                                {
                                                    errors.firstName && <span className="text-red">First name is required</span>
                                                }
                                            </div>
                                            <div className="">
                                                <input
                                                    className="border-line px-4 py-3 w-full rounded-lg"
                                                    id="lastName"
                                                    type="text"
                                                    {...register("lastName", { required: true })}
                                                    placeholder="Last Name *"
                                                    required
                                                />
                                                {
                                                    errors.lastName && <span className="text-red">Last name is required</span>
                                                }
                                            </div>
                                            <div className="">
                                                <input
                                                    className="border-line px-4 py-3 w-full rounded-lg"
                                                    id="email"
                                                    type="email"
                                                    {...register("email", { required: true })}
                                                    placeholder="Email Address *"
                                                    required
                                                />
                                                {
                                                    errors.email && <span className="text-red">Email is required</span>
                                                }
                                            </div>
                                            <div className="">
                                                <input
                                                    className="border-line px-4 py-3 w-full rounded-lg"
                                                    id="phone"
                                                    type="tel"
                                                    {...register("phone", { required: true })}
                                                    placeholder="Phone Numbers *"
                                                    required
                                                />
                                                {
                                                    errors.phone && <span className="text-red">Phone number is required</span>
                                                }
                                            </div>
                                            <div className="col-span-full select-block">
                                                <select
                                                    className="border border-line px-4 py-3 w-full rounded-lg"
                                                    id="country"
                                                    name="country"
                                                    {...register("country", { required: true })}
                                                    defaultValue={"default"}
                                                >
                                                    <option value="default" disabled>
                                                        Choose Country/Region
                                                    </option>
                                                    <option value="India">Pakistan</option>
                                                </select>
                                                <Icon.CaretDown className="arrow-down" />

                                                {
                                                    errors.country && <span className="text-red">Country is required</span>
                                                }
                                            </div>
                                            <div className="">
                                                <input
                                                    className="border-line px-4 py-3 w-full rounded-lg"
                                                    id="city"
                                                    type="text"
                                                    {...register("city", { required: true })}
                                                    placeholder="Town/City *"
                                                    required
                                                />
                                                {
                                                    errors.city && <span className="text-red">City is required</span>
                                                }
                                            </div>
                                            <div className="">
                                                <input
                                                    className="border-line px-4 py-3 w-full rounded-lg"
                                                    id="street"
                                                    type="text"
                                                    {...register("address", { required: true })}
                                                    placeholder="Street,..."
                                                    required
                                                />
                                                {
                                                    errors.address && <span className="text-red">Address is required</span>
                                                }
                                            </div>
                                            <div className="select-block">
                                                <select
                                                    className="border border-line px-4 py-3 w-full rounded-lg"
                                                    id="state"
                                                    name="state"
                                                    {...register("state", { required: true })}
                                                    defaultValue={"default"}
                                                >
                                                    <option value="default" disabled>
                                                        Choose State
                                                    </option>
                                                    <option value="punjab">Punjab</option>
                                                    <option value="sindh">Sindh</option>
                                                    <option value="balochstan">Balochstan</option>
                                                    <option value="azad-kashmir">Azad Kashmir</option>
                                                    <option value="khyber-pakhtunkhwa">Khyber Pakhtunkhwa</option>
                                                    <option value="gilgit-baltistan">Gilgit-Baltistan</option>
                                                </select>
                                                <Icon.CaretDown className="arrow-down" />
                                                {
                                                    errors.state && <span className="text-red">State is required</span>
                                                }
                                            </div>
                                            <div className="">
                                                <input
                                                    className="border-line px-4 py-3 w-full rounded-lg"
                                                    id="zip"
                                                    type="text"
                                                    {...register("zip", { required: true })}
                                                    placeholder="Postal Code *"
                                                    required
                                                />
                                                {
                                                    errors.zip && <span className="text-red">Zip code is required</span>
                                                }
                                            </div>
                                        </div>
                                        <div className="payment-block md:mt-10 mt-6">
                                            <div className="heading5">Choose payment Option:</div>
                                            {
                                                !isValid ? (
                                                    <Alert
                                                        color="primary"
                                                        icon={<AlertCircle />}
                                                        className="mt-5"
                                                        title="Please fill all the required fields to proceed"
                                                    />
                                                ) :
                                                    <>
                                                        <div className="list-payment mt-5">
                                                            <div
                                                                className={`type bg-surface p-5 border border-line rounded-lg ${activePayment === "credit-card" ? "open" : ""}`}
                                                            >
                                                                <input
                                                                    className="cursor-pointer"
                                                                    type="radio"
                                                                    id="credit"
                                                                    name="payment"
                                                                    checked={activePayment === "credit-card"}
                                                                    onChange={() => handlePayment("credit-card")}
                                                                />
                                                                <label className="text-button pl-2 cursor-pointer" htmlFor="credit">
                                                                    Credit Card
                                                                </label>
                                                                <div className="infor">
                                                                    {clientSecret && (
                                                                        <Elements options={options} stripe={stripePromise}>
                                                                            <CheckoutForm totalAmount={finalAmount} />
                                                                        </Elements>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={`type bg-surface p-5 border border-line rounded-lg mt-5 ${activePayment === "cash-delivery" ? "open" : ""}`}
                                                            >
                                                                <input
                                                                    className="cursor-pointer"
                                                                    type="radio"
                                                                    id="delivery"
                                                                    name="payment"
                                                                    checked={activePayment === "cash-delivery"}
                                                                    onChange={() => handlePayment("cash-delivery")}
                                                                />
                                                                <label className="text-button pl-2 cursor-pointer" htmlFor="delivery">
                                                                    Cash on delivery
                                                                </label>
                                                                <div className="infor">
                                                                    <div className="text-on-surface-variant1 pt-4">
                                                                        Make cash on delivery. Payment will be made directly to the seller.
                                                                    </div>
                                                                    {activePayment === "cash-delivery" && (
                                                                        <div className="block-button md:mt-10 mt-6">
                                                                            <button className="button-main w-full">Complete Order</button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                            }
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="right w-5/12">
                            <div className="checkout-block">
                                <div className="heading5 pb-3">Your Order</div>
                                <div className="list-product-checkout">
                                    {cartState.cartArray.length < 1 ? (
                                        <p className="text-button pt-3">No product in cart</p>
                                    ) : (
                                        cartState.cartArray.map((product) => (
                                            <React.Fragment key={product._id}>
                                                <div className="item flex items-center justify-between w-full pb-5 border-b border-line gap-6 mt-5">
                                                    <div className="bg-img w-[100px] aspect-square flex-shrink-0 rounded-lg overflow-hidden">
                                                        <Image
                                                            src={product.thumbImage[0] || "/placeholder.svg"}
                                                            width={500}
                                                            height={500}
                                                            alt="img"
                                                            className="w-full h-full"
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between w-full">
                                                        <div>
                                                            <div className="name text-title">{product.name}</div>
                                                            <div className="caption1 text-secondary mt-2">
                                                                <span className="size capitalize">{product.selectedSize || product.sizes[0]}</span>
                                                                <span>/</span>
                                                                <span className="color capitalize">
                                                                    {product.selectedColor || product.variation[0].color}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-title">
                                                            <span className="quantity">{product.quantity}</span>
                                                            <span className="px-1">x</span>
                                                            <span>${product.price}.00</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ))
                                    )}
                                </div>
                                <div className="discount-block py-5 flex justify-between border-b border-line">
                                    <div className="text-title">Discounts</div>
                                    <div className="text-title">
                                        -$<span className="discount">{discount}</span>
                                        <span>.00</span>
                                    </div>
                                </div>
                                <div className="ship-block py-5 flex justify-between border-b border-line">
                                    <div className="text-title">Shipping</div>
                                    <div className="text-title">{Number(ship) === 0 ? "Free" : `$${ship}.00`}</div>
                                </div>
                                <div className="total-cart-block pt-5 flex justify-between">
                                    <div className="heading5">Total</div>
                                    <div className="heading5 total-cart">${finalAmount}.00</div>
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

export default Checkout
