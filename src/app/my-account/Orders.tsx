"use client";

import Axios from '@/lib/Axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react'

const Orders = () => {
  const [activeOrders, setActiveOrders] = useState<string>('all');
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleActiveOrders = (order: string) => {
    setActiveOrders(order)
  }

  // 1) Fetch from API on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await Axios.get('/api/v1/orders/me');
      setOrders(res.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  // 2) Filtered list
  const filtered = orders.filter(o =>
    activeOrders === 'all' ? true : o.status === activeOrders
  );

  return (
    <div>
      <h6 className="heading6">Your Orders</h6>

      {/* Tabs */}
      <div className="w-full overflow-x-auto">
        <div className="menu-tab grid grid-cols-5 max-lg:w-[500px] border-b border-line mt-3">
          {['all', 'pending', 'delivery', 'completed', 'canceled'].map((item, idx) => (
            <button
              key={idx}
              className={`item relative px-3 py-2.5 text-secondary text-center duration-300 hover:text-black border-b-2 ${
                activeOrders === item ? 'active border-black' : 'border-transparent'
              }`}
              onClick={() => handleActiveOrders(item)}
            >
              <span className='relative text-button z-[1]'>{item}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="list_order">
        {filtered.map(order => (
          <div key={order._id} className="order_item mt-5 border border-line rounded-lg box-shadow-xs">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-line">
              <div className="flex items-center gap-2">
                <strong className="text-title">Order Number:</strong>
                <strong className="order_number text-button uppercase">{order.orderId}</strong>
              </div>
              <div className="flex items-center gap-2">
                <strong className="text-title">Order status:</strong>
                <span className={`tag px-4 py-1.5 rounded-full bg-opacity-10 ${
                  order.status === 'pending'   ? 'bg-yellow text-yellow'   :
                  order.status === 'delivery'  ? 'bg-purple text-purple'  :
                  order.status === 'completed' ? 'bg-success text-success' :
                  'bg-red text-red'
                } caption1 font-semibold`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="list_prd px-5">
              {order.items.map(item => (
                <div key={item._id} className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                  <Link href={`/product?id=${item.productId.id}`} className="flex items-center gap-5">
                    <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={item.productId.images[0] || '/images/product/1000x1000.png'}
                        width={1000}
                        height={1000}
                        alt={item.productId.name}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div>
                      <div className="prd_name text-title">{item.productId.name}</div>
                      <div className="caption1 text-secondary mt-2">
                        {/* Example: size/color if present */}
                        {item.size && <><span className="prd_size uppercase">{item.size}</span><span>/</span></>}
                        {item.color && <span className="prd_color capitalize">{item.color}</span>}
                      </div>
                    </div>
                  </Link>
                  <div className='text-title'>
                    <span className="prd_quantity">{item.quantity}</span>
                    <span> X </span>
                    <span className="prd_price">
                      {order.currency.toUpperCase()} {(item.productId.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 p-5">
              <button
                className="button-main"
                onClick={() => {
                  setSelectedOrder(order);
                  setOpenDetail(true);
                }}
              >
                Order Details
              </button>
              {order.status === 'pending' && (
                <button className="button-main bg-surface border border-line hover:bg-black text-black hover:text-white">
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="mt-5 text-center text-secondary">No orders found.</p>
        )}
      </div>

      {/* Modal */}
      {openDetail && selectedOrder && (
        <div className="modal-order-detail-block flex items-center justify-center" onClick={() => setOpenDetail(false)}>
          <div
            className={`modal-order-detail-main grid grid-cols-2 w-[1160px] bg-white rounded-2xl open`}
            onClick={e => e.stopPropagation()}
          >
            {/* Left: Info */}
            <div className="info p-10 border-r border-line">
              <h5 className="heading5">Order Details</h5>
              <div className="list_info grid grid-cols-2 gap-10 gap-y-8 mt-5">
                <div className="info_item">
                  <strong className="text-button-uppercase text-secondary">Contact Information</strong>
                  <h6 className="heading6 order_name mt-2">
                    {selectedOrder.shippingInfo.firstName} {selectedOrder.shippingInfo.lastName}
                  </h6>
                  <h6 className="heading6 order_phone mt-2">
                    {selectedOrder.shippingInfo.phone}
                  </h6>
                  <h6 className="heading6 normal-case order_email mt-2">
                    {selectedOrder.shippingInfo.email}
                  </h6>
                </div>
                <div className="info_item">
                  <strong className="text-button-uppercase text-secondary">Payment method</strong>
                  <h6 className="heading6 order_payment mt-2">
                    {selectedOrder.isCod ? 'Cash on Delivery' : 'Online Payment'}
                  </h6>
                </div>
                <div className="info_item">
                  <strong className="text-button-uppercase text-secondary">Shipping address</strong>
                  <h6 className="heading6 order_shipping_address mt-2">
                    {selectedOrder.shippingInfo.address}, {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state}, {selectedOrder.shippingInfo.zip}
                  </h6>
                </div>
                <div className="info_item">
                  <strong className="text-button-uppercase text-secondary">Billing address</strong>
                  <h6 className="heading6 order_billing_address mt-2">
                    {selectedOrder.shippingInfo.address}, {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state}, {selectedOrder.shippingInfo.zip}
                  </h6>
                </div>
              </div>
            </div>

            {/* Right: Items & totals */}
            <div className="list p-10">
              <h5 className="heading5">Items</h5>
              <div className="list_prd">
                {selectedOrder.items.map(item => (
                  <div key={item._id} className="prd_item flex flex-wrap items-center justify-between gap-3 py-5 border-b border-line">
                    <Link href={`/product?id=${item.productId.id}`} className="flex items-center gap-5">
                      <div className="bg-img flex-shrink-0 md:w-[100px] w-20 aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={item.productId.images[0] || '/images/product/1000x1000.png'}
                          width={1000}
                          height={1000}
                          alt={item.productId.name}
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <div>
                        <div className="prd_name text-title">{item.productId.name}</div>
                        <div className="caption1 text-secondary mt-2">
                          {item.size && <><span className="prd_size uppercase">{item.size}</span><span>/</span></>}
                          {item.color && <span className="prd_color capitalize">{item.color}</span>}
                        </div>
                      </div>
                    </Link>
                    <div className='text-title'>
                      <span className="prd_quantity">{item.quantity}</span>
                      <span> X </span>
                      <span className="prd_price">
                        {selectedOrder.currency.toUpperCase()} {(item.productId.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="flex items-center justify-between mt-5">
                <strong className="text-title">Shipping</strong>
                <strong className="order_ship text-title">Free</strong>
              </div>
              {/* if you have discounts, render here */}
              <div className="flex items-center justify-between mt-5 pt-5 border-t border-line">
                <h5 className="heading5">Subtotal</h5>
                <h5 className="order_total heading5">
                  {selectedOrder.currency.toUpperCase()} {selectedOrder.amount.toFixed(2)}
                </h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
