import * as _ from 'lodash';
import * as jsdom from 'jsdom';
import * as moment from 'moment';

const BBISTRO_URL = 'http://budapest-bistro.hu/napi-ebed-menu.html';
const BBISTRO_SELECTOR = '#page_content';

function getMenuForToday(text: string, dayIndex: number): string {
  return _.join(getDailyOffer(text, dayIndex), '\n');
}

function getDailyOffer(text: string, dayIndex: number): string[] {
  const daySeparators = ['', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'A napi'];
  return text.slice(text.indexOf(daySeparators[dayIndex]), text.indexOf(daySeparators[dayIndex+1]))
    .split('\n')
    .filter((element, index) => index !== 0 && element.length > 3);
}

function parseText(text: string) {
  const dayOfWeek = moment().day();
  const menu = getMenuForToday(text, dayOfWeek);
  const price = '1550.-Ft';

  return `${menu} \n ${price}`;
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
      title: 'Budapest Bisztró :ripepperonis:',
      title_link: BBISTRO_URL,
      text: `${ err }`,
    };
  } finally {
    if (window) {
      window.close();
    }
  }
}
