import RequestClient from '../src/utils/requests';
import OutagesClient from '../src/api';

import { getOutagesResponse, siteInfoResponse, payload } from './fixtures';

jest
  .spyOn(RequestClient.prototype, 'get')
  .mockImplementationOnce(p => {
    return new Promise((resolve, reject) => {
      resolve(getOutagesResponse);
    });
  })
  .mockImplementationOnce(p => {
    return new Promise((resolve, reject) => {
      resolve(siteInfoResponse);
    });
  });

jest.spyOn(RequestClient.prototype, 'post').mockImplementationOnce(p => {
  return new Promise((resolve, reject) => {
    resolve({});
  });
});

describe('getOutages', () => {
  const outages = new OutagesClient();
  test('should return list of outages', async () => {
    const res = await outages.getOutages();
    expect(res).toEqual(getOutagesResponse);
  });
});

describe('getSiteInfo', () => {
  const outages = new OutagesClient();
  test('should return site info', async () => {
    const res = await outages.getSiteInfo('test-site');
    expect(res).toEqual(siteInfoResponse);
  });
});

describe('postSiteOutages', () => {
  const outages = new OutagesClient();
  test('should return empty response', async () => {
    const res = await outages.postSiteOutages('test-site', payload);
    expect(res).toEqual({});
  });
});
