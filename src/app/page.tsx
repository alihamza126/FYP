'use client'

import React from 'react'
import TopNavThree from '@/components/Header/TopNav/TopNavThree'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import BannerTop from '@/components/Home1/BannerTop'
import TrendingProduct from '@/components/Home1/TrendingProduct'
import productData from '@/data/Product.json'
import Benefit from '@/components/Home1/Benefit'
import FlashSale from '@/components/Home1/FlashSale'
import Brand from '@/components/Home1/Brand'
import Footer from '@/components/Footer/Footer'
import ModalNewsletter from '@/components/Modal/ModalNewsletter'
import TrendingNow from '@/components/Home1/TrendingNow'
import testimonialData from '@/data/Testimonial.json'
import Testimonial from '@/components/Home1/Testimonial'
import Deal from '@/components/Home1/Deal'
import SliderOne from '@/components/Slider/SliderOne'



export default function Home() {
    return (
        <>
            <TopNavThree props="style-three bg-white" />
            <div id="header" className='relative w-full'>
                <MenuTwo />
                <BannerTop props="bg-black py-3" textColor='text-white' bgLine='bg-white' />
                <SliderOne />
            </div>
            <TrendingNow />
            <Deal data={productData} start={4} limit={8} />
            <TrendingProduct data={productData} start={10} limit={18} />
            <FlashSale />
            
            <Testimonial data={testimonialData} limit={5} />
            <Benefit props="md:mt-20 mt-10 py-10 px-2.5 bg-surface rounded-3xl" />
            <Brand />
            <Footer />
            {/* <ModalNewsletter /> */}
        </>
    )
}
