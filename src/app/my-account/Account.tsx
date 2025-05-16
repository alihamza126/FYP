'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Settings from './Settings'
import Orders from './Orders'
import { signOut, useSession } from 'next-auth/react'
import AddressManager from './AddressManager'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import Axios from '@/lib/Axios'


const MyAccount = ({ userData }: { userData: any }) => {
    const [activeTab, setActiveTab] = useState<string | undefined>('dashboard');
    const [activeAddress, setActiveAddress] = useState<string | null>('shipping');
    const [orders, setOrders] = useState([]);
    const [ordersCount, setOrdersCount] = useState(0);
    const [canceledOrdersCount, setCanceledOrdersCount] = useState(0);
    const [shippedOrdersCount, setShippedOrdersCount] = useState(0);

    const { data: session, status } = useSession();

    const fetchOrders = async () => {
        try {
            const res = await Axios.get('/api/v1/orders/me');
            setOrders(res.data.data);
            setOrdersCount(res.data.count);
            const canceledOrders = res.data.data.filter((order: any) => order.status === 'canceled');
            setCanceledOrdersCount(canceledOrders.length);
            const shippedOrders = res.data.data.filter((order: any) => order.status === 'shipped');
            setShippedOrdersCount(shippedOrders.length);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        fetchOrders();
    }, [])

    const handleActiveAddress = (order: string) => {
        setActiveAddress(prevOrder => prevOrder === order ? null : order)
    }


    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuTwo />
                <Breadcrumb heading='My Account' subHeading='My Account' />
            </div>
            <div className="profile-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col w-full ">
                        <div className="left md:w-1/3 w-full xl:pr-[3.125rem] lg:pr-[28px] md:pr-[16px]">
                            <div className=" user-infor bg-surface lg:px-7 px-4 lg:py-10 py-5 md:rounded-[20px] rounded-xl">
                                <div className="heading flex flex-col items-center justify-center">
                                    <div className="avatar">
                                        <Image
                                            src={session?.user?.image || '/images/avatar/1.png'}
                                            width={300}
                                            height={300}
                                            alt='avatar'
                                            className='md:w-[140px] w-[120px] md:h-[140px] h-[120px] rounded-full'
                                        />
                                    </div>
                                    <div className="name heading6 mt-4 text-center">{session?.user?.name}</div>
                                    <div className="mail heading6 font-normal normal-case text-secondary text-center mt-1">{session?.user?.email}</div>
                                </div>
                                <div className="menu-tab w-full max-w-none lg:mt-10 mt-6">
                                    <Link href={'#!'} scroll={false} className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                                        <Icon.HouseLine size={20} />
                                        <strong className="heading6">Dashboard</strong>
                                    </Link>
                                    <Link href={'#!'} scroll={false} className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                                        <Icon.Package size={20} />
                                        <strong className="heading6">History Orders</strong>
                                    </Link>
                                    <Link href={'#!'} scroll={false} className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'address' ? 'active' : ''}`} onClick={() => setActiveTab('address')}>
                                        <Icon.Tag size={20} />
                                        <strong className="heading6">My Address</strong>
                                    </Link>
                                    <Link href={'#!'} scroll={false} className={`item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5 ${activeTab === 'setting' ? 'active' : ''}`} onClick={() => setActiveTab('setting')}>
                                        <Icon.GearSix size={20} />
                                        <strong className="heading6">Setting</strong>
                                    </Link>
                                    <span className="item flex items-center gap-3 w-full px-5 py-4 rounded-lg cursor-pointer duration-300 hover:bg-white mt-1.5">
                                        <Icon.SignOut size={20} />
                                        <strong onClick={() => signOut()} className="heading6">Logout</strong>
                                    </span>
                                </div>
                            </div>
                        </div>


                        <div className="right md:w-2/3 w-full pl-2.5">
                            <div className={`tab text-content w-full ${activeTab === 'dashboard' ? 'block' : 'hidden'}`}>
                                <div className="overview grid sm:grid-cols-3 gap-5">
                                    <div className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                                        <div className="counter">
                                            <span className="text-secondary">Awaiting Pickup</span>
                                            <h5 className="heading5 mt-1">{shippedOrdersCount}</h5>
                                        </div>
                                        <Icon.HourglassMedium className='text-4xl' />
                                    </div>
                                    <div className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                                        <div className="counter">
                                            <span className="text-secondary">Cancelled Orders</span>
                                            <h5 className="heading5 mt-1">{canceledOrdersCount}</h5>
                                        </div>
                                        <Icon.ReceiptX className='text-4xl' />
                                    </div>
                                    <div className="item flex items-center justify-between p-5 border border-line rounded-lg box-shadow-xs">
                                        <div className="counter">
                                            <span className="text-secondary">Total Number of Orders</span>
                                            <h5 className="heading5 mt-1">{ordersCount}</h5>
                                        </div>
                                        <Icon.Package className='text-4xl' />
                                    </div>
                                </div>
                                <div className="recent_order pt-5 px-5 pb-2 mt-7 border border-line rounded-xl">
                                    <h6 className="heading6">Recent Orders</h6>
                                    <div className="list overflow-x-auto w-full mt-5">
                                        <table className="w-full max-[1400px]:w-[700px] max-md:w-[700px]">
                                            <thead className="border-b border-line">
                                                <tr>
                                                    <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap">
                                                        Order
                                                    </th>
                                                    <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap">
                                                        Items
                                                    </th>
                                                    <th className="pb-3 text-left text-sm font-bold uppercase text-secondary whitespace-nowrap">
                                                        Price
                                                    </th>
                                                    <th className="pb-3 text-right text-sm font-bold uppercase text-secondary whitespace-nowrap">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders?.map((order) => (
                                                    <tr key={order._id} className="item duration-300 border-b border-line">
                                                        {/* Order ID */}
                                                        <th scope="row" className="py-3 text-left align-top">
                                                            <strong className="text-title">{order.orderId}</strong>
                                                        </th>

                                                        {/* Product Images */}
                                                        <td className="py-3">
                                                            <div className="flex space-x-2">
                                                                {order.items.map((item) => (
                                                                    <Link href={`product?id=${item.productId.id}`}>
                                                                        <Image
                                                                            key={item._id}
                                                                            src={item?.productId?.images[0] || "/images/product/1000x1000.png"}
                                                                            width={40}
                                                                            height={40}
                                                                            alt={item.productId.name}
                                                                            className="rounded"
                                                                        />
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </td>

                                                        {/* Total Price */}
                                                        <td className="py-3 price">
                                                            {order.currency.toUpperCase()} {order.amount.toFixed(2)}
                                                        </td>

                                                        {/* Status */}
                                                        <td className="py-3 text-right align-top">
                                                            <span
                                                                className={`tag px-4 py-1.5 rounded-full caption1 font-semibold
                                                    ${order.status === "pending"
                                                                        ? "bg-yellow bg-opacity-10 text-yellow"
                                                                        : ""
                                                                    }
                                                    ${order.status === "completed"
                                                                        ? "bg-green bg-opacity-10 text-green"
                                                                        : ""
                                                                    }
                                                    ${order.status === "cancelled"
                                                                        ? "bg-red bg-opacity-10 text-red"
                                                                        : ""
                                                                    }
                                                    `}
                                                            >
                                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className={`tab text-content overflow-hidden w-full p-7 border border-line rounded-xl ${activeTab === 'orders' ? 'block' : 'hidden'}`}>
                                <Orders />
                            </div>
                            <div className={`tab_address text-content w-full p-7 border border-line rounded-xl ${activeTab === 'address' ? 'block' : 'hidden'}`}>
                                <form>
                                    <button
                                        type='button'
                                        className={`tab_btn flex items-center justify-between w-full mt-10 pb-1.5 border-b border-line ${activeAddress === 'shipping' ? 'active' : ''}`}
                                        onClick={() => handleActiveAddress('shipping')}
                                    >
                                        <strong className="heading6">Shipping address</strong>
                                        <Icon.CaretDown className='text-2xl ic_down duration-300' />
                                    </button>

                                    <AddressManager />
                                </form>
                            </div>
                            <div className={`tab text-content w-full p-7 border border-line rounded-xl ${activeTab === 'setting' ? 'block' : 'hidden'}`}>
                                <Settings
                                    image={userData?.image}
                                    firstName={userData?.firstName}
                                    lastName={userData?.lastName}
                                    phone={userData?.phone}
                                    gender={userData?.gender}
                                    dob={userData?.dob}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default MyAccount