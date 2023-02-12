/* eslint-disable import/no-unresolved */

import React, { useEffect } from 'react';
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
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const randomName = faker.name.fullName(); // Rowan Nikolaus
const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const D08022023 = {
  id: 1803,
  name: 'EXPOLANKA HOLDINGS PLC',
  symbol: 'EXPO.N0000',
  high: 194,
  low: 189,
  percentageChange: -2.1907216494845363,
  change: -4.25,
  price: 189.75,
  quantity: 2500,
  issueDate: '13/JUN/2011',
  sharevolume: 664455,
  tradevolume: 378,
  turnover: 126880350.25,
  lastTradedTime: 1675755229201,
  marketCap: 370945121250,
  marketCapPercentage: 9.664068,
  issuedQTY: 1954915000,
};

const D09022023 = {
  id: 1803,
  name: 'EXPOLANKA HOLDINGS PLC',
  symbol: 'EXPO.N0000',
  high: 189.0,
  low: 183.75,
  percentageChange: -1.4666666666666666,
  change: -2.75,
  price: 184.75,
  quantity: 400,
  issueDate: '13/JUN/2011',
  sharevolume: 549136,
  tradevolume: 541,
  turnover: 1.0197612625E8,
  lastTradedTime: 1675928341375,
  marketCap: 3.6117054625E11,
  marketCapPercentage: 9.438254,
  issuedQTY: 1954915000,
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

const StockMarketPage = () => {
  useEffect(() => {
    async function initStockData() {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      //   const analytics = getAnalytics(app);
      const docRef = doc(db, 'stock-market-lk', '1803');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
      } else {
      // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    }
    initStockData();
  }, []);

  return <Line options={options} data={data} />;
};

export default StockMarketPage;
