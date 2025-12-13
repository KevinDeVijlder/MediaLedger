import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [refreshToken, setRefreshToken] = useState(0);
  const [successMessage, setSuccessMessage] = useState(null);

  const triggerRefresh = () => {
    setRefreshToken((prev) => prev + 1);
  };

  const notifySuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <AppContext.Provider
      value={{
        refreshToken,
        triggerRefresh,
        successMessage,
        notifySuccess,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
