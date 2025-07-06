// export const backendURL =
//   "https://oracle-chatbot-be-v2-200597748156.europe-west9.run.app";

export const backendURL =
  "https://oracle-chatbot-be-v2-200597748156.europe-west9.run.app";
export const access_token = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("Token not found in localStorage");
    return null;
  }

  return token;
};
