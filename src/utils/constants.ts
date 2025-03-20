export const backendURL =
  "https://oracle-chatbot-backend-200597748156.us-central1.run.app";
export const access_token = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("Token not found in localStorage");
    return null;
  }

  return token;
};
