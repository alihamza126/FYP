export interface OrderType {
    _id: string
    orderId: string
    userId:
      | {
          _id: string
          name?: string
          email?: string
        }
      | string
    items: {
      productId:
        | {
            _id: string
            name?: string
            price?: number
          }
        | string
      quantity: number
    }[]
    shippingInfo: {
      firstName: string
      lastName: string
      email: string
      phone: string
      country: string
      city: string
      address: string
      state: string
      zip: string
    }
    paymentIntentId?: string
    amount: number
    currency: string
    status: string
    isCod: boolean
    paidAt?: string
    createdAt?: string
    updatedAt?: string
  }
  