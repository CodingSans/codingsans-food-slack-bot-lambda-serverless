import * as request from 'request-promise';

const FRUKKOLA_URL = 'http://fruccola.hu/';
const FRUKKOLA_MENU_URL = 'http://fruccola.hu/admin/api/daily_menu';
const ARANY_ID = 1;

interface IMenu {
  id: number;
  place_id: number;
  soup_hu: string;
  soup_en: string;
  dish_hu: string;
  dish_en: string;
  due_date: string;
  push_time: string;
  pushed: number;
  email_sent: number;
  test_mail_sent: number;
  soup_allergen_ids: number[];
  dish_allergen_ids: number[];
}

interface IFrukkolaResponse {
  [key: number]: IMenu;
  pricing: {
    soup: string,
    dish: string,
    combo: string,
  };
}

export async function getFrukkola() {
  try {
    const options: request.OptionsWithUrl = {
      url: FRUKKOLA_MENU_URL,
      json: true,
    };

    const response: IFrukkolaResponse = await request(options);
    const aranyMenu = response[ARANY_ID];
    const text_hu = `${aranyMenu.soup_hu} (${response.pricing.soup}), \n` +
    `${aranyMenu.dish_hu} (${response.pricing.dish}) \n` +
    `${response.pricing.combo}.- Ft`;

    return {
      title: 'Frukkola :green_apple:',
      title_link: FRUKKOLA_URL,
      text: text_hu,
    };
  } catch (error) {
    console.log(error);
    return {
      title: 'Frukkola :ripepperonis:',
      title_link: FRUKKOLA_URL,
      text: `${error}`,
    };
  }
}
