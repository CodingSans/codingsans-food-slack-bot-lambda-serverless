import * as _ from 'lodash';
import * as jsdom from 'jsdom';
import * as moment from 'moment';

function getMenuForToday(parts: string[], day: string) {
  let dayIndex = 0;
  _.map(parts, (part, index) => {
    if (part.includes(day)) {
      dayIndex = index;
    }
  });

  dayIndex += 1;

  const soup = parts[dayIndex + 1];
  const dish1 = parts[dayIndex + 2];
  const dish2 = parts[dayIndex + 3];
  const dessert = parts[dayIndex + 4];

  return `${soup}, ${dish1}${dish2}, ${dessert}`;
}

function parseText(text: string) {
  const textParts = text.split('\n');
  const days = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'];

  const dayOfWeek = moment().day();
  const today = days[dayOfWeek];

  const menu = getMenuForToday(textParts, today);

  return `${menu} - 1440.-Ft`;
}

const MAYER_URL = 'http://www.cafemayer.hu/';
const MAYER_SELECTOR = '#weeklyMenu';

export async function getCafeMayer() {
  let window: any;
  try {
    window = await new Promise(
      (resolve, reject) => jsdom.env(MAYER_URL, ['http://code.jquery.com/jquery.js'], (err, res) => err ? reject(err) : resolve(res))
    );

    const nodes = window.$(MAYER_SELECTOR);

    const text = nodes.length && nodes.first().text();

    const parsedText = parseText(text);

    return {
      title: 'CafeMayer :coffee:',
      title_link: MAYER_URL,
      text: parsedText.replace(/\s\s+/g, ' '),
    };
  } catch (err) {
    return {
      title: 'CafeMayer :coffee:',
      title_link: MAYER_URL,
      text: `${ err }`,
    };
  } finally {
    if (window) {
      window.close();
    }
  }
}
