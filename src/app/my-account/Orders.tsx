import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'

const Orders = () => {
    const [activeOrders, setActiveOrders] = useState<string | undefined>('all');
    const [openDetail, setOpenDetail] = useState<boolean | undefined>(false);
    const { session: data } = useSession();

    const handleActiveOrders = (order: string) => {
        setActiveOrders(order)
    }

    return (
        <div>
            <h6 className="heading6">Your Orders</h6>
            <div className="w-full overflow-x-auto">
                <div className="menu-tab grid grid-cols-5 max-lg:w-[500px] border-b border-line mt-3">
                    {['all', 'pending', 'delivery', 'completed', 'canceled'].map((item, index) => (
                        <button
                            key={index}
                            className={`item relative px-3 py-2.5 text-secondary text-center duration-300 hover:text-black border-b-2 ${activeOrders === item ? 'active border-black' : 'border-transparent'}`}
                            onClick={() => handleActiveOrders(item)}
                        >
                            {/* {activeOrders === item && (
                                                <motion.span layoutId='active-pill' className='absolute inset-0 border-black border-b-2'></motion.span>
                                                )} */}
                            <span className='relative text-button z-[1]'>
                                {item}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="list_order">
                <div className="order_item mt-5 border border-line rounded-lg box-shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-line">
                        <div className="flex items-center gap-2">
                            <strong className="text-title">Order Number:</strong>
                            <strong className="order_number text-button uppercase">s184989823</strong>
                        </div>
                        <div className="flex items-center gap-2">
                            <strong className="text-title">Order status:</strong>
                            <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-purple text-purple caption1 font-semibold">Delivery</span>
                        </div>
                    </div>
                    <div className="list_prd px-5">
                        <div className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                            <Link href={'/product/default'} className="flex items-center gap-5">
                                <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                                    <Image
                                        src={'/images/product/1000x1000.png'}
                                        width={1000}
                                        height={1000}
                                        alt={'Contrasting sheepskin sweatshirt'}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                                <div>
                                    <div className="prd_name text-title">Contrasting sheepskin sweatshirt</div>
                                    <div className="caption1 text-secondary mt-2">
                                        <span className="prd_size uppercase">XL</span>
                                        <span>/</span>
                                        <span className="prd_color capitalize">Yellow</span>
                                    </div>
                                </div>
                            </Link>
                            <div className='text-title'>
                                <span className="prd_quantity">1</span>
                                <span> X </span>
                                <span className="prd_price">$45.00</span>
                            </div>
                        </div>
                        <div className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                            <Link href={'/product/default'} className="flex items-center gap-5">
                                <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                                    <Image
                                        src={'/images/product/1000x1000.png'}
                                        width={1000}
                                        height={1000}
                                        alt={'Contrasting sheepskin sweatshirt'}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                                <div>
                                    <div className="prd_name text-title">Contrasting sheepskin sweatshirt</div>
                                    <div className="caption1 text-secondary mt-2">
                                        <span className="prd_size uppercase">XL</span>
                                        <span>/</span>
                                        <span className="prd_color capitalize">White</span>
                                    </div>
                                </div>
                            </Link>
                            <div className='text-title'>
                                <span className="prd_quantity">2</span>
                                <span> X </span>
                                <span className="prd_price">$70.00</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 p-5">
                        <button className="button-main" onClick={() => setOpenDetail(true)}>Order Details</button>
                        <button className="button-main bg-surface border border-line hover:bg-black text-black hover:text-white">Cancel Order</button>
                    </div>
                </div>
                <div className="order_item mt-5 border border-line rounded-lg box-shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-line">
                        <div className="flex items-center gap-2">
                            <strong className="text-title">Order Number:</strong>
                            <strong className="order_number text-button uppercase">s184989824</strong>
                        </div>
                        <div className="flex items-center gap-2">
                            <strong className="text-title">Order status:</strong>
                            <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-yellow text-yellow caption1 font-semibold">Pending</span>
                        </div>
                    </div>
                    <div className="list_prd px-5">
                        <div className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                            <Link href={'/product/default'} className="flex items-center gap-5">
                                <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                                    <Image
                                        src={'/images/product/1000x1000.png'}
                                        width={1000}
                                        height={1000}
                                        alt={'Contrasting sheepskin sweatshirt'}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                                <div>
                                    <div className="prd_name text-title">Contrasting sheepskin sweatshirt</div>
                                    <div className="caption1 text-secondary mt-2">
                                        <span className="prd_size uppercase">L</span>
                                        <span>/</span>
                                        <span className="prd_color capitalize">Pink</span>
                                    </div>
                                </div>
                            </Link>
                            <div className='text-title'>
                                <span className="prd_quantity">1</span>
                                <span> X </span>
                                <span className="prd_price">$69.00</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 p-5">
                        <button className="button-main" onClick={() => setOpenDetail(true)}>Order Details</button>
                        <button className="button-main bg-surface border border-line hover:bg-black text-black hover:text-white">Cancel Order</button>
                    </div>
                </div>
                <div className="order_item mt-5 border border-line rounded-lg box-shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-line">
                        <div className="flex items-center gap-2">
                            <strong className="text-title">Order Number:</strong>
                            <strong className="order_number text-button uppercase">s184989824</strong>
                        </div>
                        <div className="flex items-center gap-2">
                            <strong className="text-title">Order status:</strong>
                            <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-success text-success caption1 font-semibold">Completed</span>
                        </div>
                    </div>
                    <div className="list_prd px-5">
                        <div className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                            <Link href={'/product/default'} className="flex items-center gap-5">
                                <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                                    <Image
                                        src={'/images/product/1000x1000.png'}
                                        width={1000}
                                        height={1000}
                                        alt={'Contrasting sheepskin sweatshirt'}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                                <div>
                                    <div className="prd_name text-title">Contrasting sheepskin sweatshirt</div>
                                    <div className="caption1 text-secondary mt-2">
                                        <span className="prd_size uppercase">L</span>
                                        <span>/</span>
                                        <span className="prd_color capitalize">White</span>
                                    </div>
                                </div>
                            </Link>
                            <div className='text-title'>
                                <span className="prd_quantity">1</span>
                                <span> X </span>
                                <span className="prd_price">$32.00</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 p-5">
                        <button className="button-main" onClick={() => setOpenDetail(true)}>Order Details</button>
                        <button className="button-main bg-surface border border-line hover:bg-black text-black hover:text-white">Cancel Order</button>
                    </div>
                </div>
                <div className="order_item mt-5 border border-line rounded-lg box-shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-line">
                        <div className="flex items-center gap-2">
                            <strong className="text-title">Order Number:</strong>
                            <strong className="order_number text-button uppercase">s184989824</strong>
                        </div>
                        <div className="flex items-center gap-2">
                            <strong className="text-title">Order status:</strong>
                            <span className="tag px-4 py-1.5 rounded-full bg-opacity-10 bg-red text-red caption1 font-semibold">Canceled</span>
                        </div>
                    </div>
                    <div className="list_prd px-5">
                        <div className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                            <Link href={'/product/default'} className="flex items-center gap-5">
                                <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                                    <Image
                                        src={'/images/product/1000x1000.png'}
                                        width={1000}
                                        height={1000}
                                        alt={'Contrasting sheepskin sweatshirt'}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                                <div>
                                    <div className="prd_name text-title">Contrasting sheepskin sweatshirt</div>
                                    <div className="caption1 text-secondary mt-2">
                                        <span className="prd_size uppercase">M</span>
                                        <span>/</span>
                                        <span className="prd_color capitalize">Black</span>
                                    </div>
                                </div>
                            </Link>
                            <div className='text-title'>
                                <span className="prd_quantity">1</span>
                                <span> X </span>
                                <span className="prd_price">$49.00</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 p-5">
                        <button className="button-main" onClick={() => setOpenDetail(true)}>Order Details</button>
                        <button className="button-main bg-surface border border-line hover:bg-black text-black hover:text-white">Cancel Order</button>
                    </div>
                </div>
            </div>





            {/* //modal */}

            <div className={`modal-order-detail-block flex items-center justify-center`} onClick={() => setOpenDetail(false)}>
                <div className={`modal-order-detail-main grid grid-cols-2 w-[1160px] bg-white rounded-2xl ${openDetail ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                    <div className="info p-10 border-r border-line">
                        <h5 className="heading5">Order Details</h5>
                        <div className="list_info grid grid-cols-2 gap-10 gap-y-8 mt-5">
                            <div className="info_item">
                                <strong className="text-button-uppercase text-secondary">Contact Information</strong>
                                <h6 className="heading6 order_name mt-2">Tony nguyen</h6>
                                <h6 className="heading6 order_phone mt-2">(+12) 345 - 678910</h6>
                                <h6 className="heading6 normal-case order_email mt-2">hi.avitex@gmail.com</h6>
                            </div>
                            <div className="info_item">
                                <strong className="text-button-uppercase text-secondary">Payment method</strong>
                                <h6 className="heading6 order_payment mt-2">cash delivery</h6>
                            </div>
                            <div className="info_item">
                                <strong className="text-button-uppercase text-secondary">Shipping address</strong>
                                <h6 className="heading6 order_shipping_address mt-2">2163 Phillips Gap Rd, West Jefferson, North Carolina, US</h6>
                            </div>
                            <div className="info_item">
                                <strong className="text-button-uppercase text-secondary">Billing address</strong>
                                <h6 className="heading6 order_billing_address mt-2">2163 Phillips Gap Rd, West Jefferson, North Carolina, US</h6>
                            </div>
                            <div className="info_item">
                                <strong className="text-button-uppercase text-secondary">Company</strong>
                                <h6 className="heading6 order_company mt-2">Avitex Technology</h6>
                            </div>
                        </div>
                    </div>
                    <div className="list p-10">
                        <h5 className="heading5">Items</h5>
                        <div className="list_prd">
                            <div className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                                <Link href={'/product/default'} className="flex items-center gap-5">
                                    <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                                        <Image
                                            src={'/images/product/1000x1000.png'}
                                            width={1000}
                                            height={1000}
                                            alt={'Contrasting sheepskin sweatshirt'}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                    <div>
                                        <div className="prd_name text-title">Contrasting sheepskin sweatshirt</div>
                                        <div className="caption1 text-secondary mt-2">
                                            <span className="prd_size uppercase">XL</span>
                                            <span>/</span>
                                            <span className="prd_color capitalize">Yellow</span>
                                        </div>
                                    </div>
                                </Link>
                                <div className='text-title'>
                                    <span className="prd_quantity">1</span>
                                    <span> X </span>
                                    <span className="prd_price">$45.00</span>
                                </div>
                            </div>
                            <div className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                                <Link href={'/product/default'} className="flex items-center gap-5">
                                    <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                                        <Image
                                            src={'/images/product/1000x1000.png'}
                                            width={1000}
                                            height={1000}
                                            alt={'Contrasting sheepskin sweatshirt'}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                    <div>
                                        <div className="prd_name text-title">Contrasting sheepskin sweatshirt</div>
                                        <div className="caption1 text-secondary mt-2">
                                            <span className="prd_size uppercase">XL</span>
                                            <span>/</span>
                                            <span className="prd_color capitalize">White</span>
                                        </div>
                                    </div>
                                </Link>
                                <div className='text-title'>
                                    <span className="prd_quantity">2</span>
                                    <span> X </span>
                                    <span className="prd_price">$70.00</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-5">
                            <strong className="text-title">Shipping</strong>
                            <strong className="order_ship text-title">Free</strong>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <strong className="text-title">Discounts</strong>
                            <strong className="order_discounts text-title">-$80.00</strong>
                        </div>
                        <div className="flex items-center justify-between mt-5 pt-5 border-t border-line">
                            <h5 className="heading5">Subtotal</h5>
                            <h5 className="order_total heading5">$105.00</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Orders