import { config } from '../../utils/config';
import { httpAgent } from '../../utils/util';

const baseUrl = config.formal.server;
const api = '/api';

const app = getApp();

export const store = {
  getKfInfo({ key }, cb, errorcb) {
    const url = baseUrl + api + '/plat/setting.json';
    const param = {
      key,
    };
    httpAgent(url, 'GET', param, cb, errorcb);
  },

}