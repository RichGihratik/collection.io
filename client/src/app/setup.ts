import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';

export function setup() {
  dayjs.extend(calendar);
}
