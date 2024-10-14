import dayjs from 'dayjs';

const dateFormatRegex = /\{\{\s*date\s*\[(.+?)\]\s*\}\}/g;

const DateReplacer = (text, heartbeat = {}) => {
  return text.replace(dateFormatRegex, (_, format) => {
    const date = dayjs(heartbeat.date).format(format);
    return date;
  });
};

const hasDate = (text) => dateFormatRegex.test(text);

export { hasDate, DateReplacer };
