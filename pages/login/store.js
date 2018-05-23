import { config } from '../../utils/config';
import { httpAgent } from '../../utils/util';

const baseUrl = config.formal.server;
const api = '/api';

const app = getApp();

export const store = {
  getMobileCode({ mobile }, cb) {
    const url = baseUrl + api + '/verify/code/sms.json';
    const param = {
      mobile: mobile,
    };
    httpAgent(url, 'GET', param, cb);
  },
  login({ mobile,code }, cb,errorcb) {
    let url = baseUrl + api + '/users/login/sms.json';
    url = url + "?mobile="+mobile+'&code='+code;
    let param = {};
    httpAgent(url, 'POST', param, cb, errorcb);
  },

  getUserMy({ token }, cb,errorcb) {
    let url = baseUrl + api + '/users/my.json';
    url = url + "?token="+token;
    let param = {};
    httpAgent(url, 'GET', param, cb, errorcb);
  },




  getUserByTicket({ticket},cb){
    let url = baseUrl + api + '/users/login/exchange/ticket.json';
    url = url + "?ticket=" + ticket;
    let param = {
    };
    httpAgent(url, 'POST', param, cb);
  },
  getOrgDetail({ orgId }, cb) {
    let url = baseUrl + api + '/org/'+orgId+'.json';
    let param = {
    };
    httpAgent(url, 'GET', param, cb);
  }




  

}