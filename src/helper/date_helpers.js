import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

// Covert date to UTC
export const dateUtc = (date) => {
  const finalDate = date ? dayjs(date).utc().format() : dayjs().utc().format();

  return finalDate;
};
