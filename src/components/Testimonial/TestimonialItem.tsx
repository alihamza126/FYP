import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { TestimonialType } from '@/type/TestimonialType'
import Rate from '../Other/Rate'

interface TestimonialProps {
    data: TestimonialType
    type: string
}

const TestimonialItem: React.FC<TestimonialProps> = ({ data, type }) => {
    return (
        <>
            <div className="testimonial-item style-seven h-full">
                <div className="testimonial-main bg-white py-8 px-7 rounded-[20px] h-full">
                    <div className="heading flex items-center gap-4">
                        <div className="avatar w-10 h-10 rounded-full overflow-hidden">
                            <Image
                                src={data?.user?.image}
                                width={500}
                                height={500}
                                alt='avatar'
                                className='w-full h-full'
                            />
                        </div>
                        <div className="infor">
                            <Rate currentRate={data?.rating} size={14} />
                            <div className="text-title name">{data?.user?.username}</div>
                        </div>
                    </div>
                    <div className="body1 desc mt-4">{data?.comment}</div>
                </div>
            </div>
        </>
    )
}

export default TestimonialItem