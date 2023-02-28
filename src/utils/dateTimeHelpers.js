import { DateTime } from 'luxon';

// https://moment.github.io/luxon/#/formatting?id=table-of-tokens
const DATE_TIME_FORMAT = 'dd-MM-yyyy HH:mm:ss';
const DATE_TIME_FORMAT_2 = "dd-MM-yyyy ':' hh a";
const DATE_ONLY_TIME_FORMAT = 'dd-MM-yyyy';

export const getCurrentReadableFileNameTimeStamp = () => DateTime.now().toFormat(DATE_TIME_FORMAT);

export const getReadableTimeStampFromEpoch = (epochMs) => DateTime.fromMillis(epochMs).toFormat(DATE_TIME_FORMAT_2);

export const getEpochFromDateString = (dateString) => DateTime.fromFormat(dateString, DATE_ONLY_TIME_FORMAT).toMillis();
