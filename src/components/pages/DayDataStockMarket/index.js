import { useEffect, useState, useReducer } from 'react';
import { Line } from 'react-chartjs-2';
import { doc, getDoc } from 'firebase/firestore/lite';
import {
  HIGH_PRICE_COLOR_CODES, LOW_PRICE_COLOR_CODES, STOCK_DB_FIREBASE_FIRE_STORE, STOCKS_META_DATA_FIRESTORE,
  ACTION_TYPES_DAILY_DATA, TITLES_DAILY_DATA, DEFAULT_DATA_SET_STATE,
} from '../../../utils/constants';
import { getEpochFromDateString } from '../../../utils/dateTimeHelpers';
import LoadingAnimationCenter from '../../atom/LoadingAnimationCenter';
import { fireStoreDbFirebase } from '../../../utils/firebaseHelper';

const options = {
  responsive: true,
  scales: {
    x: {
      ticks: {
        display: true,
        autoSkip: true,
        maxTicksLimit: 15,
      },
    },
  },
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: '',
    },
  },
};

// TODO: Change data to object notation https://stackoverflow.com/a/68561933/7765316

const dispatchDailyStocksReducer = (state, action) => {
  switch (action?.type) {
    case ACTION_TYPES_DAILY_DATA.HIGH_PRICE: return [
      ...state.filter((data) => data.label !== TITLES_DAILY_DATA.HIGH_PRICE),
      {
        label: TITLES_DAILY_DATA.HIGH_PRICE,
        data: action.highPrice,
        borderColor: HIGH_PRICE_COLOR_CODES.GRAPH_BORDER_COLOR,
        backgroundColor: HIGH_PRICE_COLOR_CODES.GRAPH_BACKGROUND_COLOR,
      },
    ];
    case ACTION_TYPES_DAILY_DATA.LOW_PRICE: return [
      ...state.filter((data) => data.label !== TITLES_DAILY_DATA.LOW_PRICE),
      {
        label: TITLES_DAILY_DATA.LOW_PRICE,
        data: action.lowPrice,
        borderColor: LOW_PRICE_COLOR_CODES.GRAPH_BORDER_COLOR,
        backgroundColor: LOW_PRICE_COLOR_CODES.GRAPH_BACKGROUND_COLOR,
      },
    ];

    default:
      return DEFAULT_DATA_SET_STATE;
  }
};

const DayDataStockMarket = ({ selectedCompany, isLoading }) => {
  const [dailyStocksDataSetState, dispatchDailyStocksDataSet] = useReducer(dispatchDailyStocksReducer, DEFAULT_DATA_SET_STATE);
  const [dailyStocksDataSetLabel, setDailyStocksDataSetLabel] = useState([]);
  const [shareVolume, setShareVolume] = useState({});
  const [tradeVolume, setTradeVolume] = useState({});

  const isStockDataAvailable = dailyStocksDataSetLabel?.length && dailyStocksDataSetState.find((stockData) => stockData?.data?.length > 0);

  useEffect(() => {
    isLoading(!isStockDataAvailable);
    console.log('dailyStocksDataSetState', dailyStocksDataSetState);
    // console.log('dailyStocksDataSetState:notZero', dailyStocksDataSetState.find((stockData) => stockData?.data?.length > 0));
  }, [selectedCompany, dailyStocksDataSetLabel, dailyStocksDataSetState]);

  useEffect(() => {
    console.log('shareVolume:tradeVolume', shareVolume, tradeVolume);

    const newKeysWithMetaData = dailyStocksDataSetLabel?.map((key) => {
      const keyOfLabels = key?.[0];
      const shareVolumeLabel = shareVolume[keyOfLabels] ?? '';
      const tradeVolumeLabel = tradeVolume[keyOfLabels] ?? '';
      return [keyOfLabels, `SV: ${shareVolumeLabel}`, `TV: ${tradeVolumeLabel}`];
    });
    console.log('newKeysWithMetaData', newKeysWithMetaData);
    setDailyStocksDataSetLabel(newKeysWithMetaData);
  }, [shareVolume, tradeVolume]);

  useEffect(() => {
    const addHighPrice = (highPrice) => {
      console.log('addHighPrice', highPrice);
      dispatchDailyStocksDataSet({
        type: ACTION_TYPES_DAILY_DATA.HIGH_PRICE,
        highPrice,
      });
    };

    const addLowPrice = (lowPrice) => {
      console.log('addLowPrice', lowPrice);
      dispatchDailyStocksDataSet({
        type: ACTION_TYPES_DAILY_DATA.LOW_PRICE,
        lowPrice,
      });
    };

    console.log('initStockMetaData:Document useEffect:');
    dispatchDailyStocksDataSet();
    const initStockMetaData = async (stockMetaDataValue) => {
      const docRef = doc(fireStoreDbFirebase, `${STOCK_DB_FIREBASE_FIRE_STORE}/${selectedCompany.id}/${selectedCompany.name}`, stockMetaDataValue);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(`initStockMetaData:Document data:${stockMetaDataValue}: `, data);
        const keys = Object.keys(data).sort((a, b) => getEpochFromDateString(a) - getEpochFromDateString(b));
        const keysWithMetaData = keys.map((key) => [key, '', '']);
        setDailyStocksDataSetLabel(keysWithMetaData);
        console.log(`label: ${keys}`);
        options.plugins.title.text = [selectedCompany.name, '[ SV: Share Volume, TV: Trade Volume ]'];
        const pricesInkeyOrder = keys.map((key) => data[key]);
        switch (stockMetaDataValue) {
          case STOCKS_META_DATA_FIRESTORE.HIGH_PRICE:
            addHighPrice(pricesInkeyOrder);
            break;
          case STOCKS_META_DATA_FIRESTORE.LOW_PRICE:
            addLowPrice(pricesInkeyOrder);
            break;
          case STOCKS_META_DATA_FIRESTORE.SHARES_VOLUME:
            setShareVolume(data);
            break;
          case STOCKS_META_DATA_FIRESTORE.TRADE_VOLUME:
            setTradeVolume(data);
            break;
          default:
            break;
        }
      }
    };

    if (selectedCompany?.id) {
      Object.keys(STOCKS_META_DATA_FIRESTORE).forEach((stockMetaData) => {
        initStockMetaData(STOCKS_META_DATA_FIRESTORE[stockMetaData]);
      });
    }
  }, [selectedCompany]);

  return (
    <div style={{
      height: '90%', width: '85%', marginLeft: '200px', textAlign: 'center',
    }}
    >
      {isStockDataAvailable
        ? <Line options={options} data={{ labels: dailyStocksDataSetLabel, datasets: dailyStocksDataSetState }} />
        : <LoadingAnimationCenter />}

    </div>
  );
};

export default DayDataStockMarket;
