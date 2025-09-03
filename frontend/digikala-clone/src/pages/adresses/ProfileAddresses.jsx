import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { 
  FaUser, FaIdCard, FaPhone, FaBirthdayCake, 
  FaEnvelope, FaLock, FaUniversity, FaBriefcase,
  FaCheckCircle, FaExclamationTriangle, FaTimes,
  FaStar, FaRegStar, FaHeart, FaRegHeart, FaShoppingCart,
  FaMapMarkerAlt, FaHome, FaBuilding, FaTrash, FaEdit,
  FaPlus, FaSearch, FaBox, FaComment
} from "react-icons/fa";
import { 
  MdEdit, MdAdd, MdDelete, MdLocationOn, MdMyLocation,
  MdVerified, MdWarning, MdClose, MdCheck, MdHome,
  MdWork, MdMoreVert, MdPhone, MdPerson
} from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

const AuthContext = React.createContext({
  authTokens: { access: "demo-token" },
  user: { id: 1, phone: "09123456789" }
});

const UserComments = () => {
  const { authTokens } = useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  
  const [addressForm, setAddressForm] = useState({
    title: "",
    address: "",
    postal_code: "",
    province: "",
    city: "",
    district: "",
    building_number: "",
    unit: "",
    recipient_name: "",
    recipient_phone: "",
    is_default: false,
    location_lat: null,
    location_lng: null,
    type: "home" 
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  useEffect(() => {
    if (showAddModal && window.google && mapRef.current && !map) {
      initializeMap();
    }
  }, [showAddModal]);

  const initializeMap = () => {
    const defaultLocation = { lat: 35.6892, lng: 51.3890 };
    
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: editingAddress?.location_lat 
        ? { lat: editingAddress.location_lat, lng: editingAddress.location_lng }
        : defaultLocation,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
    });

    const markerInstance = new window.google.maps.Marker({
      map: mapInstance,
      draggable: true,
      position: editingAddress?.location_lat 
        ? { lat: editingAddress.location_lat, lng: editingAddress.location_lng }
        : defaultLocation,
    });

    mapInstance.addListener('click', (event) => {
      markerInstance.setPosition(event.latLng);
      updateLocationFromMap(event.latLng);
    });

    markerInstance.addListener('dragend', (event) => {
      updateLocationFromMap(event.latLng);
    });

    setMap(mapInstance);
    setMarker(markerInstance);
  };

  const updateLocationFromMap = async (latLng) => {
    const lat = latLng.lat();
    const lng = latLng.lng();
    
    setAddressForm(prev => ({
      ...prev,
      location_lat: lat,
      location_lng: lng
    }));

    if (window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const addressComponents = results[0].address_components;
          const formattedAddress = results[0].formatted_address;
          
          let city = '', province = '', postalCode = '';
          addressComponents.forEach(component => {
            if (component.types.includes('locality')) {
              city = component.long_name;
            }
            if (component.types.includes('administrative_area_level_1')) {
              province = component.long_name;
            }
            if (component.types.includes('postal_code')) {
              postalCode = component.long_name;
            }
          });

          setAddressForm(prev => ({
            ...prev,
            address: formattedAddress,
            city: city || prev.city,
            province: province || prev.province,
            postal_code: postalCode || prev.postal_code
          }));
        }
      });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          if (map && marker) {
            map.setCenter(pos);
            marker.setPosition(pos);
            updateLocationFromMap(new window.google.maps.LatLng(pos.lat, pos.lng));
          }
        },
        () => {
          alert("دسترسی به موقعیت مکانی رد شد");
        }
      );
    } else {
      alert("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند");
    }
  };

  const loadAddresses = async () => {
    setAddresses([
      {
        id: 1,
        title: "منزل",
        address: "تهران، خیابان ولیعصر، کوچه گلستان، پلاک ۱۲",
        postal_code: "1234567890",
        province: "تهران",
        city: "تهران",
        district: "ولیعصر",
        building_number: "12",
        unit: "3",
        recipient_name: "علی احمدی",
        recipient_phone: "09123456789",
        is_default: true,
        type: "home",
        location_lat: 35.7219,
        location_lng: 51.3347
      },
      {
        id: 2,
        title: "محل کار",
        address: "تهران، میدان آرژانتین، برج آسمان، طبقه ۱۵",
        postal_code: "9876543210",
        province: "تهران",
        city: "تهران",
        district: "آرژانتین",
        building_number: "1",
        unit: "1501",
        recipient_name: "علی احمدی",
        recipient_phone: "02188776655",
        is_default: false,
        type: "work",
        location_lat: 35.7376,
        location_lng: 51.4186
      }
    ]);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (!addressForm.address || !addressForm.postal_code || !addressForm.recipient_name || !addressForm.recipient_phone) {
        alert("لطفا تمام فیلدهای اجباری را پر کنید");
        return;
      }

      if (editingAddress) {
        setAddresses(prev => prev.map(addr => 
          addr.id === editingAddress.id ? { ...addressForm, id: editingAddress.id } : addr
        ));
      } else {
        const newAddress = { ...addressForm, id: Date.now() };
        setAddresses(prev => [...prev, newAddress]);
      }

      handleCloseModal();
      alert("آدرس با موفقیت ذخیره شد");
    } catch (error) {
      alert("خطا در ذخیره آدرس");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (window.confirm("آیا از حذف این آدرس اطمینان دارید؟")) {
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      alert("آدرس با موفقیت حذف شد");
    }
  };

  const handleSetDefault = async (addressId) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      is_default: addr.id === addressId
    })));
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setAddressForm(address);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingAddress(null);
    setAddressForm({
      title: "",
      address: "",
      postal_code: "",
      province: "",
      city: "",
      district: "",
      building_number: "",
      unit: "",
      recipient_name: "",
      recipient_phone: "",
      is_default: false,
      location_lat: null,
      location_lng: null,
      type: "home"
    });
    setMap(null);
    setMarker(null);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'home': return <FaHome className="text-blue-500" />;
      case 'work': return <FaBuilding className="text-green-500" />;
      default: return <FaMapMarkerAlt className="text-gray-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">آدرس‌های من</h1>
            <p className="text-gray-600 text-sm mt-1">مدیریت آدرس‌های ارسال سفارشات</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <IoMdAdd size={20} />
            افزودن آدرس جدید
          </button>
        </div>
      </div>

      {/* Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`bg-white rounded-lg shadow-sm border-2 ${
              address.is_default ? 'border-blue-400' : 'border-gray-200'
            } p-4 relative`}
          >
            {address.is_default && (
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                پیش‌فرض
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <div className="mt-1">{getTypeIcon(address.type)}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">{address.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{address.address}</p>
                
                <div className="space-y-1 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">کدپستی:</span>
                    <span>{address.postal_code}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdPerson size={16} />
                    <span>{address.recipient_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdPhone size={16} />
                    <span dir="ltr">{address.recipient_phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded"
                  >
                    <FaTrash />
                  </button>
                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-gray-500 hover:bg-gray-50 px-3 py-1 rounded text-sm"
                    >
                      انتخاب به عنوان پیش‌فرض
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingAddress ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <MdClose size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Map Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">موقعیت روی نقشه</label>
                <div className="relative">
                  <div ref={mapRef} className="w-full h-64 rounded-lg border"></div>
                  <button
                    onClick={getCurrentLocation}
                    className="absolute bottom-4 left-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100"
                    title="موقعیت فعلی من"
                  >
                    <MdMyLocation size={20} className="text-blue-500" />
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  برای انتخاب موقعیت، روی نقشه کلیک کنید یا نشانگر را جابجا کنید
                </p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">عنوان آدرس *</label>
                  <input
                    type="text"
                    value={addressForm.title}
                    onChange={(e) => setAddressForm({...addressForm, title: e.target.value})}
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: منزل"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">نوع آدرس</label>
                  <select
                    value={addressForm.type}
                    onChange={(e) => setAddressForm({...addressForm, type: e.target.value})}
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="home">منزل</option>
                    <option value="work">محل کار</option>
                    <option value="other">سایر</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">آدرس کامل *</label>
                  <textarea
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="آدرس دقیق پستی"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">استان *</label>
                  <input
                    type="text"
                    value={addressForm.province}
                    onChange={(e) => setAddressForm({...addressForm, province: e.target.value})}
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: تهران"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">شهر *</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: تهران"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">محله</label>
                  <input
                    type="text"
                    value={addressForm.district}
                    onChange={(e) => setAddressForm({...addressForm, district: e.target.value})}
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: ولیعصر"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">کد پستی *</label>
                  <input
                    type="text"
                    value={addressForm.postal_code}
                    onChange={(e) => setAddressForm({...addressForm, postal_code: e.target.value})}
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="۱۰ رقم"
                    maxLength="10"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">پلاک</label>
                  <input
                    type="text"
                    value={addressForm.building_number}
                    onChange={(e) => setAddressForm({...addressForm, building_number: e.target.value})}
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">واحد</label>
                  <input
                    type="text"
                    value={addressForm.unit}
                    onChange={(e) => setAddressForm({...addressForm, unit: e.target.value})}
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">نام گیرنده *</label>
                  <input
                    type="text"
                    value={addressForm.recipient_name}
                    onChange={(e) => setAddressForm({...addressForm, recipient_name: e.target.value})}
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="نام و نام خانوادگی"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">شماره تماس گیرنده *</label>
                  <input
                    type="tel"
                    value={addressForm.recipient_phone}
                    onChange={(e) => setAddressForm({...addressForm, recipient_phone: e.target.value})}
                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="09123456789"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={addressForm.is_default}
                  onChange={(e) => setAddressForm({...addressForm, is_default: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="is_default" className="text-sm text-gray-700">
                  انتخاب به عنوان آدرس پیش‌فرض
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  انصراف
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {loading ? "در حال ذخیره..." : editingAddress ? "ویرایش آدرس" : "افزودن آدرس"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export  default UserComments;