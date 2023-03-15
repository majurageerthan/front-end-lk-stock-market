import { DateTime } from 'luxon';

// https://moment.github.io/luxon/#/formatting?id=table-of-tokens
const DATE_TIME_FORMAT = 'dd-MM-yyyy HH:mm:ss';
const DATE_TIME_FORMAT_2 = "dd-MM-yyyy ':' hh a";
const DATE_ONLY_TIME_FORMAT = 'dd-MM-yyyy';

export const getCurrentReadableFileNameTimeStamp = () => DateTime.now().toFormat(DATE_TIME_FORMAT);

export const getReadableTimeStampFromEpoch = (epochMs) => DateTime.fromMillis(epochMs).toFormat(DATE_TIME_FORMAT_2);

export const getEpochFromDateString = (dateString) => DateTime.fromFormat(dateString, DATE_ONLY_TIME_FORMAT).toMillis();

export const getDaysInMonth = (month, year) => (new Array(31)).fill('').map((v, i) => new Date(year, month - 1, i + 1)).filter((v) => v.getMonth() === month - 1);

export const getDaysStringsInMonth = (month, year) => getDaysInMonth(month, year).map((date) => DateTime.fromJSDate(date).toFormat(DATE_ONLY_TIME_FORMAT));
