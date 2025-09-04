# 🛒 پلتفرم دیجی کالا ساده 

پروژه تمرینی ساخت یک سایت فروشگاهی مشابه دیجی کالا با استفاده از تکنولوژی‌های مدرن وب. این پروژه شامل فرانت‌اند React و بک‌اند Django می‌باشد.

## 🌐 نسخه دمو استاتیک
**[🔗 مشاهده نسخه استاتیک پروژه](https://ali-eyni03.github.io/simple-digi-project/)**



## 🎯 ویژگی‌های پروژه

### 👤 سیستم کاربری
- 🔐 احراز هویت با شماره موبایل
- 📝 مدیریت پروفایل کاربری کامل
- 🎭 سطوح دسترسی مختلف (کاربر، فروشنده، ادمین)

### 📦 مدیریت محصولات
- 🏷 ثبت محصولات با دسته‌بندی درختی
- 🖼 آپلود چندگانه تصاویر
- 💰 سیستم موجودی و قیمت‌گذاری
- 🎨 مدیریت تنوع‌های محصول (رنگ، سایز، ...)

### 🛍 سبد خرید و سفارشات
- 🛒 سبد خرید پیشرفته با ذخیره‌سازی
- 📍 مدیریت آدرس‌های ارسال

### 🏪 پنل فروشنده
- 📊 داشبورد آماری فروش
- 📦 مدیریت محصولات و موجودی
- 📋 مشاهده سفارشات دریافتی
---

## 🛠 تکنولوژی‌های استفاده شده

<table>
<tr>
<td>

### 🎨 Frontend
- **React**
- **Tailwind CSS**
</td>
<td>

### ⚙️ Backend
- **Django**
- **Django REST Framework**
- **Swagger**

</td>
</tr>
</table>

---

## 🗄 ساختار دیتابیس

برای مشاهده طراحی کامل دیتابیس و روابط بین جداول:

📁 **پوشه `project_digram_tables`** شامل:
- 📊 `digikala_diagram` - نمودار کامل و حدودی سیستم
- 📋 `tables` - جداول و ساختار دیتابیس


## 🚀 نصب و راه‌اندازی

### 🐍 نصب Backend (Django)

```bash
# کلون پروژه
git clone https://github.com/ali-eyni03/your-repo-name.git
cd your-repo-name/backend

# ایجاد محیط مجازی
python -m venv venv
source venv/bin/activate  # Linux/Mac
# یا
venv\Scripts\activate     # Windows

# نصب وابستگی‌ها
pip install -r requirements.txt

# تنظیم متغیرهای محیطی
cp .env.example .env

# مایگریت دیتابیس
python manage.py makemigrations
python manage.py migrate

# ایجاد superuser
python manage.py createsuperuser

# اجرای سرور
python manage.py runserver
```

### ⚛️ نصب Frontend (React)

```bash
# رفتن به پوشه frontend
cd ../frontend

# نصب وابستگی‌ها
npm install

# اجرای سرور توسعه
npm run dev
```

---

## 📚 مستندات API

### 📖 Swagger Documentation
مستندات کامل API با استفاده از **Swagger** در آدرس‌های زیر قابل دسترسی است:

🔗 **مستندات تعاملی**: `http://127.0.0.1:8000/swagger/`  



### 📧 ارتباط با من
- **ایمیل**: ali.eyni1382@gmail.com
- **لینکدین**: [https://www.linkedin.com/in/ali-eyni-018b05180/](https://www.linkedin.com/in/ali-eyni-018b05180/)

---

<div align="center">

### ⭐ اگر این پروژه براتون مفید بود، ممنون میشم ستاره بدید

</div>
