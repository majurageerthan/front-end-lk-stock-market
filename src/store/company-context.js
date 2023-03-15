/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useState, useMemo } from 'react';

// const SELECTED_COMPANY_DEFAULT = {
//   id: 1803,
//   name: 'EXPOLANKA HOLDINGS PLC',
//   symbol: 'EXPO.N0000',
// };

const SELECTED_COMPANY_DEFAULT = {
  id: '',
  name: '',
  symbol: '',
};

const CompanyContext = createContext({
  selectedCompany: SELECTED_COMPANY_DEFAULT,
  setSelectedCompany: () => {},
});

export const CompanyContextProvider = ({ children }) => {
  const [selectedCompany, setSelectedCompany] = useState(SELECTED_COMPANY_DEFAULT);
  // const contextValue = useMemo(() => [selectedCompany, setSelectedCompany], [selectedCompany]);

  return (
    <CompanyContext.Provider value={{ selectedCompany, setSelectedCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyContext;
