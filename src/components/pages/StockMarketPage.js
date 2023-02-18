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
import {
  getFirestore, doc, getDoc, collection, getDocs,
} from 'firebase/firestore';
import { COMPANIES_STOCK_MARKET, STOCK_DB_FIREBASE_FIRE_STORE } from '../../utils/constants';
import { getReadableFileNameTimeStampFromEpoch } from '../../utils/dateTimeHelpers';

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

const StockMarketPage = ({ selectedCompanyId, firebaseApp }) => {
  const [lineGraphData, setLineGraphData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    console.log(`saeaeae ${selectedCompanyId}`);
    const getAllStockData = async () => {
      const db = getFirestore(firebaseApp);
      const querySnapshot = await getDocs(collection(db, STOCK_DB_FIREBASE_FIRE_STORE));
      // const stockDataSetArray = [];
      const datasets = [];
      let labels;
      querySnapshot.forEach((document) => {
        const data = document.data();
        // stockDataSetArray.push(data);
        console.log(data);
        if (!labels) {
          labels = Object.keys(data);
        }
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        datasets.push({
          label: document.id,
          data: labels.map((key) => data[key]),
          borderColor: `#${randomColor}`,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        });
      });

      // const slicedArray = stockDataSetArray.slice(0, 2);
      // console.log(slicedArray);

      // const datasets = slicedArray.map((set) => ({
      //   label: 'CSE',
      //   data: labels.map((key) => set[key]),
      //   borderColor: 'rgb(255, 99, 132)',
      //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
      // }));

      setLineGraphData({
        labels,
        datasets: datasets.slice(0, 10),
      });
    };

    const initStockData = async () => {
      const db = getFirestore(firebaseApp);
      const docRef = doc(db, STOCK_DB_FIREBASE_FIRE_STORE, `${selectedCompanyId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('Document data:', data);
        const keys = Object.keys(data).sort((a, b) => a - b);
        const labels = keys.map((dateString) => getReadableFileNameTimeStampFromEpoch(Number(dateString)));
        console.log(`label:${labels}`);

        const datasets = [
          {
            label: COMPANIES_STOCK_MARKET.find((x) => x.id === selectedCompanyId).name,
            data: keys.map((key) => data[key]),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ];

        setLineGraphData({
          labels,
          datasets,
        });
      } else {
      // doc.data() will be undefined in this case
        console.warn('No such document!');
      }
    };
    initStockData();
    // getAllStockData();
  }, [selectedCompanyId]);

  return <Line options={options} data={lineGraphData} />;
};

export default StockMarketPage;
