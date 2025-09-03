import { LiaStoreAltSolid } from "react-icons/lia";
import incredibleIcon from "../assets/IncredibleOffer.svg"
import { AiFillClockCircle } from "react-icons/ai";
import logoIcon from "../assets/footerlogo2.webp"
import { MdOutlineSecurity } from "react-icons/md";
import deliveryTruck from "../assets/free-delivery.svg"
import imageProduct from "../assets/product/8f3add7de1ba2645f3b43b29d7a5cb46c1068a8d_1749279093.webp"
import imageMainProduct from "../assets/product/3ef95f8e1c9e99c029b7f8911907a1849c9a9752_1749279092.webp"
import { useState } from "react";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import deliveryGrayIcon from "../assets/cash-on-delivery-gray.svg"
import returnGrayIcon from "../assets/days-return-gray.svg"
import expressGRayIcon from "../assets/express-delivery-gray.svg"
import originalGrayIcon from "../assets/original-products-gray.svg"
import supportGrayIcon from "../assets/support-gray.svg"

const InformationSection = ()=>{
    return(
        <>

  <section className="max-w-5xl mx-auto">
    <h2 className="mb-6 text-xl font-bold text-right">ویژگی‌ها</h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
      {/* <!-- Card 1 --> */}
      <div className="bg-white rounded-lg p-4 shadow-sm text-right space-y-1">
        <p className="text-gray-500">نسل پردازنده</p>
        <p className="font-medium">نسل 13 اینتل</p>
      </div>
      {/* <!-- Card 2 --> */}
      <div className="bg-white rounded-lg p-4 shadow-sm text-right space-y-1">
        <p className="text-gray-500 ">ظرفیت حافظه RAM</p>
        <p className="font-medium text-sm">32 گیگابایت</p>
      </div>
      {/* <!-- Card 3 --> */}
      <div className="bg-white rounded-lg p-4 shadow-sm text-right space-y-1">
        <p className="text-gray-500">ظرفیت حافظه داخلی</p>
        <p className="font-medium">یک ترابایت</p>
      </div>
      {/* <!-- Card 4 --> */}
      <div className="bg-white rounded-lg p-4 shadow-sm text-right space-y-1">
        <p className="text-gray-500 ">سازنده پردازنده گرافیکی</p>
        <p className="font-medium">NVIDIA</p>
      </div>
      {/* <!-- Card 5 --> */}
      <div className="bg-white rounded-lg p-4 shadow-sm text-right space-y-1">
        <p className="text-gray-500 ">دقت صفحه نمایش</p>
        <p className="font-medium">Full HD | 1920 × 1080 پیکسل</p>
      </div>
      {/* <!-- Card 6 --> */}
      <div className="bg-white rounded-lg p-4 shadow-sm text-right space-y-1">
        <p className="text-gray-500 ">نرخ بروز رسانی تصویر</p>
        <p className="font-medium">144 هرتز</p>
      </div>
      {/* <!-- Card 7 --> */}
      <div className="bg-white rounded-lg p-4 shadow-sm text-right space-y-1">
        <p className="text-gray-500 ">نسخه‌ی بلوتوث</p>
        <p className="font-medium">5.2</p>
      </div>
      {/* <!-- Card 8 --> */}
      <div className="bg-white rounded-lg p-4 shadow-sm text-right space-y-1">
        <p className="text-gray-500">نورپردازی صفحه کلید</p>
        <p className="font-medium">RGB</p>
      </div>
      {/* <!-- Card 9 --> */}
      <div className="bg-white rounded-lg p-4 shadow-sm text-right space-y-1 ">
        <p className="text-gray-500">قابلیت‌های دستگاه</p>
        <p className="font-medium">صفحه نمایش مات، کیبورد ...</p>
      </div>
    </div>

    <div className="flex justify-center mt-6">
      <button className="z-50 px-6 mb-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition">
        مشاهده همه ویژگی‌ها
      </button>
        <div className="absolute h-[2px] bg-gray-400 w-3/10 mt-[16px]"></div>
    </div>
  </section>

        </>
    )
}

