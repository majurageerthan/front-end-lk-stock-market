import { DateTime } from 'luxon';

const DATE_TIME_FORMAT = 'dd-MM-yyyy HH:mm:ss';

export const getCurrentReadableFileNameTimeStamp = () => DateTime.now().toFormat(DATE_TIME_FORMAT);

export const getReadableFileNameTimeStampFromEpoch = (epochMs) => DateTime.fromMillis(epochMs).toFormat(DATE_TIME_FORMAT);
