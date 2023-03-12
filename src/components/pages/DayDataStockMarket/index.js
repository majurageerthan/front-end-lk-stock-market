import { useEffect, useState, useReducer } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { doc, getDoc } from 'firebase/firestore/lite';
import { STOCK_DB_FIREBASE_FIRE_STORE } from '../../../utils/constants';
import { getEpochFromDateString } from '../../../utils/dateTimeHelpers';
import LoadingAnimationCenter from '../../atom/LoadingAnimationCenter';
import { fireStoreDbFirebase } from '../../../utils/firebaseHelper';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const options = {
  responsive: true,
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

const STOCKS_META_DATA_FIRESTORE = {
  HIGH_PRICE: 'highPrice',
  LOW_PRICE: 'lowPrice',
  SHARES_VOLUME: 'shareVolume',
  TRADE_VOLUME: 'tradeVolume',
};

const ACTION_TYPES_DAILY_DATA = {
  HIGH_PRICE: 'HIGH_PRICE',
  LOW_PRICE: 'LOW_PRICE',
  SHARES_VOLUME: 'SHARES_VOLUME',
  TRADE_VOLUME: 'TRADE_VOLUME',
  DATE_ONLY: 'DATE_ONLY',
};

const TITLES_DAILY_DATA = {
  HIGH_PRICE: 'HIGH PRICE',
  LOW_PRICE: 'LOW PRICE',
  SHARES_VOLUME: 'SHARES VOLUME',
  TRADE_VOLUME: 'TRADE VOLUME',
};

const defaultDataSetState = [
  {
    label: TITLES_DAILY_DATA.HIGH_PRICE,
    data: [],
    borderColor: 'rgb(255, 99, 132)',
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
  },
  {
    label: TITLES_DAILY_DATA.LOW_PRICE,
    data: [],
    borderColor: 'rgb(53, 162, 235)',
    backgroundColor: 'rgba(53, 162, 235, 0.5)',
  },
];

const dispatchDailyStocksReducer = (state, action) => {
  switch (action?.type) {
    case ACTION_TYPES_DAILY_DATA.HIGH_PRICE: return [
      ...state.filter((data) => data.label !== TITLES_DAILY_DATA.HIGH_PRICE),
      {
        label: TITLES_DAILY_DATA.HIGH_PRICE,
        data: action.highPrice,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ];
    case ACTION_TYPES_DAILY_DATA.LOW_PRICE: return [
      ...state.filter((data) => data.label !== TITLES_DAILY_DATA.LOW_PRICE),
      {
        label: TITLES_DAILY_DATA.LOW_PRICE,
        data: action.lowPrice,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ];

    default:
      return defaultDataSetState;
  }
};

const dispatchLabelsDailyStocksReducer = (state, action) => {
  switch (action?.type) {
    case ACTION_TYPES_DAILY_DATA.SHARES_VOLUME: return [
      ...state.filter((data) => data.label !== TITLES_DAILY_DATA.SHARES_VOLUME),
      {
        label: TITLES_DAILY_DATA.SHARES_VOLUME,
        data: action.shareVolume,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ];

    case ACTION_TYPES_DAILY_DATA.DATE_ONLY:
      return [...action.data];
    default:
      return defaultDataSetState;
  }
};

const DayDataStockMarket = ({ selectedCompany, isLoading }) => {
  const [dailyStocksDataSetState, dispatchDailyStocksDataSet] = useReducer(dispatchDailyStocksReducer, defaultDataSetState);
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
        const keysWithMetaData = keys.map((key) => [key, 'SV:', 'TV:']);
        setDailyStocksDataSetLabel(keysWithMetaData);
        console.log(`label: ${keys}`);
        options.plugins.title.text = selectedCompany.name;
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
