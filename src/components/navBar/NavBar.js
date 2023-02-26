import StockButton from '../atom/StockButton';
import styles from './styles.module.css';

const NavBar = ({
  onCompanyChangeHandler, selectedCompanyId, COMPANIES_STOCK_MARKET, pinnedCompanies,
}) => {
  console.log(`pinnedCompanies: ${pinnedCompanies}`);

  const listItems = COMPANIES_STOCK_MARKET?.filter((company) => !pinnedCompanies?.includes(company?.id))
    ?.map((data, index) => (
      <StockButton
        key={data.id + index.toString()}
        data={data}
        onClick={onCompanyChangeHandler}
        selectedCompanyId={selectedCompanyId}
        COMPANIES_STOCK_MARKET={COMPANIES_STOCK_MARKET}
      />
    ));

  const pinnedListItems = COMPANIES_STOCK_MARKET?.filter((company) => pinnedCompanies?.includes(company?.id))
    ?.map((data, index) => (
      <StockButton
        key={data.id + index.toString()}
        data={data}
        onClick={onCompanyChangeHandler}
        selectedCompanyId={selectedCompanyId}
        COMPANIES_STOCK_MARKET={COMPANIES_STOCK_MARKET}
      />
    ));

  return (
    <div className={styles.container}>
      {Boolean(pinnedListItems?.length) && (
      <>
        <div className={styles.eight}>
          <h2>Pinned</h2>
        </div>
        <ul className={styles.ulContainer}>
          {pinnedListItems}
        </ul>
      </>
      )}

      {Boolean(listItems?.length) && (
      <>
        <div className={`${styles.three} ${styles.margin8Left}`}>
          <h2>Companies</h2>
        </div>
        <ul className={styles.ulContainer}>{listItems}</ul>
      </>
      )}

    </div>
  );
};

export default NavBar;
