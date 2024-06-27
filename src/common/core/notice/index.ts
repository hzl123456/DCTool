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
    await axios.post('https://service-ft489ve4-1301249903.gz.apigw.tencentcs.com/release/sendMessageByWebhook', {
      content,
    });
  } catch {
    // do nothing
  }
};

/**
 * 校验使用密码
 * **/
export const checkLogin = async (content: string) => {
  // try {
  //   const response = await axios.post<boolean>(
  //     'https://service-3ql3n2we-1301249903.gz.apigw.tencentcs.com/release/checkLogin',
  //     {
  //       content,
  //     }
  //   );
  //   return response.data;
  // } catch {
  //   return true;
  // }
  return content === '930522';
};
