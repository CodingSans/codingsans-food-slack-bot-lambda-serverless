import * as moment from 'moment';
import * as cheerio from 'cheerio';
import * as cheerioTableparser from 'cheerio-tableparser';
import * as request from 'request-promise';
import * as _ from 'lodash';

function getMenuForToday(parts: string[]) {
  var startIndex = 0;
  _.map(parts, function (part, index) {
      if (part.includes('Levesek')) {
          startIndex = index;
      }
  });
  var soup1 = parts[startIndex + 2].split('/')[0].trim();
  var soup2 = parts[startIndex + 3].split('/')[0].trim();
  var dish1 = parts[startIndex + 6].split('/')[0].trim();
  var dish2 = parts[startIndex + 7].split('/')[0].trim();
  var dish3 = parts[startIndex + 8].split('/')[0].trim();
  return soup1 + "/" + soup2 + " \u00E9s " + "\n" + dish1 + " vagy\n" + dish2 + " vagy\n" + dish3;
}

function parseText(textParts: string[]) {
  var menu = getMenuForToday(textParts);
  return "HETI MEN\u00DC!: 990.-Ft\n" + menu;
}
const GOOSE_URL = 'http://www.goose.hu/';
const GOOSE_SELECTOR = 'table';

export async function getGreyGoose() {
  try {
    const response = await request(GOOSE_URL);
    const $ = cheerio.load(response);
    cheerioTableparser($);
    const table = ($(GOOSE_SELECTOR) as any).parsetable(true, true, true);
    const parsedText = parseText(table[0]);
    return {
      title: 'Grey Goose :tomato:',
      title_link: GOOSE_URL,
      text: parsedText,
    };
  } catch (err) {
    return {
      title: 'Grey Goose :ripepperonis:',
      title_link: GOOSE_URL,
      text: '' + err,
    };
  }
}