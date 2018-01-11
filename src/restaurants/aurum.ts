import * as moment from 'moment';
import * as cheerio from 'cheerio';
import * as cheerioTableparser from 'cheerio-tableparser';
import * as request from 'request-promise';

function getMenuForToday(parts: string[], day: number) {
  const startIndex = 2 + (day - 1) * 4;
  const soup = parts[startIndex];
  const dish = parts[startIndex + 1];
  const dessert = parts[startIndex + 2];
  return soup + ", " + dish + ", " + dessert;
}

function parseText(textParts: string[]) {
  const dayOfWeek = moment().day();
  const menu = getMenuForToday(textParts, dayOfWeek);
  return menu + " - 1290.-Ft";
}
var AURUM_URL = 'http://aurumbistro.hu/?page_id=274';
var AURUM_SELECTOR = '.etlaptabla';

export async function getAurum() {
  try {
    const response = await request(AURUM_URL);
    const $ = cheerio.load(response);
    cheerioTableparser($);
    const table = ($(AURUM_SELECTOR) as any).parsetable(true, true, true);
    const parsedText = parseText(table[1]);
    return {
      title: 'AurumBistro :wine_glass:',
      title_link: AURUM_URL,
      text: parsedText,
    };
  } catch (err) {
    return {
      title: 'AurumBistro :wine_glass:',
      title_link: AURUM_URL,
      text: '' + err,
    };
  }
}