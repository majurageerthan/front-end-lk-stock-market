import { BUTTON_POSITIONS } from '../../../utils/constants';
import styles from './styles.module.css';

const getStyleByBtnPosition = (buttonPosition) => {
  switch (buttonPosition) {
    case BUTTON_POSITIONS.BOTTOM_RIGHT_CORNER:
      return styles.bottomCornerRight;
    case BUTTON_POSITIONS.BOTTOM_RIGHT_CORNER_PREVIOUS:
      return styles.bottomCornerRightPrevious;
    case BUTTON_POSITIONS.TOP_RIGHT_CORNER:
      return styles.cornerRightTop;
    default:
      return styles.cornerRightTop;
  }
};

const StyledFloatingButton = ({ text, onClick, buttonPosition }) => (
  <div className={`${styles.btnContainer} ${getStyleByBtnPosition(buttonPosition)}`}>
    <button
      onClick={onClick}
      type="button"
      className={styles['button-28']}
    >
      {text}
    </button>
  </div>

);

export default StyledFloatingButton;
