import cashDelivery from "../assets/cash-on-delivery.svg"
import daysReturn from "../assets/days-return.svg"
import expressDelivery from "../assets/express-delivery.svg"
import supportIcon from "../assets/support.svg"
import originalProducts from "../assets/original-products.svg"
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { SiAparat } from "react-icons/si";
import footerLogo from "../assets/footerlogo2.webp"
import { useState } from 'react';
import moreIcon from "../assets/More.svg"
import myketIcon from "../assets/myket.svg"
import bazarIcon from "../assets/coffe-bazzar.svg"
import sibIcon from "../assets/sib-app.svg"
import { FaAngleUp } from "react-icons/fa";
import  logo from '../assets/full-horizontal.svg'
import enamadIcon from "../assets/logo.png"
import reziIcon from "../assets/rezi.webp"
import sapraIcon from "../assets/sapra.webp"


const Footer = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  
const shortText = `دیجی کالا سال‌هاست که بانی تحول آنلاین شدن خریدهای اینترنتی تبدیل شده است. دیجی کالا به عنوان بزرگترین و معتبرترین فروشگاه آنلاین ایران، شناخته‌شده‌ترین فروشگاه نیز محسوب می‌شود. در فروشگاه آنلاین دیجی کالا در فروشگاه‌های اینترنتی نیز محدودیت می‌شود. تا فروشگاه آنلاین بتوانند جمع کالا در`;

