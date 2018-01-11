import * as _ from 'lodash';
import * as jsdom from 'jsdom';
import * as moment from 'moment';

const NSBISTRO_URL = 'http://nemsutibisztro.com/?page_id=104.html';
const NSBISTRO_SELECTOR = '[itemprop="articleBody"]';

function getMenuForToday(text: string, dayIndex: number): string {
  return _.join(getDailyOffer(text, dayIndex), '\n');
}

function getDailyOffer(text: string, dayIndex: number): string[] {
  const daySeparators = ['', 'hétfő:', 'kedd:', 'szerda:', 'csütörtök:', 'péntek:', 'Allergének listája'];
  return text.slice(text.indexOf(daySeparators[dayIndex]), text.indexOf(daySeparators[dayIndex+1]))
    .split('\n')
    .filter((element, index) => index !== 0 && element.length > 3)
    .map((_dish: string) => {
      const dish = _dish.slice(_dish.indexOf(': ') + 2);
      let endOfDish = dish.indexOf(' – GLM');
      if (endOfDish === -1) {
        endOfDish = dish.indexOf(' – VN');
      }
      if (endOfDish === -1) {
        endOfDish = dish.indexOf(' (a:');
      }
      return dish.slice(0, endOfDish);
    });
}

function parseText(text: string): string {
  const dayOfWeek = moment().day();
  return getMenuForToday(text, dayOfWeek);
}

export async function getNemSuti() {
  let window: any;
  try {
    window = await new Promise(
      (resolve, reject) => jsdom.env(NSBISTRO_URL, ['http://code.jquery.com/jquery.js'], (err, res) => err ? reject(err) : resolve(res))
    );

    const nodes = window.$(NSBISTRO_SELECTOR);

    const text = nodes.length && nodes.first().text();

    const parsedText = parseText(text);

    return {
      title: 'Nemsüti Bisztró :meat_on_bone:',
      title_link: NSBISTRO_URL,
      text: parsedText,
    };
  } catch (err) {
    return {
      title: 'Nemsüti Bisztró :meat_on_bone:',
      title_link: NSBISTRO_URL,
      text: `${ err }`,
    };
  } finally {
    if (window) {
      window.close();
    }
  }
}
