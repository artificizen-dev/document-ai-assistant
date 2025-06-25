import { useEffect, useState } from "react";
import { useAppContext } from "../../Providers/AppContext";
import { access_token, backendURL } from "../../utils/constants";

const PaymentSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<
    "processing" | "success" | "error"
  >("processing");
  const { fetchCredits } = useAppContext();

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get enc_data from localStorage
        const encData = localStorage.getItem("enc_data");

        if (!encData) {
          setPaymentStatus("error");
          setIsProcessing(false);
          return;
        }

        const token = access_token();

        // First API call to /api/payments/response/
        const responseCall = await fetch(
          `${backendURL}/api/payments/response/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              encResponse: encData,
            }),
          }
        );

        if (responseCall.ok) {
          const responseData = await responseCall.json();

          // Second API call to /api/payments/check-status/
          const statusCall = await fetch(
            `${backendURL}/api/payments/check-status/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                clientTxnId: responseData.clientTxnId,
              }),
            }
          );

          if (statusCall.ok) {
            setPaymentStatus("success");
            // Refresh credits after successful payment
            fetchCredits();
            // Clear enc_data from localStorage
            localStorage.removeItem("enc_data");
          } else {
            setPaymentStatus("error");
          }
        } else {
          setPaymentStatus("error");
        }
      } catch (error) {
        console.error("Payment processing error:", error);
        setPaymentStatus("error");
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [fetchCredits]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your credits have been added to your account.
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h2>
        <p className="text-gray-600 mb-6">
          There was an issue processing your payment. Please try again.
        </p>
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
