/**
 * @Author: linhe
 * @Date: 2023/1/29 16:23
 */
import Bmob from 'hydrogen-js-sdk';

/**
 * 进行消息推送
 * @param content 具体的内容
 * **/
export const sendMessageByWebhook = async (content: string) => {
  try {
    Bmob.functions('sendMessageByWebhook', { content });
  } catch {
    // do nothing
  }
};
