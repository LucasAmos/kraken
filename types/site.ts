import { Device } from './device';

export type Site = {
  id: string;
  name: string;
  devices: Device[];
};
