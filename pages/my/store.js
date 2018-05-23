import { config } from '../../utils/config';
import { httpAgent } from '../../utils/util';

const baseUrl = config.formal.server;
const api = '/api';

const app = getApp();

export const store = {
  getCashAccount({  }, cb) {
    const url = baseUrl + api + '/user/cash/account.json';
    const param = {
    };
    httpAgent(url, 'GET', param, cb);
  },
  deleteBindAccount({ uuid }, cb) {
    let url = baseUrl + api + '/user/cash/account/' + uuid +'.json';
    url = url + '?_method=delete';
    const param = {
    };
    httpAgent(url, 'DELETE', param, cb);
  },
  getAnalyze({  }, cb) {
    let url = baseUrl + api + '/analyze/user/weapp.json';
    const param = {
    };
    httpAgent(url, 'GET', param, cb);
  },


  

}