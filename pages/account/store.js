import { config } from '../../utils/config';
import { httpAgent } from '../../utils/util';

const baseUrl = config.formal.server;
const api = '/api';

const app = getApp();

export const store = {
  getCashList({ start, limit, filter}, cb) {
    const url = baseUrl + api + '/finance/cash/apply/mine.json';
    let param = {
      start,
      limit,
    };
    if(filter){
      if(filter.startDate){
        param.startDate = filter.startDate;
      }
      if (filter.endDate) {
        param.endDate = filter.endDate;
      }
    }


    httpAgent(url, 'GET', param, cb);
  },
  getAccountList({ start, limit, filter }, cb) {
    const url = baseUrl + api + '/finance/flow/actor.json';
    let param = {
      start,
      limit,
      'type':0
    };
    if (filter) {
      if (filter.startDate) {
        param.startDate = filter.startDate;
      }
      if (filter.endDate) {
        param.endDate = filter.endDate;
      }
    }
    httpAgent(url, 'GET', param, cb);
  },
  getTimeList({ start, limit, filter }, cb) {
    const url = baseUrl + api + '/plat/flow/mine.json';
    let param = {
      start,
      limit,
      type: 0
    };
    if (filter) {
      if (filter.startDate) {
        param.startDate = filter.startDate;
      }
      if (filter.endDate) {
        param.endDate = filter.endDate;
      }
    }
    httpAgent(url, 'GET', param, cb);
  },
  
  

}