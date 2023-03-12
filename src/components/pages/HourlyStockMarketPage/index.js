import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { doc, getDoc } from 'firebase/firestore/lite';
import { STOCK_DB_FIREBASE_FIRE_STORE } from '../../../utils/constants';
import { getReadableTimeStampFromEpoch } from '../../../utils/dateTimeHelpers';
import LoadingAnimationCenter from '../../atom/LoadingAnimationCenter';
import { fireStoreDbFirebase } from '../../../utils/firebaseHelper';

const options = {
  responsive: true,
  scales: {
    x: {
      ticks: {
        display: true,
        autoSkip: true,
        maxTicksLimit: 10,
      },
    },
  },
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

const HourlyStockMarketPage = ({ selectedCompany, isLoading }) => {
  const [stockMarketData, setStockMarketData] = useState({});

  useEffect(() => {
    const isStockDataAvailable = selectedCompany?.id && stockMarketData?.[selectedCompany?.id] && Object.keys(stockMarketData?.[selectedCompany?.id]).length !== 0;
    isLoading(!isStockDataAvailable);
  }, [selectedCompany, stockMarketData]);

  // useEffect(() => {
  //   console.log('initStockMetaData:Document useEffect:');

  //   const initStockMetaData = async () => {
  //     const docRef = doc(fireStoreDb, `${STOCK_DB_FIREBASE_FIRE_STORE}/${selectedCompany.id}/${selectedCompany.name}`, 'highPrice');
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       const data = docSnap.data();
  //       const epochKeys = Object.keys(data);
  //       console.log('initStockMetaData:Document data:', data);
  //       const keys = Object.keys(data).sort((a, b) => a - b);
  //       const labels = keys.map((dateString) => getReadableTimeStampFromEpoch(Number(dateString)));
  //       console.log(`label: ${labels}`);
  //     }
  //   };

  //   initStockMetaData();
  // }, []);

  useEffect(() => {
    console.log(`HourlyStockMarketPage:selectedCompany: ${selectedCompany}`);

    const initStockData = async () => {
      console.log(`initStockData ${selectedCompany?.id}`);

      const docRef = doc(fireStoreDbFirebase, STOCK_DB_FIREBASE_FIRE_STORE, `${selectedCompany.id}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('Document data:', data);
        const keys = Object.keys(data).sort((a, b) => a - b);
        const labels = keys.map((dateString) => getReadableTimeStampFromEpoch(Number(dateString)));
        console.log(`label: ${labels}`);

        const datasets = [
          {
            label: selectedCompany.name,
            data: keys.map((key) => data[key]),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ];
        setStockMarketData({
          ...stockMarketData,
          [selectedCompany.id]: {
            labels,
            datasets,
          },
        });
      } else {
      // doc.data() will be undefined in this case
        console.warn('No such document!');
      }
    };

    if (selectedCompany?.id) {
      if (!stockMarketData[selectedCompany.id] || Object.keys(stockMarketData[selectedCompany.id])?.length === 0) {
        initStockData();
      }
    }
  }, [selectedCompany]);

  const isStockDataAvailable = selectedCompany?.id && stockMarketData?.[selectedCompany?.id] && Object.keys(stockMarketData?.[selectedCompany?.id]).length !== 0;

  return (
    <div style={{
      height: '90%', width: '85%', marginLeft: '200px', textAlign: 'center',
    }}
    >
      {isStockDataAvailable
        ? <Line options={options} data={stockMarketData?.[selectedCompany?.id]} />
        : <LoadingAnimationCenter />}

    </div>
  );
};

export default HourlyStockMarketPage;
