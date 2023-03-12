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
import HourlyStockMarketPage from '../HourlyStockMarketPage';
import DayDataStockMarket from '../DayDataStockMarket';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const StockMarketPage = ({ isDailySummarySelected, selectedCompany, isLoading }) => (
  <>
    {isDailySummarySelected ? (
      <DayDataStockMarket
        selectedCompany={selectedCompany}
        isLoading={isLoading}
      />
    ) : (
      <HourlyStockMarketPage
        selectedCompany={selectedCompany}
        isLoading={isLoading}
      />
    )}
  </>
);

export default StockMarketPage;
