import { config } from '../../utils/config';
import { httpAgent } from '../../utils/util';

const baseUrl = config.formal.server;
const api = '/api';

const app = getApp();

export const store = {
  bindAccount({ accountNickname, cashType, accountType, accountName, accountNum,identityCardId,bcName,bcCity,bcBranch }, cb) {
    const url = baseUrl + api + '/user/cash/account.json';
    let param = {
      accountNickname,
      accountType,
      accountName,
      accountNum,
      cashType
    };

    if(accountType == 2){//绑定银行卡
      param.identityCardId = identityCardId;
      param.bcName = bcName;
      param.bcCity = bcCity;
      param.bcBranch = bcBranch;
    }






    httpAgent(url, 'POST', param, cb);
  },

}