const fullText = `دیجی کالا؛ بزرگترین فروشگاه اینترنتی ایران
دیجی کالا سال‌ها است که به انتخاب اول بسیاری از خریداران اینترنتی تبدیل شده است. دیجی کالا به عنوان بزرگ‌ترین و معتبرترین فروشگاه آنلاین ایران، شناخته‌شده‌ترین فروشگاه نیز محسوب می‌شود. این فروشگاه آنلاین نه‌تنها گسترده‌ترین تنوع کالا را در دسته‌بندی‌های مختلف ارائه می‌دهد، بلکه با خدمات بی‌نظیر، ارسال سریع، ضمانت اصل بودن کالا و پشتیبانی حرفه‌ای، استاندارد جدیدی در خرید اینترنتی ایران تعریف کرده است. این فروشگاه با سال‌ها تجربه و اعتماد مشتریان، کامل‌ترین و بهترین گزینه برای خرید آنلاین در ایران محسوب می‌شود.

ویژگی های مهم دیجی کالا
یکی از ویژگی‌های مهم در خرید از دیجی کالا، تنوع بی‌نظیر محصولات است. این فروشگاه اینترنتی طیف وسیعی از کالاها را در دسته‌های مختلف از جمله لوازم دیجیتال، لوازم خانگی، مد و پوشاک، لوازم آرایشی و بهداشتی، محصولات سلامت و زیبایی، و بسیاری از محصولات دیگر ارائه می‌دهد. به عنوان مثال، اگر به دنبال خرید یک گوشی موبایل جدید باشید، دیجی کالا مجموعه‌ای از بهترین گوشی‌ها از برندهای معتبر اپل و سامسونگ مانند ایفون 16، گوشی S25، گوشی‌های مختلف از برند شیائومی مانند شیائومی نوت ۱۴ و بسیاری از برندهای دیگر را در اختیار شما قرار می‌دهد. همچنین برای علاقه‌مندان به لوازم دیجیتال، این فروشگاه اینترنتی انواع لپ تاپ، تلویزیون، اسپیکر، و هندزفری بلوتوثی با کیفیت بالا را برای خرید آنلاین ارائه می‌دهد. دیجی کالا، مقصدی بی‌پایان برای خرید آسان، سریع و مطمئن است. راهی که هر آنچه نیاز دارید از قیمت لپ تاپ تا یک ایرپاد مطمئن را در اختیار شما قرار می‌دهد. 

ارسال سریع و مطمئن کالا
یکی از مهم‌ترین دغدغه‌های کاربران خرید آنلاین، زمان تحویل کالا است. دیجی کالا برای حل این مشکل، گزینه‌های مختلف ارسال را در نظر گرفته است تا کاربران بتوانند بر اساس نیاز خود، روش ارسال مناسب را انتخاب کنند. به عنوان مثال، ارسال کالا به صورت تحویل امروز با ارسال سریع دیجی‌کالا، از جمله روش‌های خرید سریع از این فروشگاه اینترنتی است. این امکانات باعث می‌شود که خریداران بتوانند سفارش خود را در کوتاه‌ترین زمان ممکن دریافت کنند. علاوه بر این، در صورتی که کالای خریداری شده از لحاظ کیفیت یا هر دلیل دیگری رضایت مشتری را جلب نکرده باشد، دیجی کالا ضمانت بازگشت کالا را ارائه می‌دهد. این ویژگی موجب اعتماد بیشتر مشتریان به خرید آنلاین از فروشگاه اینترنتی دیجی کالا شده است.

تخفیف های ویژه و جشنواره ها
دیجی کالا به طور منظم جشنواره‌ها و تخفیف‌های ویژه‌ای را برگزار می‌کند که برای مشتریان فرصت خرید کالاهای باکیفیت با قیمت‌های مناسب به همراه خواهد داشت. این تخفیف‌ها در ایام خاص مانند بلک فرایدی یا همان حراج جمعه سیاه و جشنواره‌های تابستانی توجه بسیاری از خریداران را جلب می‌کند. در این جشنواره‌ها، دیجی کالا تخفیف‌های عالی روی محصولات مختلف از جمله گوشی‌های موبایل، لپ تاپ‌ها، تلویزیون‌ها، و حتی محصولات زیبایی ارائه می‌دهد. می‌توانید گوشی ایفون 16 یا گوشی S25 را با تخفیف‌های ویژه خریداری کنید و از قیمت مناسب بهره‌مند شوید. دیجی کالا فراتر از یک فروشگاه اینترنتی، یک تجربه خرید مطمئن در بین کاربران مختلف بوده است که با ارائه بزرگ‌ترین تنوع کالا، قیمت‌های مختلف و خدماتی بی‌نقص، به مقصد اول خریداران آنلاین در ایران تبدیل شده است.

انواع محصولات فروشگاه دیجی کالا
دیجی کالا دارای محصولات متنوعی در گروه‌های مختلف است که خرید آنها بسیار راحت و سریع است. به عنوان مثال، اگر به دنبال قاب گوشی یا هندزفری بلوتوثی باشید، می‌توانید مدل‌های مختلف و برندهای گوناگونی را در این فروشگاه پیدا کنید. 

موبایل و کالای دیجیتال
دیجی‌کالا انواع گوشی‌های هوشمند از برندهای معتبر جهانی مانند سامسونگ، اپل، شیائومی و هواوی را با مشخصات و قیمت‌های متنوع عرضه می‌کند. علاوه بر موبایل، دیجی‌کالا مجموعه‌ای از لوازم جانبی مانند هدفون، هندزفری، ساعت‌های هوشمند، تبلت‌ها و لپ تاپ را نیز در اختیار مشتریان قرار می‌دهد. با امکان مقایسه محصولات، مطالعه نظرات کاربران و دسترسی به جدیدترین مدل‌ها، دیجی‌کالا به یکی از مقاصد اصلی خرید آنلاین در حوزه موبایل و کالای دیجیتال تبدیل شده است. از دهه گذشته همواره دیجی کالا به عنوان اولین گزینه برای خرید گوشی های سامسونگ، آیفون های اپل و گوشی شیائومی محسوب می‌شده است و تا امروز هم در عرضه این موبایل های محبوب به بازار، دیجی‌کالا اولین فروشگاه آنلاین بوده است. 

کتاب و لوازم تحریر
کتاب، لوازم تحریر و هنر در دیجی کالا یک مجموعه بی‌نظیر از محصولات فرهنگی و هنری است که به علاقه‌مندان به کتابخوانی، هنر و نوشتن کمک می‌کند تا دنیای خود را گسترش دهند. از کتاب‌های چاپی و کتاب‌های صوتی گرفته تا مجلات خارجی و داخلی و آثار معروف‌ترین نویسندگان مثل سعدی، حافظ، مولانا و فروغ فرخزاد، تمامی نیازهای کتابخوان‌ها را پوشش می‌دهد. همچنین با مجموعه‌ای از لوازم تحریر، ابزار نقاشی و رنگ‌آمیزی، آلبوم‌های عکس و فرش‌های دستبافت، به شما این امکان را می‌دهد تا دنیای هنر و خلاقیت خود را به بهترین نحو پرورش دهید. همچنین خر سال تقریبا همزمان با تهران و نمایشگاه بین المللی کتاب، دیجی کالا نمایشگاه مجازی کتاب خود را برگزار می‌کند تا آنها که فرصت حضور در نمایشگاه را ندارند، بتوانند مجازی از کتاب ها بازدید و خرید کنند. 

لوازم آرایشی و بهداشتی
در دسته محصولات آرایشی و بهداشتی، دیجی کالا مجموعه‌ای از بهترین و پرطرفدارترین برندهای جهانی را در اختیار کاربران قرار می‌دهد. محصولات متنوعی همچون مرطوب كننده‌ها، كرم پودر، ضدآفتاب، ريمل و رژلب از برندهایی مانند لورال، کلینیک و میبلین در دیجی کالا موجود هستند که برای هر سلیقه و نیاز قابل انتخاب هستند. علاوه بر این، شما می‌توانید محصولات مراقبت از پوست و مو مانند شامپو، کرم‌های ضد چروک و ماسک صورت را در این فروشگاه بیابید و خرید آنلاین خود را به راحتی انجام دهید. دیجی کالا، بزرگ‌ترین و معتبرترین فروشگاه آنلاین لوازم آرایشی ایران، جایی که تنوع، کیفیت و اطمینان در خرید یکجا جمع شده‌اند.

خرید آنلاین طلا و جواهرات
دیجی کالا به عنوان بزرگترین فروشگاه اینترنتی ایران، یکی از بهترین گزینه‌ها برای خرید طلا و جواهرات آنلاین است. شما می‌توانید خريد گردنبند طلا، انگشتر طلا، گوشواره زنانه طلا و دستبند طلا را با بهترین قیمت‌ها از دیجی کالا انجام دهید. این فروشگاه مجموعه‌ای از بهترین برندهای طلا و جواهرات را در اختیار مشتریان قرار داده است که انتخاب خرید را برای آنها بسیار آسان می‌کند. همچنین می‌توانید خريد سكه، و حتی ربع سكه را نیز از این فروشگاه با راحت‌ترین روش انجام دهید. 

اسباب بازی
این قسمت شامل تمامی نیازهای ضروری برای مراقبت، بهداشت، سرگرمی و راحتی کودک از بدو تولد تا دوران کودکی است. از لوازم بهداشت و حمام کودک و نوزاد مانند پوشک، دستمال مرطوب، شامپو کودک، حوله و وان حمام نوزاد گرفته تا محصولات ویژه‌ای مثل مینی واش و شامپو کودک و نوزاد، همه در این مجموعه موجود هستند. همچنین برای راحتی بیشتر، انواع پوشاک و کفش کودک و نوزاد از لباس نوزادی تا کفش پسرانه، کوله پشتی پسرانه، لباس دخترانه و کفش دخترانه به صورت آنلاین در دسترس شما قرار دارند.

کودکان به سرگرمی‌های ویژه نیاز دارند، از همین رو دیجی کالا مجموعه‌ای کامل از اسباب بازی‌ها از جمله پازل‌ها، لگو و ساختنی‌ها، عروسک‌ها، فیگورها و اسپینر‌ها را به شما ارائه می‌دهد.

لوازم خانگی و مبلمان
در دسته‌بندی لوازم خانگی، دیجی کالا محصولات متنوعی را ارائه می‌دهد که برای راحتی و زیبایی خانه و آشپزخانه شما طراحی شده‌اند. از جمله مبل راحتی، سرویس‌های خواب، آینه‌های دکوراتیو، و ظروف آشپزخانه که همگی از برندهای معتبر و با کیفیت تولید شده‌اند. شما می‌توانید قابلمه و تابه، یخچال، ماشین لباسشویی و بسیاری از لوازم خانگی دیگر را از دیجی کالا خریداری کنید.

مبل‌های راحتی یکی از پرطرفدارترین محصولات خانگی در دیجی کالا هستند. این مبل‌ها در انواع طرح‌ها و رنگ‌ها و از برندهای معتبر ساخته شده‌اند که با هر دکوراسیونی هماهنگ می‌شوند. همچنین در دیجی کالا  انواع سرویس خواب با کیفیت بالا و طراحی روز دنیا در دسترس است. علاوه بر این، اگر به دنبال آینه دکوراتیو یا سایر لوازم تزئینی منزل هستید، این فروشگاه بهترین انتخاب‌ها را به شما ارائه می‌دهد.

سوپرمارکت دیجی کالا
در دسته‌بندی خوراکی‌ها و کالاهای اساسی دیجی کالا، شما می‌توانید انواع محصولات ضروری و پرمصرف روزانه خود را پیدا کنید. از شیرینی و آجیل تا نان تازه و نبات خوشمزه گرفته و رب گوجه، ماکارونی، قند، رب انار، برنج و شکر و حتی شیر و لبنیات همه این محصولات با بالاترین کیفیت و از برندهای معتبر در دسترس شما قرار دارند. این مجموعه شامل همه آن چیزی است که برای تهیه یک وعده غذایی کامل و سالم به آن نیاز دارید. خرید از سوپر مارکت آنلاین  کمک می‌کند که به راحتی و در کمترین زمان ممکن، مواد اولیه مورد نیاز خود را با قیمت‌های مناسب و با تضمین کیفیت دریافت کنید.

محصولات بومی و محلی
در این بخش از دیجی کالا، از برنج، روغن، عسل طبیعی، حلوا شکری، ارده و کنجد سنتی گرفته تا کیک و شیرینی خانگی، لواشک، برگه و آلوچه خانگی، محصولات اصیل و با کیفیت ارائه می‌شود. همچنین، انواع لبنیات سنتی، کره گیاهی و حیوانی محلی، خرمای محلی و خشکبار و آجیل سنتی به همراه غلات و حبوبات ارگانیک، ادویه‌ها و چاشنی‌های ارگانیک نظیر زعفران و زرشک ارگانیک از دیگر گزینه‌های این دسته هستند. برای علاقه‌مندان به دکوراسیون سنتی نیز، محصولاتی مانند لوستر دست ساز، مجسمه‌های سنتی، گلدان و تابلو سنتی، کاشی و آینه سنتی و ظروف آشپزخانه دست ساز از جنس سنتی وجود دارد که خانه شما را به محیطی گرم و اصیل تبدیل خواهد کرد.

ابزار آلات و تجهیزات
این بخش شامل ابزار برقی و غیر برقی در دیجی کالا مجموعه‌ای کامل از ابزارهای مورد نیاز برای پروژه‌های صنعتی، تعمیرات و ساخت می‌شود. از ابزارهای برقی مانند دریل، پیچ گوشتی، فرز، سنگ رومیزی، موتور برق و مکنده-دمنده گرفته تا ابزارهای غیر برقی مثل ابزار دستی، نردبان، اره و مجموعه ابزار، این دسته برای هر نیازی ابزار مناسب را ارائه می‌دهد. همچنین کمپرسور هوا، دستگاه جوش، هویه و ابزار برش و تراشکاری برای انجام کارهای دقیق صنعتی موجود است. به‌علاوه انواع لوازم روانکاری، چسب صنعتی، پیچ و مهره، ماسک تنفسی، لوازم ایمنی و کار و شیرآلات به تکمیل نیازهای شما برای کارهای ساختمانی و صنعتی کمک می‌کند. دیجی کالا یک راهکار کامل برای پروژه‌های حرفه‌ای و خانگی است.

پوشاک
 از لباس‌های مردانه شامل هودی، سویشرت، ژاکت، پیراهن، شلوار جین، پالتو، کاپشن، کفش و اکسسوری تا پوشاک زنانه نظیر مانتو، بلوز، تیشرت، لباس مجلسی، لباس خواب، کاپشن و کفش زنانه، همگی در این دسته‌بندی موجود هستند. همچنین برای بچگانه‌ها، از لباس‌های راحتی و خواب، پوشاک ورزشی تا کفش و صندل بچگانه، به‌راحتی می‌توانید کالای مناسب را پیدا کنید. این بخش شامل برندهای معتبر مانند هامتو، چرم مشهد، اسمارا، کروم، گردیه و چرم عطارد است که پوشاک با کیفیت بالا را ارائه می‌دهند. خرید آنلاین لباس از دیجی کالا فرصتی برای همه فروشنده های شناخته شده کشور فراهم کرده است تا فروش اینترنتی بیشتری را تجربه کنند. همچنین شما کاربران می‌توانید طیف وسیعی از پوشاک را به راحتی و از طریق پروفایل همیشگی خود در Digikala خریداری کنید. 

تجهیزات پزشکی و سلامت
در این بخش از تجهیزات پزشکی مانند فشارسنج، ترازو، تب سنج و دماسنج گرفته تا دستگاه‌های تنفسی و تجهیزات حرفه‌ای پزشکی، موجود هستند. برای کنترل بیماری‌هایی مانند دیابت و سرماخوردگی، محصولات مناسبی از جمله کیسه نمک، رطوبت‌گیر، و دستگاه‌های تب سنج ارائه می‌شود. علاوه بر این، ماساژور و پد و کیسه آب گرم به شما کمک می‌کنند تا در خانه از تسکین درد و آرامش بیشتری برخوردار شوید.

محصولات ورزشی و سفر
دیجی کالا همچنین برای علاقه‌مندان به ورزش و سفر، محصولات متنوعی را در دسته‌بندی‌های مختلف ارائه می‌دهد. اگر به دنبال خرید وسایل ورزشی برای بدنسازی، ورزش‌های هوازی، یا کمپینگ هستید، دیجی کالا مجموعه‌ای از لوازم ورزشی از جمله وزنه، ساک ورزشی، قمقمه و بسیاری از لوازم دیگر را ارائه می‌دهد. همچنین شما می‌توانید برای سفرهای خود، ساک‌های مسافرتی، کوله پشتی‌های کوهنوردی و لوازم کمپینگ را از این فروشگاه خریداری کنید.

کارت هدیه
کارت هدیه‌ها راهی عالی برای هدیه دادن به عزیزانتان هستند و در دیجی کالا انواع مختلفی از آنها برای مناسبت‌های گوناگون وجود دارد. شما می‌توانید کارت هدیه فیزیکی دیجی کالا را به صورت عمومی یا براساس مناسبت‌های خاص همچون تولد یا سالگرد خریداری کنید. همچنین، کارت هدیه براساس قیمت امکان انتخاب هدیه‌ای مناسب با بودجه شما را فراهم می‌کند. علاوه بر کارت‌های فیزیکی، کارت هدیه الکترونیکی دیجی کالا هم برای افرادی که به دنبال یک گزینه سریع و آسان هستند، وجود دارد.

مکمل های غذایی
دیجی کالا همچنین به عنوان یکی از مراجع معتبر برای خرید مکمل نیز شناخته می‌شود. شما می‌توانید انواع قرص‌های ویتامین، منيزيم، زينك، ويتامين C و بسیاری از مکمل‌های دیگر را از برندهای معروف و معتبر در دیجی کالا پیدا کنید. این مکمل‌ها به سلامت شما کمک می‌کنند و برای تقویت سیستم ایمنی بدن یا افزایش انرژی و بهبود وضعیت پوست و مو مفید هستند.

خرید کالاهای کارکرده
خرید کالاهای کارکرده از دیجی کالا فرصتی عالی برای دسترسی به محصولات با کیفیت و قیمت مناسب است. تمامی کالاهای این دسته‌بندی در وضعیت مشابه‌نو قرار دارند و از نظر فنی و ظاهری کاملا سالم و بدون نقص هستند. همچنین هر کالای کارکرده‌ای که خریداری می‌کنید، دارای 7 روز مهلت تست و ضمانت اصالت است تا شما با خیال راحت از خرید خود اطمینان حاصل کنید. برای گوشی‌های موبایل کارکرده، این فروشگاه 3 ماه گارانتی دیجی کالا سرویس نیز ارائه می‌دهد. از جمله کالاهای کارکرده‌ای که می‌توانید در این دسته پیدا کنید می‌توان به گوشی موبایل کارکرده، لپ تاپ کارکرده، کنسول خانگی کارکرده و ساعت هوشمند کارکرده اشاره کرد. این محصولات با قیمت‌های به‌صرفه، گزینه‌ای مناسب برای کسانی است که به دنبال خرید کالاهای با کیفیت و در عین حال اقتصادی هستند.

در آخر باید گفت خرید از دیجی کالا به دلیل تنوع بالای محصولات، خدمات ارسال سریع، تخفیف‌های ویژه، و امکان خرید آنلاین کالاهای متنوع از برندهای معتبر، یکی از بهترین انتخاب‌ها برای خریداران آنلاین در ایران است. با استفاده از خدمات دیجی کالا، خریدی مطمئن، سریع و راحت را تجربه خواهید کرد.`;

  const footerLinks = {
    withDigikala: {
      title: 'با دیجی‌کالا',
      links: [
        'اتاق خبر دیجی‌کالا',
        'فروش در دیجی‌کالا',
        'فرصت‌های شغلی',
        'گزارش تخلف در دیجی‌کالا'
      ]
    },
    customerService: {
      title: 'خدمات مشتریان',
      links: [
        'پاسخ به پرسش‌های متداول',
        'رویه‌های بازگرداندن کالا',
        'شرایط استفاده',
        'حریم خصوصی'
      ]
    },
    shoppingGuide: {
      title: 'راهنمای خرید از دیجی‌کالا',
      links: [
        'نحوه ثبت سفارش',
        'رویه ارسال سفارش',
        'شیوه‌های پرداخت'
      ]
    },
    followUs: {
      title: 'همراه ما باشید',
      links: []
    }
  };

  const serviceFeatures = [
    {
      image: expressDelivery,
      title: 'امکان تحویل اکسپرس',
    },
    {
      image: cashDelivery,
      title: 'امکان پرداخت در محل',
    },
    {
      image: supportIcon,
      title: '۷ روز هفته، ۲۴ ساعته',
    },
    {
      image: daysReturn,
      title: 'هفت روز ضمانت بازگشت کالا',
    },
    {
      image: originalProducts,
      title: 'ضمانت اصل بودن کالا',
    }
  ];

  const socialLinks = [
    { name: 'instagram', image: <FaInstagram size={28} /> },
    { name: 'twitter', image: <FaTwitter size={28}/>},
    { name: 'linkedin', image: <FaLinkedin size={28}/>},
    { name: 'aparat', image:<SiAparat size={28}/> }
  ];

  const partners = [
    'diginext', 'digikalamehr', 'digikala jet', 'digiclub', 'plus',
    'DIGISTYLE', 'digipay', 'digikalaMAG', 'دیجی‌کالاسرویس', 'digikala BUSINESS',
    'SMARTECH', 'digify', 'GANJE', 'digiexpress'
  ];

  const certificates = [
    { name: 'enamad', image: enamadIcon },
    { name: 'kasbokar', image: sapraIcon },
    { name: 'rezi', image: reziIcon}
  ];

  return (
    <footer className="bg-white text-gray-800 text-sm rtl font-vazir">
      {/* Back to top and support */}
      <div className="border-b  mt-20 border-t-1 pt-3 border-gray-200">
        <div className="container mx-auto py-5 px-4 flex flex-row-reverse justify-between items-center">
        {/* Back to  Top*/}
          <div className="flex justfy-center items-center  bg-white h-12 rounded-lg p-3 border-2 border-gray-200">
            <button 
              onClick={() => window.scrollTo(0, 0)} 
              className="flex  gap-2 justify-center items-center "
            >
            <span className="text-gray-400">بازگشت به بالا</span>
              <FaAngleUp className="text-gray-400" />

            </button>
          </div>


        {/* support */}
          <div className="flex flex-col-reverse justify-end items-start gap-4 text-right ">
            <div className="text-gray-600 flex gap-3 pt-4">
              <div className="flex gap-2 border-l-1 border-gray-400 pl-3">
                    <span>تلفن پشتیبانی</span>
                 <span>021-61930000</span>
              </div>
              <span className="border-l-1 border-gray-400 pl-4">021-91000100</span>
              <div className="text-xs mt-1 ">۷ روز هفته، ۲۴ ساعته پاسخگوی شما هستیم</div>
            </div>
            <img 
              src={logo} 
              alt="دیجی کالا" 
              className="h-8"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='30' viewBox='0 0 120 30'%3E%3Ctext x='10' y='20' font-family='Arial' font-size='16' fill='%23e02444'%3Edigikala%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>
      </div>


      {/* Service features */}
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {serviceFeatures.map((feature, index) => (
              <div key={`service-${index}`} className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mb-3`}>
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-14 h-14 object-cover "
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-xs text-gray-700 leading-relaxed">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Footer links */}
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={`footer-${key}`}>
                {section.title === 'همراه ما باشید' ? (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 cursor-pointer flex justify-between items-center md:cursor-default" 
                        onClick={() => toggleSection(key)}>
                      {section.title}
                      <i className={`fas fa-chevron-${expandedSection === key ? 'up' : 'down'} md:hidden`}></i>
                    </h4>
                    <div className={`${expandedSection === key ? '' : 'hidden'} md:block`}>
                      {/* Social media */}
                      <div className="flex gap-3 mb-6">
                        {socialLinks.map((social, i) => (
                          <a key={`social-${social.name}-${i}`} href="#" className="w-14 h-14 rounded-lg flex items-center justify-center  transition-colors ">
                            {social.image }
                          </a>
                        ))}
                      </div>
                      
                      {/* Email subscription */}
                      <div>
                        <p className="text-gray-700 mb-3 text-lg leading-relaxed">
                          با ثبت ایمیل، از جدیدترین تخفیف‌ها باخبر شوید
                        </p>
                        <div className="flex gap-2 bg-gra">
                          <input 
                            type="email" 
                            placeholder="ایمیل شما" 
                            className="flex-1 px-3 py-4  rounded-lg text-sm focus:outline-none  bg-gray-100"
                          />
                          <button className="px-4 py-2 bg-gray-300 text-white rounded-lg text-sm hover:bg-red-600 transition-colors">
                            ثبت
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-bold text-gray-600 mb-4 cursor-pointer flex justify-between items-center md:cursor-default" 
                        onClick={() => toggleSection(key)}>
                      {section.title}
                      <i className={`fas fa-chevron-${expandedSection === key ? 'up' : 'down'} md:hidden`}></i>
                    </h4>
                    <ul className={`space-y-3 ${expandedSection === key ? '' : 'hidden'} md:block`}>
                      {section.links.map((link, i) => (
                        <li key={`link-${key}-${i}`}>
                          <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors text-sm flex justify-end py-1.5">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* App download section */}
      <div className="py-8 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between bg-[#3c4a6d] w-98/100 m-auto h-20 rounded-lg">
              <div className="flex flex-row-reverse items-center justify-center gap-6 mr-6">
                <h4 className="font-medium text-white  text-xl">دانلود اپلیکیشن دیجی‌کالا</h4>
                <img src={footerLogo} alt="" className="w-12 h-12" />
              </div>
              <div className="flex gap-3 items-center justify-center ml-5">
                <div >
                    <a href="#">
                        <img src={bazarIcon} alt="" className=".socials"/>
                    </a>
                </div>
                <div >
                    <a href="#">
                        <img src={myketIcon} alt="" className=".socials" />
                    </a>
                </div>
                <div >
                    <a href="#">
                        <img src={sibIcon} alt="" className=".socials"/>
                    </a>
                </div>
                <div className="w-11 h-11 bg-white flex items-center justify-center rounded-lg">
                    <a href="#" >
                        <img src={moreIcon} alt="" />
                    </a>
                </div>
              </div>
            </div>
      </div>

      
  
      {/* Certificates - Fixed in right column */}
      <div className="flex flex-row-reverse justify-between">
        <div className="col-span-2 flex items-start justify-end gap-6 pt-6">
        {certificates.map((cert, i) => (
          <div key={`cert-${cert.name}-${i}`} className="bg-white p-5 rounded-lg border border-gray-200 flex items-center justify-center w-28 h-28">
            <img 
              src={cert.image} 
              alt={cert.name}
              className="object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Store description */}
      <div className="col-span-10 p-6 bg-inherit font-sans" dir="rtl">
        <h1 className="text-2xl font-bold mb-4 text-gray-500">
          دیجی کالا، بزرگترین فروشگاه اینترنتی ایران
        </h1>
        
        <div className="relative">
          <div 
            className={`text-gray-400 leading-relaxed text-justify overflow-hidden transition-all duration-500 ease-in-out ${
              isExpanded ? 'max-h-none' : 'max-h-32'
            }`}
            style={{
              WebkitMaskImage: !isExpanded ? 'linear-gradient(180deg, #000 70%, transparent)' : 'none',
              maskImage: !isExpanded ? 'linear-gradient(180deg, #000 70%, transparent)' : 'none'
            }}
          >
            <p className="mb-4">
              {isExpanded ? fullText : shortText}
            </p>
          </div>
          
          <div className="mt-4">
            <button
              onClick={toggleExpansion}
              className=" text-blue-500 px-6 py-2 rounded-md transition-colors duration-200 font-medium"
            >
              {isExpanded ? 'بستن >' : ' مشاهده بیشتر   >'}
            </button>
          </div>
        </div>
    </div>
      </div>
  


      {/* Copyright */}
      <div className="py-4 bg-white border-t border-gray-200 h-20 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            برای استفاده از مطالب دیجی‌کالا، داشتن «هدف غیرتجاری» و ذکر «منبع» کافیست. تمام حقوق این وب‌سایت نیز برای شرکت نوآوران فن آوازه (فروشگاه آنلاین دیجی‌کالا) است.
          </p>
        </div>
      </div>
      {/* Partners */}
      <div className="py-8 bg-[#f0f0f0] border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 md:grid-cols-7 gap-6 items-center">
            {partners.map((partner, i) => (
              <div key={`partner-${i}`} className="flex items-center justify-center h-12">
                <span className="text-gray-400 text-sm font-medium">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;