const h = 1000 * 60 * 60;
const d = h * 24;
const w = d * 7;
const m = d * 30;
const y = d * 365.25;

const timeToMs = (duration, type = 'hours') => {
  const types = {
    months: 2592000000,
    days: 86400000,
    hours: 3600000,
    minutes: 60000,
    seconds: 1000,
  };

  return duration * types[type];
};

const msToTime = (duration) => {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  let days = Math.floor((duration / (1000 * 60 * 60 * 24)) % 30);
  let months = Math.floor((duration / (1000 * 60 * 60 * 24 * 30)) % 12);
  let years = Math.floor(duration / (1000 * 60 * 60 * 24 * 30 * 12));

  // Only return the highest non-zero unit

  if (years > 0) {
    return years === 1 ? `${years} year` : `${years} years`;
  }

  if (months > 0) {
    return months === 1 ? `${months} month` : `${months} months`;
  }

  if (days > 0) {
    return days === 1 ? `${days} day` : `${days} days`;
  }

  if (hours > 0) {
    return hours === 1 ? `${hours} hour` : `${hours} hours`;
  }

  if (minutes > 0) {
    return minutes === 1 ? `${minutes} minute` : `${minutes} minutes`;
  }

  if (seconds > 0) {
    return seconds === 1 ? `${seconds} second` : `${seconds} seconds`;
  }

  return 'Unknown';
};

const stringToMs = (value) => {
  const [_, stringNumber, matchedType] = value.match(/^(\d+)([a-zA-Z])$/) || [];

  if (!stringNumber || !matchedType) return 0;

  const n = parseInt(stringNumber);
  const type = matchedType?.toLowerCase();

  if (isNaN(n)) return 0;

  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'months':
    case 'month':
    case 'mo':
    case 'm':
      return n * m;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    default:
      return 0;
  }
};

export { msToTime, timeToMs, stringToMs };
