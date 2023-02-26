import styles from './styles.module.css';

const StyledBottomCornerRightButton = ({ text, onClick }) => (
  <div className={styles.inner}>
    <button
      onClick={onClick}
      type="button"
      className={styles['button-28']}
    >
      {text}
    </button>
  </div>

);

export default StyledBottomCornerRightButton;
