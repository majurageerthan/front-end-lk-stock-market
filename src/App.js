import './App.css';
import { initializeApp } from 'firebase/app';
import { useState } from 'react';
import StockMarketPage from './components/pages/StockMarketPage';
import NavBar from './components/navBar/NavBar';
import { COMPANIES_STOCK_MARKET } from './utils/constants';

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
  const [selectedCompanyId, setSelectedCompanyId] = useState(COMPANIES_STOCK_MARKET[0].id);

  const app = initializeApp(firebaseConfig);

  return (
    <div>
      <NavBar onCompanyChangeHandler={setSelectedCompanyId} selectedCompanyId={selectedCompanyId} />
      <StockMarketPage firebaseApp={app} selectedCompanyId={selectedCompanyId} />
    </div>
  );
};

export default App;
