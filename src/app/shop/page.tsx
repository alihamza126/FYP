'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopBreadCrumb1 from '@/components/Shop/ShopBreadCrumb1'
import productData from '@/data/Product.json'
import Footer from '@/components/Footer/Footer'
import Axios from '@/lib/Axios';
import HandlePagination from '@/components/Other/HandlePagination';

export default function BreadCrumb1() {
    const searchParams = useSearchParams()
    let [type, setType] = useState<string | null | undefined>()
    let datatype = searchParams.get('type')
    let gender = searchParams.get('gender')
    let category = searchParams.get('category');
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});

    const handleFetchData = async (page = 1) => {
        try {
            await Axios.get('/api/v1/product?', {
                params: {
                    category: category,
                    page,
                    limit: 9
                }
            }).then((res) => {
                console.log(res.data);
                setProducts(res.data.products);
                setPagination(res.data.pagination);
            });
        } catch (error) {

        }
    };

    useEffect(() => {
        setType(datatype);
        handleFetchData();
    }, [datatype]);

    const handlePageChange = (selected: number) => {
        console.log(selected);
        handleFetchData(selected+1);
    };




    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
            </div>
            <ShopBreadCrumb1 pageCount={pagination.pages} data={products} productPerPage={9} dataType={type} gender={gender} category={category} />
            {pagination.pages > 1 && (
                <div className="list-pagination flex items-center justify-center mb-10 ">
                    <HandlePagination pageCount={pagination.pages} onPageChange={handlePageChange} />
                </div>
            )}
            <Footer />
        </>
    )
}
