import RequestClient from '../src/utils/requests';

import {
  createEnhancedOutages,
  createBatteryIdNameMap,
  createPayload,
  filterOutages,
  getDeviceIds,
  main,
  outageDateFilter,
  outageDeviceFilter,
} from '../src/index';

import {
  filteredByDateAndId,
  filteredOutagesByDate,
  filteredOutagesById,
  getOutagesResponse,
  payload,
  siteInfoResponse,
} from './fixtures';

jest
  .spyOn(RequestClient.prototype, 'get')
  .mockImplementationOnce(() => {
    return new Promise((resolve, reject) => {
      resolve(siteInfoResponse);
    });
  })
  .mockImplementationOnce(() => {
    return new Promise((resolve, reject) => {
      resolve(getOutagesResponse);
    });
  });

const postRequest = jest
  .spyOn(RequestClient.prototype, 'post')
  .mockImplementationOnce(() => {
    return new Promise((resolve, reject) => {
      resolve({});
    });
  });

describe('outageDateFilter', () => {
  test('should return the filtered outages', () => {
    const res = getOutagesResponse.filter(outage => outageDateFilter(outage));
    expect(res).toEqual(filteredOutagesByDate);
  });
});

describe('outageDeviceFilter', () => {
  test('should return the filtered outages', () => {
    const deviceIds = [
      '002b28fc-283c-47ec-9af2-ea287336dc1b',
      '086b0d53-b311-4441-aaf3-935646f03d4d',
    ];

    const res = getOutagesResponse.filter(outage =>
      outageDeviceFilter(outage, deviceIds)
    );
    expect(res).toEqual(filteredOutagesById);
  });
});

describe('filterOutages', () => {
  test('should return the filtered outages', () => {
    const deviceIds = [
      '002b28fc-283c-47ec-9af2-ea287336dc1b',
      '086b0d53-b311-4441-aaf3-935646f03d4d',
    ];

    const res = filterOutages(getOutagesResponse, deviceIds);
    expect(res).toEqual(filteredByDateAndId);
  });
});

describe('getDeviceIds function', () => {
  test('should return an array of deviceIds', () => {
    expect(getDeviceIds(siteInfoResponse.devices)).toEqual([
      '002b28fc-283c-47ec-9af2-ea287336dc1b',
      '086b0d53-b311-4441-aaf3-935646f03d4d',
    ]);
  });
});

describe('filterOutages', () => {
  test('should return the filtered outages', () => {
    const deviceIds: string[] = getDeviceIds(siteInfoResponse.devices);
    const filteredOutages = filterOutages(getOutagesResponse, deviceIds);
    expect(filteredOutages).toEqual(filteredByDateAndId);
  });
});

describe('createBatteryIdNameMap', () => {
  test('should return a map of battery IDs', () => {
    expect(createBatteryIdNameMap(siteInfoResponse.devices)).toEqual(
      new Map([
        ['002b28fc-283c-47ec-9af2-ea287336dc1b', 'Battery 1'],
        ['086b0d53-b311-4441-aaf3-935646f03d4d', 'Battery 2'],
      ])
    );
  });
});

describe('createEnhancedOutages', () => {
  test('should generate the correct EnhancedOutage data', () => {
    const batteries = new Map([
      ['002b28fc-283c-47ec-9af2-ea287336dc1b', 'Battery 1'],
      ['086b0d53-b311-4441-aaf3-935646f03d4d', 'Battery 2'],
    ]);

    const res = createEnhancedOutages(filteredByDateAndId, batteries);
    expect(res).toEqual(payload);
  });
});

describe('createPayload', () => {
  test('should create the correct payload', () => {
    const res = createPayload(getOutagesResponse, siteInfoResponse);
    expect(res).toEqual(payload);
  });
});

describe('main function', () => {
  test('should make POST request with correct payload', async () => {
    await main('norwich-pear-tree');
    expect(postRequest).toHaveBeenCalledWith(
      'https://dummyurl.com/v1/site-outages/norwich-pear-tree',
      '[{"id":"002b28fc-283c-47ec-9af2-ea287336dc1b","name":"Battery 1","begin":"2022-05-23T12:21:27.377Z","end":"2022-11-13T02:16:38.905Z"},{"id":"002b28fc-283c-47ec-9af2-ea287336dc1b","name":"Battery 1","begin":"2022-12-04T09:59:33.628Z","end":"2022-12-12T22:35:13.815Z"},{"id":"086b0d53-b311-4441-aaf3-935646f03d4d","name":"Battery 2","begin":"2022-07-12T16:31:47.254Z","end":"2022-10-13T04:05:10.044Z"}]',
      new Headers({
        'Content-Type': 'application/json',
        'x-api-key': `${process.env.API_KEY}`,
      })
    );
  });
});
