export const STOCK_DB_FIREBASE_FIRE_STORE = 'stock-market-lk';
export const DSD = 'stock-market-lk';
export const COMPANIES_STOCK_MARKET = [
  {
    id: 551,
    name: 'CARGILLS (CEYLON) PLC',
    symbol: 'CARG.N0000',
  },
  {
    id: 396,
    name: 'COMMERCIAL BANK OF CEYLON PLC',
    symbol: 'COMB.X0000',
  },
  {
    id: 239,
    name: 'DFCC BANK PLC',
    symbol: 'DFCC.N0000',
  },
  {
    id: 471,
    name: 'DIALOG AXIATA PLC',
    symbol: 'DIAL.N0000',
  },
  {
    id: 172,
    name: 'HATTON NATIONAL BANK PLC',
    symbol: 'HNB.N0000',
  },
  {
    id: 325,
    name: 'HEMAS HOLDINGS PLC',
    symbol: 'HHL.N0000',
  },
  {
    id: 297,
    name: 'JOHN KEELLS HOLDINGS PLC',
    symbol: 'JKH.N0000',
  },
];

// const getAllStockData = async () => {
//   const db = getFirestore(firebaseApp);
//   const querySnapshot = await getDocs(collection(db, STOCK_DB_FIREBASE_FIRE_STORE));
//   // const stockDataSetArray = [];
//   const datasets = [];
//   let labels;
//   querySnapshot.forEach((document) => {
//     const data = document.data();
//     // stockDataSetArray.push(data);
//     console.log(data);
//     if (!labels) {
//       labels = Object.keys(data);
//     }
//     const randomColor = Math.floor(Math.random() * 16777215).toString(16);
//     datasets.push({
//       label: document.id,
//       data: labels.map((key) => data[key]),
//       borderColor: `#${randomColor}`,
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     });
//   });

//   // const slicedArray = stockDataSetArray.slice(0, 2);
//   // console.log(slicedArray);

//   // const datasets = slicedArray.map((set) => ({
//   //   label: 'CSE',
//   //   data: labels.map((key) => set[key]),
//   //   borderColor: 'rgb(255, 99, 132)',
//   //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
//   // }));

//   // setLineGraphData({
//   //   labels,
//   //   datasets: datasets.slice(0, 10),
//   // });
// };
