import {createContext, useContext, useState, ReactNode} from 'react';

type CustomerContextType = {
  customerId: number | null;
  setCustomerId: (id: number | null) => void;
};

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider = ({children}: {children: ReactNode}) => {
  const [customerId, setCustomerId] = useState<number | null>(null);
  console.log('CustomerProvider rendered, customerId:', customerId);

  return (
    <CustomerContext.Provider value={{customerId, setCustomerId}}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};
