import './App.css';
import { initializeApp } from 'firebase/app';
import {
  Suspense, lazy, useEffect, useState,
} from 'react';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import { getFirestore } from 'firebase/firestore/lite';
import { BUTTON_POSITIONS, FIREBASE_CONFIG, FIREBASE_CONFIG_COMPANIES_STOCK_MARKET_DATA } from './utils/constants';
import { getPinnedCompanyIds, removePinnedCompanyId, savePinnedCompanyId } from './utils/localStorageHelper';
import StyledFloatingButton from './components/atom/StyledFloatingButton';
import LoadingAnimationCenter from './components/atom/LoadingAnimationCenter';

const StockMarketPage = lazy(() => import('./components/pages/StockMarketPage'));
const NavBar = lazy(() => import('./components/navBar/NavBar'));

const App = () => {
  const [COMPANIES_STOCK_MARKET, setCompaniesStockMarket] = useState([]);
  const [loading, isLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(COMPANIES_STOCK_MARKET?.[0]);
  const [pinnedCompanies, setPinnedCompanies] = useState([]);
  const [nextCompaniesByPinned, setNextCompaniesByPinned] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setPinnedCompanies(getPinnedCompanyIds());
  }, []);

  useEffect(() => {
    setSelectedCompany(pinnedCompanies?.length
      ? COMPANIES_STOCK_MARKET?.find((company) => pinnedCompanies?.includes(company?.id))
      : COMPANIES_STOCK_MARKET?.[0]);
  }, [COMPANIES_STOCK_MARKET]);

  useEffect(() => {
    const unPinnedCompaniesArray = COMPANIES_STOCK_MARKET?.filter((company) => !pinnedCompanies?.includes(company?.id));
    const pinnedCompaniesArray = COMPANIES_STOCK_MARKET?.filter((company) => pinnedCompanies?.includes(company?.id));
    setNextCompaniesByPinned([...pinnedCompaniesArray, ...unPinnedCompaniesArray]);
  }, [pinnedCompanies, COMPANIES_STOCK_MARKET]);

  const app = initializeApp(FIREBASE_CONFIG);
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

    if (alreadyPinnedCompanies?.includes(selectedCompany?.id)) {
      removePinnedCompanyId(selectedCompany.id);
    } else {
      savePinnedCompanyId(selectedCompany.id);
    }

    setPinnedCompanies(getPinnedCompanyIds());
  };

  const onClickNextHandler = async () => {
    const len = nextCompaniesByPinned.length;
    const currentIndex = nextCompaniesByPinned?.findIndex((x) => x.id === selectedCompany?.id);
    const next = nextCompaniesByPinned[(currentIndex + 1) % len];
    console.log(next);
    setSelectedCompany(next);
  };

  const onClickPreviousHandler = async () => {
    const len = nextCompaniesByPinned.length;
    const currentIndex = nextCompaniesByPinned?.findIndex((x) => x.id === selectedCompany?.id);
    const previous = nextCompaniesByPinned[(currentIndex + len - 1) % len];
    console.log(previous);
    setSelectedCompany(previous);
  };

  return (
    <div>
      {!loading && (
      <>
        <StyledFloatingButton
          text={pinnedCompanies?.includes(selectedCompany?.id) ? 'UNPIN' : 'PIN'}
          onClick={onClickPinCompanyHandler}
          buttonPosition={BUTTON_POSITIONS.TOP_RIGHT_CORNER}
        />
        <StyledFloatingButton
          text="PREVIOUS"
          onClick={onClickPreviousHandler}
          buttonPosition={BUTTON_POSITIONS.BOTTOM_RIGHT_CORNER_PREVIOUS}
        />
        <StyledFloatingButton
          text="NEXT"
          onClick={onClickNextHandler}
          buttonPosition={BUTTON_POSITIONS.BOTTOM_RIGHT_CORNER}
        />
      </>
      )}

      <Suspense fallback={<LoadingAnimationCenter />}>
        <NavBar
          onCompanyChangeHandler={setSelectedCompany}
          selectedCompany={selectedCompany}
          COMPANIES_STOCK_MARKET={COMPANIES_STOCK_MARKET}
          pinnedCompanies={pinnedCompanies}
          searchValue={searchValue}
          onSearchTyped={(event) => setSearchValue(event?.target?.value)}
        />
        <StockMarketPage
          fireStoreDb={fireStoreDb}
          selectedCompany={selectedCompany}
          isLoading={isLoading}
        />
      </Suspense>

    </div>
  );
};

export default App;
