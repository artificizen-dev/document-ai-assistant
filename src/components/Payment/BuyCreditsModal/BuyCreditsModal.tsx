import React, { useState } from "react";
import { FiX, FiUser } from "react-icons/fi";
import { useAppContext } from "../../../Providers/AppContext";
import { access_token, backendURL } from "../../../utils/constants";

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAppContext();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    credits: "10",
    customCredits: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const creditOptions = [
    { value: "10", label: "10 Credits", price: "Rs. 100" },
    { value: "20", label: "20 Credits", price: "Rs. 200" },
    { value: "30", label: "30 Credits", price: "Rs. 300" },
    { value: "custom", label: "Custom", price: "Custom" },
  ];

  const validateMobile = (mobile: string) => {
    const cleanMobile = mobile.replace(/\D/g, "");
    return cleanMobile.length === 10;
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove all non-digits and limit to 10 digits
    const cleanValue = value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, mobile: cleanValue }));

    if (errors.mobile) {
      setErrors((prev) => ({ ...prev, mobile: "" }));
    }
  };

  const handleCreditsChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      credits: value,
      customCredits: value === "custom" ? "" : prev.customCredits,
    }));
    if (errors.credits) {
      setErrors((prev) => ({ ...prev, credits: "" }));
    }
  };

  const handleCustomCreditsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, customCredits: value }));
    if (errors.credits) {
      setErrors((prev) => ({ ...prev, credits: "" }));
    }
  };

  const getRequestedCredits = () => {
    if (formData.credits === "custom") {
      return parseInt(formData.customCredits) || 0;
    }
    return parseInt(formData.credits);
  };

  const getPrice = () => {
    const credits = getRequestedCredits();
    return credits * 10; // Rs. 10 per credit
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!validateMobile(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    const requestedCredits = getRequestedCredits();
    if (!requestedCredits || requestedCredits < 1) {
      newErrors.credits = "Please select valid credits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const token = access_token();
      const response = await fetch(
        `${backendURL}/api/payments/transaction-form/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            requested_credits: getRequestedCredits(),
            payer_name: formData.name.trim(),
            payer_mobile: formData.mobile,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("transaction_id", data.payment_url);
        localStorage.setItem("client_code", data.client_code);
        localStorage.setItem("enc_data", data.enc_data);

        // Create form element for payment redirection
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.payment_url;

        // Add enc_data field
        const encDataInput = document.createElement("input");
        encDataInput.type = "hidden";
        encDataInput.name = "encData";
        encDataInput.value = data.enc_data;
        form.appendChild(encDataInput);

        // Add client_code field
        const clientCodeInput = document.createElement("input");
        clientCodeInput.type = "hidden";
        clientCodeInput.name = "clientCode";
        clientCodeInput.value = data.client_code;
        form.appendChild(clientCodeInput);

        // Append to body and submit
        document.body.appendChild(form);
        form.submit();

        onClose();
      } else {
        console.error("Payment request failed");
      }
    } catch (error) {
      console.error("Error submitting payment request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <FiUser className="w-6 h-6 text-gray-600" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Buy Credits</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-2 space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email Field (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email account
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500">
              {user?.email || "Loading..."}
            </div>
          </div>

          {/* Mobile Number Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                +91
              </span>
              <input
                type="text"
                value={formData.mobile}
                onChange={handleMobileChange}
                className={`flex-1 px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                  errors.mobile ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter mobile number"
                maxLength={10}
              />
            </div>
            {errors.mobile && (
              <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
            )}
          </div>

          {/* Credits Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Credits
            </label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {creditOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleCreditsChange(option.value)}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    formData.credits === option.value
                      ? "border-black bg-gray-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.price}</div>
                </button>
              ))}
            </div>

            {formData.credits === "custom" && (
              <input
                type="text"
                value={formData.customCredits}
                onChange={handleCustomCreditsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter number of credits"
              />
            )}
            {errors.credits && (
              <p className="mt-1 text-sm text-red-600">{errors.credits}</p>
            )}
          </div>

          {/* Price Display */}
          <div className="text-center">
            <p className="text-lg font-medium text-red-500">
              You will pay Rs. {getPrice()}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "PROCEED TO PAYMENT"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyCreditsModal;
