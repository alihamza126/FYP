'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import BreadcrumbProduct from '@/components/Breadcrumb/BreadcrumbProduct'
import Default from '@/components/Product/Detail/Default';
import Footer from '@/components/Footer/Footer'
import OutOfStock from '@/components/Product/Detail/OutOfStock';
import Axios from '@/lib/Axios';

const ProductDefault = () => {
    const searchParams = useSearchParams()
    let productId = searchParams.get('id');
    const [productData, setProductData] = useState({});
    const [reviews, setReviews] = useState([]);
    const isOut = false;

    const fetchProduct = async () => {
        const res = await Axios.get(`/api/v1/product/${productId}`);
        setProductData(res.data.product);
    }
    useEffect(() => {
        fetchProduct();
    }, [productId]);

    if (productId === null) {
        productId = '1'
    }

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-white" />
                <BreadcrumbProduct />
            </div>
            {

                productData && productData.quantity > 0 &&
                <Default productMain={productData} productId={productId} />
            }
            <Footer />
        </>
    )
}

export default ProductDefault