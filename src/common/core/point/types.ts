/**
 * @Author: linhe
 * @Date: 2022/12/30 15:37
 */
export interface IBasePoint {
  serverTimeString: string;
  userAgent: string;
  location: string;
  ip: string;
}

export interface IServerPoint {
  key: string;
  moduleName: string;
  info?: object | string;
}

export type IPoint = IBasePoint & IServerPoint;
