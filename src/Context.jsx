import { createContext, useContext, useState } from "react";
import { mockdata } from "./assets/mockData";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(mockdata);
  return (
    <AppContext.Provider value={{ data, setData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);