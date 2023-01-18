/**
 * @Author: linhe
 * @Date: 2023/1/18 17:19
 */
import type { IServerPoint } from '../../core/point/types';

import dayjs from 'dayjs';

import Bmob from 'hydrogen-js-sdk';
import axios from 'axios';

async function getIP() {
  // 获取一个 ip 数据
  let ip = '';
  try {
    ip = (await axios.get('https://ipapi.co/json')).data.ip as string;
  } catch {
    // do nothing
  }
  return ip;
}

async function collectData(serverData: IServerPoint) {
  if (!serverData.key || !serverData.moduleName) {
    return;
  }
  //  进行埋点上报
  const query = Bmob.Query('log');
  query.set('serverTimeString', dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss.S'));
  query.set('userAgent', window.navigator.userAgent);
  query.set('location', window.location.href);
  query.set('ip', await getIP());
  query.set('key', serverData.key);
  query.set('moduleName', serverData.moduleName);
  query.set('info', JSON.stringify(serverData.info || {}));
  query.save();
}

export { collectData };
