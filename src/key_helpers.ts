import { getCapos, getKeys } from './helpers';

export { getCapos, getKeys };

export interface KeyHelpers {
  getCapos: typeof getCapos;
  getKeys: typeof getKeys;
}

export const keyHelpers: KeyHelpers = {
  getCapos,
  getKeys,
};

export default keyHelpers;
