import { parseISO, format } from 'date-fns';

export default function Date({ dateString }) {
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>;
}

// Note: You can view the different format() string
// options on the date - fns website:
// https://date-fns.org/v2.16.1/docs/format