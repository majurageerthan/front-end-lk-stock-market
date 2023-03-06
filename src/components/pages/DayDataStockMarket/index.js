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
import { getEpochFromDateString, getReadableTimeStampFromEpoch } from '../../../utils/dateTimeHelpers';
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

const ACTION_TYPES_DAILY_DATA = {
  HIGH_PRICE: 'HIGH_PRICE',
  LOW_PRICE: 'LOW_PRICE',
  SHARES: 'SHARES',
};

const TITLES_DAILY_DATA = {
  HIGH_PRICE: 'HIGH PRICE',
  LOW_PRICE: 'LOW PRICE',
  SHARES: 'SHARES',
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
  switch (action.type) {
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
    case ACTION_TYPES_DAILY_DATA.SHARES: return [
      ...state.filter((data) => data.label !== TITLES_DAILY_DATA.SHARES),
      {
        label: TITLES_DAILY_DATA.SHARES,
        data: action.shares,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ];
    default:
      return state;
  }
};

const DayDataStockMarket = ({ selectedCompany, isLoading }) => {
  const [dailyStocksDataSetState, dispatchDailyStocksDataSet] = useReducer(dispatchDailyStocksReducer, defaultDataSetState);
  const [dailyStocksDataSetLabel, setDailyStocksDataSetLabel] = useState({});

  const addHighPrice = (highPrice) => {
    dispatchDailyStocksDataSet({
      type: ACTION_TYPES_DAILY_DATA.HIGH_PRICE,
      highPrice,
    });
  };

  const isStockDataAvailable = dailyStocksDataSetLabel?.length && dailyStocksDataSetState?.length;

  useEffect(() => {
    isLoading(!isStockDataAvailable);
  }, [selectedCompany]);

  useEffect(() => {
    console.log('initStockMetaData:Document useEffect:');

    const initStockMetaData = async () => {
      const docRef = doc(fireStoreDbFirebase, `${STOCK_DB_FIREBASE_FIRE_STORE}/${selectedCompany.id}/${selectedCompany.name}`, 'highPrice');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('initStockMetaData:Document data:', data);
        const keys = Object.keys(data).sort((a, b) => getEpochFromDateString(a) - getEpochFromDateString(b));
        setDailyStocksDataSetLabel(keys);
        console.log(`label: ${keys}`);
        options.plugins.title.text = selectedCompany.name;
        addHighPrice(keys.map((key) => data[key]));
      }
    };

    if (selectedCompany?.id) {
      initStockMetaData();
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
