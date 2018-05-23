import { config } from '../../utils/config';
import { httpAgent } from '../../utils/util';

const baseUrl = config.formal.server;
const api = '/api';

const app = getApp();

export const store = {
  applyActor({ nickname, avatarUrl,mobile,openId,platId, platName, identityName,qq,wechat, attachments, summary }, cb) {
    const url = baseUrl + api + '/user/actor/apply.json';
    const param = {
      platId,
      platName,
      identityName,
      attachments,
      summary,
      qq,
      wechat,
      mobile,
      openId,
      nickname,
      avatarUrl
    };
    httpAgent(url, 'POST', param, cb);
  },

}