export function ProductItem(){
    const [showOverlay , setShowOverlay] = useState(false);
    const [centeredImage, setCenteredImage]=useState('');

    const handleItemClick = (imageSrc)=>{
        setCenteredImage(imageSrc);
        setShowOverlay(true);
    };
    
    const closeOverlay = ()=>{
        setShowOverlay(false);
    }

    useEffect(()=>{
        if(showOverlay){
            document.body.style.overflow='hidden';
        }else{
            document.body.style.overflow='auto';
        }
        return ()=>{
            document.body.style.overflow = 'auto';
        }
    },[showOverlay])

    return(
    <>
    {/* tags */}
    <div className="flex flex-row-reverse text-gray-500 text-sm justify-between items-center mx-3 py-4 ">
        <div className="flex gap-2">
            <p>فروش در دیجی کالا</p>
            <LiaStoreAltSolid className="w-5 h-5"/>

        </div>
        <div>
            <a href="/">دیجیکالا/کالای دیجیتال/لپ تاپ/لپ تاپ و الترابوک</a>
        </div>
    </div>
    {/* item */}
    <div>
        <div className="w-95/100 m-auto flex gap-2">
            <div className=" w-4/10">
            {/* offer incredible */}
            <div className="bg-red-50 flex text-sm text-red-600 font-semibold justify-between items-center px-3 h-12">
                <div><img src={incredibleIcon} className="w-32" alt="" /></div>
                <div className="flex items-center justify-center gap-2">
                    <p>۱۴ : ۱۲ : ۱۲</p>
                    <AiFillClockCircle className=""/>
                </div>
            </div>
            {/* gallery */}
            <div className=" h-[40rem]">
                {/* image shown */}
                <div onClick={()=>handleItemClick(imageMainProduct)} className="flex justify-center items-center  p-2 w-9/10 m-auto">
                    <img src={imageMainProduct} alt="" />
                </div>
                 {/* Images gallery */}
                <div className="flex gap-2 gallery-items p-2">
                    {[...Array(6)].map((_, index) => (
                    <div key={index} onClick={() => handleItemClick(imageProduct)}>
                        <a href="#">
                        <img src={imageProduct} alt={`Gallery Image ${index + 1}`} />
                        </a>
                    </div>
                    ))}
                </div>
                {/* overlay appears on click */}
                {showOverlay && (
                <div className="fixed inset-0 w-full h-full bg-black z-50">
                    <button 
                        className="text-white absolute top-4 right-4 hover:cursor-pointer"
                        onClick={() => setShowOverlay(false)}
                    >
                        <IoClose className="text-white w-12 h-12"/>
                    </button>
                    {/* Centered main image */}
                    <div className="w-full h-full flex justify-center items-center ">
                        <div className=" h-[24rem] w-[24rem] m-auto">
                            <img src={centeredImage} alt="" className="rounded-lg" id="centered-image"/>
                        </div>
                    </div>
                    {/* Last image positioned below the main image */}
                    <div className="absolute bottom-5 right-0 bg-white transform rounded-lg h-[6rem] w-fit px-3 mx-6 flex gap-2 py-2">
                        
                      {[...Array(6)].map((_, index) => (
              <img 
                key={index} 
                src={imageProduct} 
                alt={`Thumbnail ${index + 1}`} 
                className="h-full w-full object-contain rounded-lg" 
              />
            ))}

                    </div>
                    </div>
                )}
                

            </div>
            </div>
            <div className=" w-6/10">
            
            {/* tag item */}
            <div className="text-[#3cb4c3] font-medium">
                <a href="/">ایسوس / لپ تاپ و الترابوک ایسوس</a>
            </div>
            {/* item name */}
            <div className="py-4 font-semibold text-lg/9">
                <p>لپ تاپ 16 اینچی ایسوس مدل TUF Gaming F16 FX607JU-N3101-i7 13650HX-16GB DDR5-1TB SSD-RTX4050-FHD</p>
            </div>
            
            {/* short info and price */}
            <div className="flex gap-2 ">
                {/* center */}
                <div className=" w-65/100">
                <div className="text-gray-400 text-sm my-2">
                    <p>Asus TUF Gaming F17 FX707VV-HX132-i7 13620H-32GB DDR5-1TB SSD-RTX4060-FHD 144Hz 17.3 inch Laptop
</p>
                </div>
                <div>
                    <p>رنگ : خاکستری</p>
                    <button className="bg-gray-600 rounded-full w-6 h-6 my-2 mr-3"></button>
                </div>
                <InformationSection/>
                
                
                </div>
                <div className="border-1 border-gray-300 w-35/100 bg-gray-100 h-[43rem] rounded-lg p-4">
                {/* seller info */}
                    <div className="border-b-1 border-gray-300 py-2">
                        <div><p>فروشنده</p></div>
                    <div className="flex flex-col text-xs">
                        <img src={logoIcon} alt="" className="w-6" />
                    <div>
                            <p>دیجی کالا</p>
                            <p>عملکرد عالی</p>
                        </div>
                    </div>
                    </div>
                    {/* pricing */}
                    <div className="flex flex-row-reverse gap-3 items-baseline-last text-left py-2">
                            <p className="bg-red-600 text-white w-9 text-sm rounded-xl font-semibold flex items-center justify-center">۳٪</p>
                        <div className="text-gray-400 line-through text-xs">101.499.000</div>
                    </div>
                    <div className="flex justify-end pb-1 -mt-1">
                        <p className="font-semibold">101.499.000 تومان</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[#18686b] py-2">🛒در سبد خرید +50 نفر</p>
                    </div>
                    <div className="bg-[#f04055] text-white h-9 flex justify-center items-center rounded-lg text-xs font-semibold">
                        <p>افزودن به سبد خرید</p>
                    </div>
                    <div className="flex py-4 gap-3 text-gray-700 border-b-1 border-gray-300">
                        <MdOutlineSecurity className="w-6 h-6"/>
                        <p className="text-xs font-semibold">گارانتی ۱۸ ماهه (یکپارچه (سازگار، حامی(ویستا) و آواژنگ))</p>
                    </div>
                    
                </div>
            </div>
            </div>
        </div>
        <div className="w-9/10 m-auto mt-6 flex sell-features">
            <div>
                <img src={expressGRayIcon} className="" alt="" />
                <p>امکان تحویل اکسپرس</p>

            </div>
            <div>
                <img src={returnGrayIcon} className="" alt="" />
                <p>۲۴ ساعته، ۷ روز هفته</p>
            </div>
            <div>
                <img src={deliveryGrayIcon} className="" alt="" />
                <p>امکان پرداخت در محل</p>
            </div>
            <div>
                <img src={originalGrayIcon} className="" alt="" />
                <p>هفت روز ضمانت بازگشت  کالا</p>
            </div>
            <div>
                <img src={supportGrayIcon} className="" alt="" />
                <p>ضمانت اصل بودن کالا</p>
            </div>
        </div>
    </div>
    <div></div>
    <div></div>
    </>)
}