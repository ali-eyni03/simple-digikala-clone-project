import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import pishnahadSvg from "../assets/Amazing.svg"
import pishnahadText from "../assets/Amazing2s.svg"
import { FaAngleLeft } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";
import { Link } from 'react-router-dom';
export function CardItem() {
  return (
    <div className="
        w-90/100
        h-74 
        mx-auto 
        mt-4 
        px-4 
        bg-[#de314d] 
        rounded-2xl 
        flex 
        items-center">
        <Swiper
        modules={[Pagination]}
        centeredSlides={false}
        spaceBetween={4}
        slideToClickedSlide={true}
        dir="rtl"
        breakpoints={{
            1920: {slidesPerView: 8,spaceBetween: 4,},
            1028: {slidesPerView: 8,spaceBetween: 4,},
        }}
        >
        {[1, 2, 3, 4, 5, 6,7,8,9,10,11,12,13,14].map((num) => (
        <SwiperSlide key={num}>
            {num === 1 ? (
            <Link to={`/product/123`} target='_blank' className="bg-none flex justify-center items-center w-full h-64">
                <span className="text-3xl font-semibold text-white w-full flex flex-col justify-center items-center">
                <div className='pb-2 '>
                    <img src={pishnahadText} alt="" className='w-24'/>
                </div>
                <div className='flex flex-row-reverse'>
                    <div className='w-8 h-8 bg-white text-black rounded-sm text-lg flex justify-center items-center'>۰۵</div>
                    <div className='text-white text-xs flex justify-center items-center px-0.5'>:</div>
                    <div className='w-8 h-8 bg-white text-black rounded-sm text-lg flex justify-center items-center'>۲۱</div>
                    <div className='text-white text-xs flex justify-center items-center px-0.5'>:</div>
                    <div className='w-8 h-8 bg-white text-black rounded-sm text-lg flex justify-center items-center'>۲۲</div>
                </div>
                <div><img src={pishnahadSvg} alt="" className='w-20 py-1'/></div>
                <div><a href="#" className='flex justify-center items-center pt-2'>
                    <p className='text-sm font-medium
                    '>مشاهده همه </p>
                    <FaAngleLeft className='w-[12px] h-[12px]'/>
    </a></div>
                </span>
            </Link>):num === 14 ?(
            <Link to={`/product/123`} target='_blank'  className="
                bg-white 
                flex 
                flex-col 
                gap-4 
                rounded-tl-lg 
                rounded-bl-lg 
                justify-center 
                items-center 
                w-full 
                h-64">
                    <div className="text-3xl font-semibold text-[#11bed4] w-10 h-10 rounded-full border-2  flex justify-center items-center">
                    <HiArrowLeft  className='w-[16px] h-[16px]'/>
                    </div>
                    <p className='text-base text-gray-700 font-normal'>مشاهده همه</p>
            </Link>) : num ===2 ?(
            <Link to={`/product/123`} target='_blank'  className="bg-white flex flex-col justify-center items-center w-full h-64 rounded-tr-lg rounded-br-lg">
                <div>
                    <img src="https://dkstatics-public.digikala.com/digikala-products/3ef95f8e1c9e99c029b7f8911907a1849c9a9752_1749279092.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80" alt="" />
                </div>
                <div className='text-[9.5px] w-full text-gray-700 flex justify-center px-2'><p>
                    لپ تاپ 17.3 اینچی ایسوس مدل TUF Gaming F17 ....</p></div>
                <div className='flex justify-between items-center '>
                    {/* discount */}
                    <div 
                    className='
                    w-7 
                    h-4 
                    rounded-lg
                    bg-red-600 
                    text-[10px]
                    font-semibold
                    text-white 
                    flex 
                    justify-center 
                    items-center
                    relative
                    left-3'>
                        <p>۳٪</p>
                    </div>
                    <div className='text-xs flex'>
                        <div className='font-semibold'>
                            <p className='text-base'>۱۰۴,۴۹۹,۰۰۰</p>
                            <p className='text-gray-400 line-through text-[10px] flex justify-end'>۱۰۷,۴۹۹,۰۰۰</p>
                        </div>
                        <p className='relative right-3 top-1.5 font-semibold '>تومان</p>
                    </div>
                </div>
            </Link>
            ): (
            <Link to={`/product/123`} target='_blank'  className="bg-white flex flex-col justify-center items-center w-full h-64">
                <div>
                    <img src="https://dkstatics-public.digikala.com/digikala-products/3ef95f8e1c9e99c029b7f8911907a1849c9a9752_1749279092.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80" alt="" />
                </div>
                <div className='text-[9.5px] w-full text-gray-700 flex justify-center px-2'><p>
                    لپ تاپ 17.3 اینچی ایسوس مدل TUF Gaming F17 ....</p></div>
                <div className='flex justify-between items-center '>
                    {/* discount */}
                    <div 
                    className='
                    w-7 
                    h-4 
                    rounded-lg
                    bg-red-600 
                    text-[10px]
                    font-semibold
                    text-white 
                    flex 
                    justify-center 
                    items-center
                    relative
                    left-3'>
                        <p>۳٪</p>
                    </div>
                    <div className='text-xs flex'>
                        <div className='font-semibold'>
                            <p className='text-base'>۱۰۴,۴۹۹,۰۰۰</p>
                            <p className='text-gray-400 line-through text-[10px] flex justify-end'>۱۰۷,۴۹۹,۰۰۰</p>
                        </div>
                        <p className='relative right-3 top-1.5 font-semibold'>تومان</p>
                    </div>
                </div>
            </Link>
            )}
    </SwiperSlide>
    ))}

        </Swiper>
    </div>
  );
}
