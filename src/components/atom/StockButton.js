import styles from './styles.module.css';

const StockButton = ({
  data, onClick, selectedCompany, COMPANIES_STOCK_MARKET,
}) => {
  const company = COMPANIES_STOCK_MARKET.find((x) => x.id === data?.id);

  return (
    <li className={styles.btnContainer}>
      <button
        onClick={() => onClick(data)}
        type="button"
        className={data?.id === selectedCompany?.id ? styles.active : styles.bn48}
        title={`${company?.symbol} | ${company?.name}`}
      >
        {company?.name}
      </button>
    </li>
  );
};

export default StockButton;
