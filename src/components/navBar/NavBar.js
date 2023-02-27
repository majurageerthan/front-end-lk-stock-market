import StockButton from '../atom/StockButton';
import styles from './styles.module.css';

const NavBar = ({
  onCompanyChangeHandler, selectedCompany, COMPANIES_STOCK_MARKET, pinnedCompanies,
  searchValue, onSearchTyped,
}) => {
  const listItems = COMPANIES_STOCK_MARKET?.filter((company) => !pinnedCompanies?.includes(company?.id))
    ?.map((data, index) => (
      <StockButton
        key={data.id + index.toString()}
        data={data}
        onClick={onCompanyChangeHandler}
        selectedCompany={selectedCompany}
        COMPANIES_STOCK_MARKET={COMPANIES_STOCK_MARKET}
      />
    ));

  const pinnedListItems = COMPANIES_STOCK_MARKET?.filter((company) => pinnedCompanies?.includes(company?.id))
    ?.map((data, index) => (
      <StockButton
        key={data.id + index.toString()}
        data={data}
        onClick={onCompanyChangeHandler}
        selectedCompany={selectedCompany}
        COMPANIES_STOCK_MARKET={COMPANIES_STOCK_MARKET}
      />
    ));

  const search = new RegExp(searchValue, 'i');
  const searchListItems = searchValue ? COMPANIES_STOCK_MARKET?.filter((company) => company?.name?.match(search))
    ?.map((data, index) => (
      <StockButton
        key={data.id + index.toString()}
        data={data}
        onClick={onCompanyChangeHandler}
        selectedCompany={selectedCompany}
        COMPANIES_STOCK_MARKET={COMPANIES_STOCK_MARKET}
      />
    ))
    : [];

  return (
    <div className={styles.container}>
      <input type="search" value={searchValue} onChange={onSearchTyped} placeholder="Search" />

      {searchListItems?.length ? (
        <ul className={styles.ulContainer}>
          {searchListItems}
        </ul>
      ) : (
        <>
          {Boolean(!searchListItems?.length && pinnedListItems?.length) && (
            <>
              <div className={styles.eight}>
                <h2>Pinned</h2>
              </div>
              <ul className={styles.ulContainer}>
                {pinnedListItems}
              </ul>
            </>
          )}

          {Boolean(!searchListItems?.length && listItems?.length) && (
            <>
              <div className={`${styles.three} ${styles.margin8Left}`}>
                <h2>Companies</h2>
              </div>
              <ul className={styles.ulContainer}>{listItems}</ul>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default NavBar;
