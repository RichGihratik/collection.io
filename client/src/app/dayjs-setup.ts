import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';

export function loadDayJS() {
  dayjs.extend(calendar);
}
