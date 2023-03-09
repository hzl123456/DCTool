/**
 * @Author: linhe
 * @Date: 2023/1/29 16:23
 */
import axios from 'axios';

/**
 * 进行消息推送
 * @param content 具体的内容
 * **/
export const sendMessageByWebhook = async (content: string) => {
  try {
    await axios.post('https://sendmesywebhook-dctool-ckfszumqnq.cn-hangzhou.fcapp.run', {
      content,
    });
  } catch {
    // do nothing
  }
};
