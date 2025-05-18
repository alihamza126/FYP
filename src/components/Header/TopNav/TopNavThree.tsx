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
                            <Link href={'https://www.facebook.com/AliDeveloper126/'} target='_blank'>
                                <div className="icon-facebook text-xl text-black"></div>
                            </Link>
                            <Link href={'https://www.instagram.com/itx.hamza126/'} target='_blank'>
                                <div className="icon-instagram text-xl text-black"></div>
                            </Link>
                            <Link href={'https://github.com/alihamza126'} target='_blank'>
                                <div className="icon-git text-2xl text-black">
                                    <Icon.GithubLogo size={18} color='#000' />
                                </div>
                            </Link>
                            <Link href={'http://linkedin.com/in/ali-hamza-4aa31021a/'} target='_blank'>
                                <div className="icon-linkedin text-2xl text-black">
                                    <Icon.LinkedinLogo size={18} color='#000' />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TopNavThree