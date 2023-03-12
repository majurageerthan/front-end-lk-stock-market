import styles from './styles.module.css';

const SwitchWithText = ({ onChange }) => (
  <label className={styles.switch}>
    <input type="checkbox" id="togBtn" onChange={(e) => onChange(e?.target?.checked)} defaultChecked />
    <div className={`${styles.slider} ${styles.round}`}>
      <span className={styles.on}>DAILY SUMMARY</span>
      <span className={styles.off}>HOURLY SUMMARY</span>
    </div>
  </label>
);

export default SwitchWithText;
