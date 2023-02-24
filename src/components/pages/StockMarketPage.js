import { useEffect, useState } from 'react';
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
import { STOCK_DB_FIREBASE_FIRE_STORE } from '../../utils/constants';
import { getReadableFileNameTimeStampFromEpoch } from '../../utils/dateTimeHelpers';
import LoadingAnimationCenter from '../atom/LoadingAnimationCenter';

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
      display: false,
      text: 'Chart.js Line Chart',
    },
  },
};

const StockMarketPage = ({
  selectedCompanyId, fireStoreDb, COMPANIES_STOCK_MARKET,
}) => {
  const [stockMarketData, setStockMarketData] = useState({});

  useEffect(() => {
    const initStockData = async () => {
      console.log(`initStockData ${selectedCompanyId}`);

      const docRef = doc(fireStoreDb, STOCK_DB_FIREBASE_FIRE_STORE, `${selectedCompanyId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('Document data:', data);
        const keys = Object.keys(data).sort((a, b) => a - b);
        const labels = keys.map((dateString) => getReadableFileNameTimeStampFromEpoch(Number(dateString)));
        console.log(`label: ${labels}`);

        const datasets = [
          {
            label: COMPANIES_STOCK_MARKET.find((x) => x.id === selectedCompanyId).name,
            data: keys.map((key) => data[key]),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ];
        setStockMarketData({
          ...stockMarketData,
          [selectedCompanyId]: {
            labels,
            datasets,
          },
        });
      } else {
      // doc.data() will be undefined in this case
        console.warn('No such document!');
      }
    };

    if (selectedCompanyId) {
      if (!stockMarketData[selectedCompanyId] || Object.keys(stockMarketData[selectedCompanyId])?.length === 0) {
        initStockData();
      }
    }
  }, [selectedCompanyId]);

  const isStockDataAvailable = selectedCompanyId && stockMarketData?.[selectedCompanyId] && Object.keys(stockMarketData?.[selectedCompanyId]).length !== 0;

  return (
    <div style={{
      height: '90%', width: '85%', marginLeft: '200px', textAlign: 'center',
    }}
    >
      {isStockDataAvailable
        ? <Line options={options} data={stockMarketData?.[selectedCompanyId]} />
        : <LoadingAnimationCenter />}

    </div>
  );
};

export default StockMarketPage;
