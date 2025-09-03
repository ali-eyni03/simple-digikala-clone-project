import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import axios from "axios";
import { 
  FaUser, FaIdCard, FaPhone, FaBirthdayCake, 
  FaEnvelope, FaLock, FaUniversity, FaBriefcase,
  FaCheckCircle, FaExclamationTriangle 
} from "react-icons/fa";
import { MdEdit, MdAdd } from "react-icons/md";

const UserPersonalInfo = () => {
	const { authTokens } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    national_id: "",
    birth_date: "",
    email: "",
    shaba_number: "",
    user_job: "",
    phone_number: ""
  });

  const [editMode, setEditMode] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [verificationStatus, setVerificationStatus] = useState({
    identity: false,
    phone: true,
    email: false
  });

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://127.0.0.1:8000/api/accounts/profile/",
        {
          headers: { Authorization: `Bearer ${authTokens?.access}` }
        }
      );
      
      setProfileData({
        ...response.data,
        phone_number: response.data.phone_number || response.data.user || ""
      });

      // Check verification status
      const { first_name, last_name, national_id, email } = response.data;
      setVerificationStatus({
        identity: !!(first_name && last_name && national_id),
        phone: true, // Phone is always verified since they login with it
        email: !!(email && response.data.email_verified)
      });
    } catch (error) {
      showMessage("error", "خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleEdit = (field, value) => {
    setEditMode(field);
    setTempValue(value || "");
  };

  const handleCancel = () => {
    setEditMode(null);
    setTempValue("");
  };

  const handleSave = async (field) => {
    try {
      setLoading(true);
      
      let endpoint = "http://127.0.0.1:8000/api/accounts/profile/update/";
      let data = {};

      if (field === "password") {
        endpoint = "http://127.0.0.1:8000/api/accounts/change-password/";
        const [oldPass, newPass] = tempValue.split("|");
        data = { old_password: oldPass, new_password: newPass };
        await axios.post(endpoint, data, {
          headers: { Authorization: `Bearer ${authTokens?.access}` }
        });
      } else if (field === "phone_number") {
        endpoint = "http://127.0.0.1:8000/api/accounts/change-phone/";
        data = { phone_number: tempValue };
        await axios.post(endpoint, data, {
          headers: { Authorization: `Bearer ${authTokens?.access}` }
        });
      } else {
        data[field] = tempValue;
        await axios.put(endpoint, data, {
          headers: { Authorization: `Bearer ${authTokens?.access}` }
        });
      }

      if (field !== "password") {
        setProfileData(prev => ({ ...prev, [field]: tempValue }));
      }
      
      showMessage("success", "اطلاعات با موفقیت بروزرسانی شد");
      handleCancel();
      
      if (["first_name", "last_name", "national_id"].includes(field)) {
        fetchProfileInfo();
      }
    } catch (error) {
      showMessage("error", error.response?.data?.detail || "خطا در بروزرسانی");
    } finally {
      setLoading(false);
    }
  };

  const validateNationalId = (id) => {
    if (!/^\d{10}$/.test(id)) return false;
    const check = parseInt(id[9]);
    const sum = id.split('').slice(0, 9).reduce((acc, digit, i) => 
      acc + parseInt(digit) * (10 - i), 0) % 11;
    return sum < 2 ? check === sum : check === 11 - sum;
  };

  const profileFields = [
    {
      id: "fullname",
      icon: <FaUser />,
      title: "نام و نام خانوادگی",
      value: `${profileData.first_name} ${profileData.last_name}`.trim() || "-",
      editable: true,
      fields: ["first_name", "last_name"],
      verified: verificationStatus.identity
    },
    {
      id: "national_id",
      icon: <FaIdCard />,
      title: "کد ملی",
      value: profileData.national_id || "-",
      editable: true,
      validate: validateNationalId,
      verified: verificationStatus.identity
    },
    {
      id: "phone_number",
      icon: <FaPhone />,
      title: "شماره موبایل",
      value: profileData.phone_number || "-",
      editable: true,
      verified: verificationStatus.phone
    },
    {
      id: "birth_date",
      icon: <FaBirthdayCake />,
      title: "تاریخ تولد",
      value: profileData.birth_date || "-",
      editable: true,
      type: "date"
    },
    {
      id: "email",
      icon: <FaEnvelope />,
      title: "ایمیل",
      value: profileData.email || "-",
      editable: true,
      type: "email",
      verified: verificationStatus.email
    },
    {
      id: "password",
      icon: <FaLock />,
      title: "رمز عبور",
      value: "••••••••",
      editable: true,
      type: "password"
    },
    {
      id: "shaba_number",
      icon: <FaUniversity />,
      title: "شماره شبا",
      value: profileData.shaba_number || "-",
      editable: true
    },
    {
      id: "user_job",
      icon: <FaBriefcase />,
      title: "شغل",
      value: profileData.user_job || "-",
      editable: true
    }
  ];

  const renderEditField = (field) => {
    if (field.id === "fullname") {
      const [firstName, lastName] = tempValue.split(" ");
      return (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="نام"
            value={firstName || ""}
            onChange={(e) => setTempValue(`${e.target.value} ${lastName || ""}`)}
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="نام خانوادگی"
            value={lastName || ""}
            onChange={(e) => setTempValue(`${firstName || ""} ${e.target.value}`)}
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
    }

    if (field.id === "password") {
      return (
        <div className="flex flex-col gap-2">
          <input
            type="password"
            placeholder="رمز عبور فعلی"
            onChange={(e) => {
              const [, newPass] = tempValue.split("|");
              setTempValue(`${e.target.value}|${newPass || ""}`);
            }}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="رمز عبور جدید"
            onChange={(e) => {
              const [oldPass] = tempValue.split("|");
              setTempValue(`${oldPass || ""}|${e.target.value}`);
            }}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
    }

    return (
      <input
        type={field.type || "text"}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder={field.title}
      />
    );
  };

  if (loading && !profileData.phone_number) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Verification Alert */}
      {!verificationStatus.identity && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-amber-600 text-xl mt-1" />
            <div>
              <h3 className="font-semibold text-amber-900">تکمیل اطلاعات هویتی</h3>
              <p className="text-amber-700 text-sm mt-1">
                با تکمیل اطلاعات هویتی، امنیت حساب کاربری شما افزایش یافته و امکان استفاده از خرید اعتباری فراهم می‌شود.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === "success" 
            ? "bg-green-50 text-green-800 border border-green-200" 
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Information Grid */}
      <div className="bg-white rounded-lg shadow-sm  border-gray-300">
        <div className="p-6 border-b border-gray-300">
          <h2 className="text-xl font-bold text-gray-600">اطلاعات حساب کاربری</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {profileFields.map((field) => (
            <div key={field.id} className="p-4 hover:bg-gray-50 transition-colors">
              {editMode === field.id ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">{field.icon}</span>
                    <span className="font-medium text-gray-700">{field.title}</span>
                    {field.verified && (
                      <FaCheckCircle className="text-green-500 text-sm" />
                    )}
                  </div>
                  {renderEditField(field)}
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                      disabled={loading}
                    >
                      انصراف
                    </button>
                    <button
                      onClick={() => handleSave(field.id === "fullname" ? "first_name" : field.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      disabled={loading}
                    >
                      {loading ? "در حال ذخیره..." : "ذخیره"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">{field.icon}</span>
                    <div>
                      <p className="text-sm text-gray-500">{field.title}</p>
                      <p className="font-medium text-gray-800 mt-1">
                        {field.value}
                        {field.verified && (
                          <span className="mr-2 text-xs text-green-600">✓ تایید شده</span>
                        )}
                      </p>
                    </div>
                  </div>
                  {field.editable && (
                    <button
                      onClick={() => handleEdit(field.id, 
                        field.id === "fullname" 
                          ? `${profileData.first_name} ${profileData.last_name}` 
                          : profileData[field.id]
                      )}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {field.value === "-" ? <MdAdd size={20} /> : <MdEdit size={20} />}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">نکات امنیتی</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• رمز عبور خود را به صورت دوره‌ای تغییر دهید</li>
          <li>• از رمز عبور قوی با ترکیب حروف، اعداد و نمادها استفاده کنید</li>
          <li>• اطلاعات حساب خود را با دیگران به اشتراک نگذارید</li>
        </ul>
      </div>
    </div>
  );
};

export default UserPersonalInfo;