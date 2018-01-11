import * as moment from 'moment';
import * as cheerio from 'cheerio';
import * as cheerioTableparser from 'cheerio-tableparser';
import * as request from 'request-promise';
import * as _ from 'lodash';
import * as graph from 'fbgraph';

function parseMenuPost(menuPost: string): string {
  var postLines = menuPost.split('\n');
  var soup = postLines[1];
  var dish = postLines[2];
  return soup + "\n" + dish;
}

const FARGER_URL = 'https://www.facebook.com/pg/fargerkave/posts/';
var FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
graph.setAccessToken(FB_ACCESS_TOKEN);

export async function getFarger() {
  try {
    const response = await new Promise(
      (resolve, reject) => graph.get("/fargerkave/posts?since=" + moment().format('YYYY-MM-DD'), function (err: Error, res: any) {
        return err ? reject(err) : resolve(res);
      })
    );
    const menuPost = (response as any).data[0].message;
    const parsedMenu = parseMenuPost(menuPost);

    return {
      title: 'Farger :sweet_potato:',
      title_link: FARGER_URL,
      text: parsedMenu,
    };
  } catch (err) {
    return {
      title: 'Farger :sweet_potato:',
      title_link: FARGER_URL,
      text: '' + err,
    };
  }
}