import './App.css';
import { initializeApp } from 'firebase/app';
import { useEffect, useState } from 'react';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import { getFirestore } from 'firebase/firestore/lite';
import StockMarketPage from './components/pages/StockMarketPage';
import NavBar from './components/navBar/NavBar';
import { FIREBASE_CONFIG_COMPANIES_STOCK_MARKET_DATA } from './utils/constants';
import { getPinnedCompanyIds, removePinnedCompanyId, savePinnedCompanyId } from './utils/localStorageHelper';
import StyledCornerRightButton from './components/atom/StyledCornerRightButton';
import StyledBottomCornerRightButton from './components/atom/StyledBottomCornerRightButton';

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
  const [loading, isLoading] = useState(true);

  const [selectedCompanyId, setSelectedCompanyId] = useState(COMPANIES_STOCK_MARKET?.[0]?.id);
  // const [selectedCompany, setSelectedCompany] = useState(COMPANIES_STOCK_MARKET?.[0]);

  const [pinnedCompanies, setPinnedCompanies] = useState([]);
  const [nextCompaniesByPinned, setNextCompaniesByPinned] = useState([]);

  useEffect(() => {
    setPinnedCompanies(getPinnedCompanyIds());
  }, []);

  useEffect(() => {
    setSelectedCompanyId(pinnedCompanies?.length ? pinnedCompanies?.[0] : COMPANIES_STOCK_MARKET?.[0]?.id);
  }, [COMPANIES_STOCK_MARKET]);

  useEffect(() => {
    const unPinnedCompaniesArray = COMPANIES_STOCK_MARKET?.filter((company) => !pinnedCompanies?.includes(company?.id));
    const pinnedCompaniesArray = COMPANIES_STOCK_MARKET?.filter((company) => pinnedCompanies?.includes(company?.id));
    setNextCompaniesByPinned([...pinnedCompaniesArray, ...unPinnedCompaniesArray]);
  }, [pinnedCompanies, COMPANIES_STOCK_MARKET]);

  const app = initializeApp(firebaseConfig);
  const remoteConfig = getRemoteConfig(app);
  const fireStoreDb = getFirestore(app);

  const fetchDataFromConfigAndUpdate = async () => {
    const isFetchedFromRemote = await fetchAndActivate(remoteConfig);
    console.log(`isFetchedFromRemote: ${isFetchedFromRemote}`);
    const val = getValue(remoteConfig, FIREBASE_CONFIG_COMPANIES_STOCK_MARKET_DATA).asString();
    const jsonSortedObject = JSON.parse(val)?.sort((a, b) => a?.name?.localeCompare(b?.name));
    console.log('FIREBASE_CONFIG_COMPANIES_STOCK_MARKET_DATA', jsonSortedObject);
    setCompaniesStockMarket(jsonSortedObject);
  };

  if (!COMPANIES_STOCK_MARKET?.length) {
    fetchDataFromConfigAndUpdate();
  }

  const onClickPinCompanyHandler = async () => {
    const alreadyPinnedCompanies = getPinnedCompanyIds();

    if (alreadyPinnedCompanies?.includes(selectedCompanyId)) {
      removePinnedCompanyId(selectedCompanyId);
    } else {
      savePinnedCompanyId(selectedCompanyId);
    }

    setPinnedCompanies(getPinnedCompanyIds());
  };

  const onClickNextHandler = async () => {
    const len = nextCompaniesByPinned.length;
    const currentIndex = nextCompaniesByPinned?.findIndex((x) => x.id === selectedCompanyId);
    const next = nextCompaniesByPinned[(currentIndex + 1) % len];
    console.log(next);
    setSelectedCompanyId(next?.id);
  };
  return (
    <div>
      <NavBar
        onCompanyChangeHandler={setSelectedCompanyId}
        selectedCompanyId={selectedCompanyId}
        COMPANIES_STOCK_MARKET={COMPANIES_STOCK_MARKET}
        pinnedCompanies={pinnedCompanies}
      />

      {!loading && (
      <>
        <StyledCornerRightButton
          text={pinnedCompanies?.includes(selectedCompanyId) ? 'UNPIN' : 'PIN'}
          onClick={onClickPinCompanyHandler}
        />
        <StyledBottomCornerRightButton
          text="NEXT"
          onClick={onClickNextHandler}
        />
      </>
      )}

      <StockMarketPage
        fireStoreDb={fireStoreDb}
        selectedCompanyId={selectedCompanyId}
        COMPANIES_STOCK_MARKET={COMPANIES_STOCK_MARKET}
        isLoading={isLoading}
      />

    </div>
  );
};

export default App;
