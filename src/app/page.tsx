import TopNavThree from '@/components/Header/TopNav/TopNavThree'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import BannerTop from '@/components/Home1/BannerTop'
import TrendingProduct from '@/components/Home1/TrendingProduct'
import Benefit from '@/components/Home1/Benefit'
import FlashSale from '@/components/Home1/FlashSale'
import Brand from '@/components/Home1/Brand'
import Footer from '@/components/Footer/Footer'
import TrendingNow from '@/components/Home1/TrendingNow'
import testimonialData from '@/data/Testimonial.json'
import Testimonial from '@/components/Home1/Testimonial'
import Deal from '@/components/Home1/Deal'
import SliderOne from '@/components/Slider/SliderOne'
import Axios from '@/lib/Axios'




export default async function Home() {
    let categoryData = [];
    let trendingNowData = [];
    let slidesData = [];
    let testimonialData = [];
    try {
        const catRes = await Axios.get('/api/v1/category');
        const trendRes = await Axios.get('/api/v1/product');
        const slideRes = await Axios.get('/api/v1/slider');
        const testRes = await Axios.get('/api/v1/review');
        slidesData = slideRes.data.sliders;
        categoryData = catRes.data.categories;
        trendingNowData = trendRes.data.products;
        testimonialData = testRes.data.reviews;
    } catch (error) {

    }

    return (
        <>
            
            <TopNavThree props="style-three bg-white" />
            <div id="header" className='relative w-full'>
                <MenuTwo categoryData={categoryData} />
                <BannerTop props="bg-black py-3" textColor='text-white' bgLine='bg-white' />
                <SliderOne slidesData={slidesData} />
            </div>
            <TrendingNow categoryData={categoryData} />
            <Deal data={trendingNowData} start={0} limit={4} />
            <TrendingProduct data={trendingNowData} start={0} limit={18} />
            {/* <FlashSale /> */}

            <Testimonial data={testimonialData} limit={5} />
            <Benefit props="md:mt-20 mt-10 py-10 px-2.5 bg-surface rounded-3xl" />
            <Brand />
            <Footer />
        </>
    )
}
