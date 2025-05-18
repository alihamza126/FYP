'use client'

import React, { Component } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/effect-fade';


const SliderOne = ({ slidesData }: any) => {
    return (
        <>
            <div className="slider-block style-one bg-linear xl:h-[860px] lg:h-[800px] md:h-[580px] sm:h-[500px] h-[350px] max-[420px]:h-[320px] w-full">
                <div className="slider-main h-full w-full">
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                        pagination={{ clickable: true }}
                        modules={[Pagination, Autoplay]}
                        className='h-full relative'
                        autoplay={{
                            delay: 4000,
                        }}
                    >
                        {
                            slidesData?.map((item: any, index: number) => (
                                <SwiperSlide>
                                    <div className="slider-item h-full w-full relative">
                                        <div className="container w-full h-full flex items-center relative">
                                            <div className="text-content basis-1/2">
                                                <div className="text-sub-display">{item.title}</div>
                                                <div className="text-display md:mt-5 mt-2">{item.content}</div>
                                                <Link href={`/shop/?type=${item.name}`} className="button-main md:mt-8 mt-3">Shop Now</Link>
                                            </div>
                                            <div className="sub-img absolute sm:w-1/2 w-3/5 2xl:-right-[60px] -right-[16px] bottom-0">
                                                <Image
                                                    quality={100}
                                                    src={item.image}
                                                    width={670}
                                                    height={936}
                                                    alt='bg1-1'
                                                    priority={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
            </div>
        </>
    )
}

export default SliderOne