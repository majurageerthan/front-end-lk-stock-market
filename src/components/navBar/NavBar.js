import styles from './styles.module.css';

const NavBar = ({ onCompanyChangeHandler, selectedCompanyId, COMPANIES_STOCK_MARKET }) => {
  const onClick = (companyOrderNo) => {
    onCompanyChangeHandler(companyOrderNo);
  };
  const listItems = COMPANIES_STOCK_MARKET.map((data, number) => (
    <li key={data.id + number.toString()} className={styles.btnContainer}>
      <button onClick={() => onClick(data?.id)} type="button" className={data?.id === selectedCompanyId ? styles.active : styles.bn48}>
        {COMPANIES_STOCK_MARKET.find((x) => x.id === data?.id).name}
      </button>
    </li>
  ));

  return (
    <div className={styles.container}>
      <ul className={styles.ulContainer}>{listItems}</ul>
    </div>

  );
};

export default NavBar;
