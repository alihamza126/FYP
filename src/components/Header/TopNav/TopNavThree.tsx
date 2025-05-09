'use client'

import React, { useState } from 'react'
import Link from 'next/link';
import * as Icon from "@phosphor-icons/react/dist/ssr";

interface Props {
    props: string;
}

const TopNavThree: React.FC<Props> = ({ props }) => {
    const [isOpenLanguage, setIsOpenLanguage] = useState(false)
    const [isOpenCurrence, setIsOpenCurrence] = useState(false)
    const [language, setLanguage] = useState('English')
    const [currence, setCurrence] = useState('USD')

    return (
        <>
            <div className={`top-nav md:h-[44px] h-[30px] border-b border-line ${props}`}>
                <div className="container mx-auto h-full">
                    <div className="top-nav-main flex justify-between max-md:justify-center h-full">
                        <div className="left-content flex items-center">
                            <ul className='flex items-center gap-5'>
                                <li>
                                    <Link href={'/pages/about'} className='caption2 hover:underline'>
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link href={'/pages/contact'} className='caption2 hover:underline'>
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link href={'/pages/store-list'} className='caption2 hover:underline'>
                                        Store Location
                                    </Link>
                                </li>
                                <li>
                                    <Link href={'/pages/faqs'} className='caption2 hover:underline'>
                                        Help
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="right-content flex items-center gap-5 max-md:hidden">
                            <Link href={'https://www.facebook.com/'} target='_blank'>
                                <i className="icon-facebook text-black"></i>
                            </Link>
                            <Link href={'https://www.instagram.com/'} target='_blank'>
                                <i className="icon-instagram text-black"></i>
                            </Link>
                            <Link href={'https://www.youtube.com/'} target='_blank'>
                                <i className="icon-youtube text-black"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TopNavThree