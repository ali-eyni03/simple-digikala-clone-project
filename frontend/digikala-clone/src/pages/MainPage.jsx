import { ImageCarousel } from "../components/ImageCarousel";
import ProductsSection from "../components/ProductSection";
import CategoriesSection from "../components/CategoriesSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainPage() {
    return (
        <>
            <Navbar/>
            <ImageCarousel/>
            <CategoriesSection />
            <ProductsSection 
                title="جدیدترین محصولات" 
            />
            <ProductsSection 
                title="محصولات پرفروش" 
                category={null}
            />
            <ProductsSection 
                title="لوازم دیجیتال" 
                category="electronics"
            />
            
            <Footer/>
        </>
    );
}

export default MainPage;