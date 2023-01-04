import RequestClient from './utils/requests';
import { EnhancedOutage } from '../types/outage';

const fetch = new RequestClient();

export default class Outages {
  API_KEY: string;
  BASE_URL: string;
  HEADERS: Headers;

  constructor() {
    this.API_KEY = process.env.API_KEY;
    this.BASE_URL = process.env.BASE_URL;
    this.HEADERS = new Headers({
      'Content-Type': 'application/json',
      'x-api-key': `${process.env.API_KEY}`,
    });
  }

  getOutages() {
    return fetch.get(`${this.BASE_URL}/outages`, this.HEADERS);
  }

  postSiteOutages(site: string, payload: EnhancedOutage[]) {
    return fetch.post(
      `${this.BASE_URL}/site-outages/${site}`,
      JSON.stringify(payload),
      this.HEADERS
    );
  }

  getSiteInfo(site: string) {
    return fetch.get(`${this.BASE_URL}/site-info/${site}`, this.HEADERS);
  }
}
