import { useState } from 'react';
import styles from './styles.module.css';
import { COMPANIES_STOCK_MARKET } from '../../utils/constants';
//
const NavBar = ({ onCompanyChangeHandler }) => {
  const [clickedButton, setClickedButton] = useState(0);

  const onClick = (companyOrderNo) => {
    setClickedButton(companyOrderNo);
    onCompanyChangeHandler(companyOrderNo);
  };
  const listItems = COMPANIES_STOCK_MARKET.map((data, number) => (
    <li key={data.id + number.toString()} className={styles.btnContainer}>
      <button onClick={() => onClick(data?.id)} type="button" className={number === clickedButton ? styles.active : styles.bn48}>
        {COMPANIES_STOCK_MARKET.find((x) => x.id === data?.id).name}
      </button>
    </li>
  ));

  return (
    <div className={styles.container}>
      <ul>{listItems}</ul>
    </div>

  );
};

export default NavBar;
