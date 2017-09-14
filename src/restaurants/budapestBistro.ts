import * as _ from 'lodash';
import * as jsdom from 'jsdom';
import * as moment from 'moment';

const BBISTRO_URL = 'http://budapest-bistro.hu/napi-ebed-menu.html';
const BBISTRO_SELECTOR = '#page_content';

function getMenuForToday(parts: string[], day: string) {
  let dayIndex = 0;
  _.map(parts, (part, index) => {
    if (part.includes(day)) {
      dayIndex = index;
    }
  });

  const soup = parts[dayIndex + 1];
  const dish1 = parts[dayIndex + 2];
  const dish2 = parts[dayIndex + 3];
  const dessert = parts[dayIndex + 4];

  return `${soup}, ${dish1}/${dish2}, ${dessert}`;
}

function parseText(text: string) {
  const textParts = text.split('\n');
  const days = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'];

  const dayOfWeek = moment().day();
  const today = days[dayOfWeek];

  const menu = getMenuForToday(textParts, today);

  const price = textParts[2];

  return `${menu} - ${price}`;
}

export async function getBudapestBisztro() {
  let window: any;
  try {
    window = await new Promise(
      (resolve, reject) => jsdom.env(BBISTRO_URL, ['http://code.jquery.com/jquery.js'], (err, res) => err ? reject(err) : resolve(res))
    );

    const nodes = window.$(BBISTRO_SELECTOR);

    const text = nodes.length && nodes.first().text();

    const parsedText = parseText(text);

    return {
      title: 'Budapest Bisztró :meat_on_bone:',
      title_link: BBISTRO_URL,
      text: parsedText,
    };
  } catch (err) {
    return {
      title: 'Budapest Bisztró :meat_on_bone:',
      title_link: BBISTRO_URL,
      text: `${ err }`,
    };
  } finally {
    if (window) {
      window.close();
    }
  }
}
