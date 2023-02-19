import './App.css';
import { initializeApp } from 'firebase/app';
import { useState } from 'react';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import { getFirestore } from 'firebase/firestore/lite';
import StockMarketPage from './components/pages/StockMarketPage';
import NavBar from './components/navBar/NavBar';
import { FIREBASE_CONFIG_COMPANIES_STOCK_MARKET_DATA } from './utils/constants';

const App = () => {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  };
  const [COMPANIES_STOCK_MARKET, setCompaniesStockMarket] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(COMPANIES_STOCK_MARKET?.[0]?.id);

  const app = initializeApp(firebaseConfig);
  const remoteConfig = getRemoteConfig(app);
  // remoteConfig.settings.minimumFetchIntervalMillis = 1000000;
  const fireStoreDb = getFirestore(app);

  const fetchDataFromConfigAndUpdate = async () => {
    const isFetchedFromRemote = await fetchAndActivate(remoteConfig);
    console.log(`isFetchedFromRemote: ${isFetchedFromRemote}`);
    const val = getValue(remoteConfig, FIREBASE_CONFIG_COMPANIES_STOCK_MARKET_DATA).asString();
    const jsonObject = JSON.parse(val);
    console.log('FIREBASE_CONFIG_COMPANIES_STOCK_MARKET_DATA', jsonObject);
    setCompaniesStockMarket(jsonObject);
    setSelectedCompanyId(jsonObject?.[0]?.id);
  };

  if (!COMPANIES_STOCK_MARKET?.length) {
    fetchDataFromConfigAndUpdate();
  }

  // remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
  return (
    <div>
      <NavBar
        onCompanyChangeHandler={setSelectedCompanyId}
        selectedCompanyId={selectedCompanyId}
        COMPANIES_STOCK_MARKET={COMPANIES_STOCK_MARKET}
      />
      <StockMarketPage
        fireStoreDb={fireStoreDb}
        selectedCompanyId={selectedCompanyId}
        COMPANIES_STOCK_MARKET={COMPANIES_STOCK_MARKET}
      />
    </div>
  );
};

export default App;
