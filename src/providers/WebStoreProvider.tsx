import { createContext, FC, useContext, useState } from "react";
import { User } from "../commons/Types";

interface WebStore {
  cartCount: number;
  categoryCount: number;
  user: User | undefined;
}

interface WebStoreContextProps {
  webStore: WebStore;
  modifyWebStore: (data: Partial<WebStore>) => void;
}

const defaultWebStore: WebStore = {
  cartCount: 0,
  categoryCount: 0,
  user: localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user") as string)
  : undefined
};

const defaultWebStoreContext: WebStoreContextProps = {
    webStore: defaultWebStore,
    modifyWebStore: () => {},
};

export const WebStoreContext = createContext<WebStoreContextProps>(
    defaultWebStoreContext
);

const WebStoreProvider: FC = ({ children }) => {
  const [webStore, setWebStore] = useState(defaultWebStore);

  const modifyWebStore = (data: Partial<WebStore>) => {
    setWebStore((prev) => ({ ...prev, ...data }));
  };

  return (
    <WebStoreContext.Provider value={{webStore, modifyWebStore}}>{children}</WebStoreContext.Provider>
  );
};

export default WebStoreProvider;

export const useWebStore = () => useContext(WebStoreContext)