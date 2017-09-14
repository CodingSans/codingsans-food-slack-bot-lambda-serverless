import * as jsdom from 'jsdom';

const KAMRA_URL = 'http://kamraetelbar.hu/kamra_etelbar_mai_menu.html';
const KAMRA_SELECTOR = '.shop_today_title';

export async function getKamra() {
  let window: any;
  try {
    window = await new Promise(
      (resolve, reject) => jsdom.env(KAMRA_URL, ['http://code.jquery.com/jquery.js'], (err, res) => err ? reject(err) : resolve(res))
    );

    const nodes = window.$(KAMRA_SELECTOR);

    const text = nodes.length && nodes.first().text();

    return {
      title: 'Kamra :rice:',
      title_link: KAMRA_URL,
      text: text,
    };
  } catch (err) {
    console.error('getKamra error', err);
    return {
      title: 'Kamra :rice:',
      title_link: KAMRA_URL,
      text: `${ err }`,
    };
  } finally {
    if (window) {
      window.close();
    }
  }
}
