import dayjs from 'dayjs';

const dateFormatRegex = /\{\{\s*date\s*\[(.+?)\]\s*\}\}/g;

export interface Heartbeat {
  date?: string;
  [key: string]: any;
}

const DateReplacer = (text: string, heartbeat: Heartbeat = {}): string => {
  return text.replace(dateFormatRegex, (_: string, format: string) => {
    const date = dayjs(heartbeat.date).format(format);
    return date;
  });
};

const hasDate = (text: string): boolean => dateFormatRegex.test(text);

export { hasDate, DateReplacer };
