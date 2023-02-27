import { DateTime } from 'luxon';

const DATE_TIME_FORMAT = 'dd-MM-yyyy HH:mm:ss';

const DATE_ONLY_TIME_FORMAT = 'dd-MM-yyyy';

export const getCurrentReadableFileNameTimeStamp = () => DateTime.now().toFormat(DATE_TIME_FORMAT);

export const getReadableTimeStampFromEpoch = (epochMs) => DateTime.fromMillis(epochMs).toFormat(DATE_TIME_FORMAT);

export const getEpochFromDateString = (dateString) => DateTime.fromFormat(dateString, DATE_ONLY_TIME_FORMAT).toMillis();
