
import React from 'react'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { ProductType } from '@/type/ProductType'




const BreadcrumbProduct: React.FC = () => {


    return (
        <>
            <div className="breadcrumb-product">
                <div className="main bg-surface md:pt-[88px] pt-[70px] pb-[14px]">
                    <div className="container flex items-center justify-between flex-wrap gap-3">
                        <div className="left flex items-center gap-1">
                            <Link href={'/'} className='caption1 text-secondary2 hover:underline'>Homepage</Link>
                            <Icon.CaretRight size={12} className='text-secondary2' />
                            <div className='caption1 text-secondary2'>Product</div>
                            <Icon.CaretRight size={12} className='text-secondary2' />
                        </div>
                        <div className="right flex items-center gap-3">
                           
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BreadcrumbProduct