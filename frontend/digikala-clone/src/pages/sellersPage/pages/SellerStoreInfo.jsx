import { useState } from "react";

const SellerStoreInfo = () => {
  const [selectedBank, setSelectedBank] = useState("");
  const [open, setOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState({
    idImage: [],
    profileImage: []
  });
  const [modalImage, setModalImage] = useState(null);

  const banks = [
    "بانک ملی",
    "بانک ملت",
    "بانک تجارت",
    "بانک صنعت و معدن",
    "بانک کشاورزی",
    "بانک مسکن",
    "بانک صادرات",
    "بانک رفاه",
    "بانک سپه",
    "بانک توسعه",
    "بانک پاسارگاد",
    "بانک اقتصاد نوین",
    "بانک پارسیان",
    "بانک سرمایه",
    "بانک سامان",
    "بانک گردشگری",
    "بانک سینا",
    "بانک دی",
    "بانک شهر",
  ];

  const tabs = [
    { id: "seller", label: "اطلاعات فروشنده" },
    { id: "bank", label: "اطلاعات حساب بانکی" },
    { id: "contact", label: "اطلاعات تماس" },
    { id: "address", label: "آدرس" },
  ];

  const [activeTab, setActiveTab] = useState("seller");

  const inputClasses = "bg-gray-50 w-7/10 rounded-lg h-10 outline-none border-2 border-transparent focus:border-blue-400 focus:text-gray-700 transition-colors duration-200 pr-2 flex items-center justify-center p-2";

  const handleFileUpload = (event, imageType) => {
    const files = Array.from(event.target.files);
    const newImages = [];

    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            file: file,
            url: e.target.result,
            name: file.name
          };
          newImages.push(newImage);
          
          setUploadedImages(prev => ({
            ...prev,
            [imageType]: [...prev[imageType], newImage]
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageType, imageId) => {
    setUploadedImages(prev => ({
      ...prev,
      [imageType]: prev[imageType].filter(img => img.id !== imageId)
    }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mt-4 border border-gray-200">
      {/* تب‌ها */}
      <div className="flex mb-4 justify-between p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-medium cursor-pointer ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* محتوای تب‌ها */}
      <div>
        {activeTab === "seller" && (
          <div className="space-y-4 grid grid-cols-2 gap-4 p-2">
            <div className="flex gap-2 items-center justify-baseline">
              <label htmlFor="first-name">نام :</label>
              <input
                type="text"
                placeholder=""
                className={inputClasses}
                id="first-name"
              />
            </div>
            <div className="flex gap-2 items-center justify-baseline">
              <label htmlFor="last-name">نام خانوادگی :</label>
              <input
                type="text"
                placeholder=""
                className={inputClasses}
                id="last-name"
              />
            </div>

            <div className="flex gap-2 items-center justify-baseline">
              <label htmlFor="national-id">کد ملی :</label>
              <input
                id="national-id"
                type="text"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className={inputClasses}
              />
            </div>
            <div className="flex gap-2 items-center justify-baseline">
              <label htmlFor="seller-id">شماره شناسنامه :</label>
              <input
                id="seller-id"
                type="text"
                placeholder=""
                className={inputClasses}
              />
            </div>

            <div className="flex gap-2 items-center justify-baseline">
              <label htmlFor="birth-date">تاریخ تولد :</label>
              <input
                id="birth-date"
                type="date"
                className={inputClasses}
              />
            </div>
            <div className="flex gap-2 items-center justify-baseline">
              <label htmlFor="id-image">تصویر شناسنامه :</label>
              <div className="w-7/10">
                <input
                  id="id-image"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'idImage')}
                  className={inputClasses}
                />
                {/* Image Gallery for ID Images */}
                {uploadedImages.idImage.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {uploadedImages.idImage.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors"
                          onClick={() => setModalImage(image)}
                        />
                        <button
                          onClick={() => removeImage('idImage', image.id)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate">
                          {image.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 items-center justify-baseline">
              <label htmlFor="profile-image">تصویر پروفایل :</label>
              <div className="w-7/10">
                <input
                  id="profile-image"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'profileImage')}
                  className={inputClasses}
                />
                {/* Image Gallery for Profile Images */}
                {uploadedImages.profileImage.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {uploadedImages.profileImage.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors"
                          onClick={() => setModalImage(image)}
                        />
                        <button
                          onClick={() => removeImage('profileImage', image.id)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate">
                          {image.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "bank" && (
          <div className="space-y-4 grid grid-cols-2 gap-4 p-2">
            <div className="flex gap-2 items-center justify-baseline">
              <label htmlFor="account-holder">نام کامل صاحب حساب:</label>
              <input
                type="text"
                placeholder=""
                className={inputClasses}
                id="account-holder"
              />
            </div>

            <div className="flex gap-2 items-center justify-baseline">
              <label htmlFor="shaba-number">شماره شبا :</label>
              <input
                id="shaba-number"
                type="text"
                placeholder="شماره شبا (IR...)"
                className={inputClasses}
              />
            </div>
            <div className="flex gap-2 items-center justify-baseline">
              <label htmlFor="card-number">شماره کارت :</label>
              <input
                id="card-number"
                type="text"
                placeholder="XXXX XXXX XXXX XXXX"
                className={inputClasses}
              />
            </div>
            <div className="flex gap-2 items-center justify-baseline">
              <label htmlFor="bank-name">نام بانک :</label>
              <div className="relative w-7/10">
                <input
                  id="bank-name"
                  type="text"
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  onFocus={() => setOpen(true)}
                  onBlur={() => setTimeout(() => setOpen(false), 200)}
                  placeholder="نام بانک را انتخاب کنید"
                  className={inputClasses}
                />
                {/* Dropdown */}
                {open && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-32 overflow-y-auto z-50 mt-1">
                    {banks
                      .filter((bank) => bank.includes(selectedBank))
                      .map((bank, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-right border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            setSelectedBank(bank);
                            setOpen(false);
                          }}
                        >
                          {bank}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-4 grid grid-cols-2 gap-4 p-2">
            <div className="flex gap-2 items-center justify-baseline">
              <label htmlFor="mobile">شماره موبایل :</label>
              <input
                id="mobile"
                type="text"
                placeholder="شماره موبایل"
                className={inputClasses}
              />
            </div>
            <div className="flex gap-2 items-center justify-baseline">
              <label htmlFor="phone">شماره تلفن ثابت :</label>
              <input
                id="phone"
                type="text"
                placeholder="شماره تلفن ثابت"
                className={inputClasses}
              />
            </div>
            <div className="flex gap-2 items-center justify-baseline col-span-2">
              <label htmlFor="email">ایمیل :</label>
              <input
                id="email"
                type="email"
                placeholder="ایمیل"
                className={inputClasses}
              />
            </div>
          </div>
        )}

        {activeTab === "address" && (
          <div className="space-y-4 grid grid-cols-2 gap-4 p-2">
            <div className="flex gap-2 items-center justify-baseline">
              <label htmlFor="province">استان :</label>
              <input
                id="province"
                type="text"
                placeholder="استان"
                className={inputClasses}
              />
            </div>
            <div className="flex gap-2 items-center justify-baseline">
              <label htmlFor="city">شهر :</label>
              <input
                id="city"
                type="text"
                placeholder="شهر"
                className={inputClasses}
              />
            </div>
            <div className="flex gap-2 items-center justify-baseline">
              <label htmlFor="street">خیابان / محله :</label>
              <input
                id="street"
                type="text"
                placeholder="خیابان / محله"
                className={inputClasses}
              />
            </div>
            <div className="flex gap-2 items-center justify-baseline">
              <label htmlFor="plate">پلاک :</label>
              <input
                id="plate"
                type="text"
                placeholder="پلاک"
                className={inputClasses}
              />
            </div>
            <div className="flex gap-2 items-center justify-baseline col-span-2">
              <label htmlFor="postal-code">کد پستی :</label>
              <input
                id="postal-code"
                type="text"
                placeholder="کد پستی"
                className={inputClasses}
              />
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setModalImage(null)}>
          <div className="relative max-w-4xl max-h-full p-4">
            <img
              src={modalImage.url}
              alt={modalImage.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-red-600 transition-colors"
            >
              ×
            </button>
            <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded text-center">
              {modalImage.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerStoreInfo;