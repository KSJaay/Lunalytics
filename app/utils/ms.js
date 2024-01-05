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

export { msToTime };
