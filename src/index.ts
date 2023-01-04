import { EnhancedOutage, Outage } from '../types/outage';
import { Device } from '../types/device';
import { Site } from '../types/site';
import Outages from './api';

const START_DATE = '2022-01-01T00:00:00.000Z';

/**
 * Function to filter all outages before a given date
 */
export function outageDateFilter(outage: Outage) {
  return new Date(outage.begin) >= new Date(START_DATE);
}

/**
 * Function to filter all outages that are not contained in device array
 */
export function outageDeviceFilter(outage: Outage, deviceIds: string[]) {
  return deviceIds.includes(outage.id);
}

/**
 * Filter all outages by date an deviceID
 */
export function filterOutages(outages: Outage[], deviceIds: string[]) {
  return outages
    .filter((outage: Outage) => outageDateFilter(outage))
    .filter((outage: Outage) => outageDeviceFilter(outage, deviceIds));
}

/**
 * Create a map of all Battery Ids and Names
 */
export function createBatteryIdNameMap(devices: Device[]): Map<string, string> {
  const batteries = new Map();
  for (const device of devices) {
    batteries.set(device.id, device.name);
  }
  return batteries;
}

/**
 * Return an array of all Device Ids
 */
export function getDeviceIds(devices: Device[]): string[] {
  return devices.map((device: Device) => device.id);
}

/**
 * Add battery names to outages
 */
export function createEnhancedOutages(
  outages: Outage[],
  batteries: Map<string, string>
): EnhancedOutage[] {
  return outages.map(outage => {
    const { id, begin, end } = outage;
    return { id, name: batteries.get(outage.id), begin, end };
  });
}

/**
 * Generate the request payload
 */
export function createPayload(outages: Outage[], siteInfo: Site) {
  const { devices } = siteInfo;
  const deviceIds: string[] = getDeviceIds(devices);
  const filteredOutages = filterOutages(outages, deviceIds);
  const batteries = createBatteryIdNameMap(devices);

  return createEnhancedOutages(filteredOutages, batteries);
}

/**
 * Fetch all of the data, calculate the outages and POST the request
 */
export async function main(site: string) {
  const outagesClient = new Outages();
  const siteInfo = await outagesClient.getSiteInfo(site);
  const outages = await outagesClient.getOutages();
  const payload = createPayload(outages, siteInfo);
  return await outagesClient.postSiteOutages(site, payload);
}
