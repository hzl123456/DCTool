/**
 * @Author: linhe
 * @Date: 2023/1/18 17:50
 */
export function formatSizeUnits(bytes: number) {
  let result = '';
  if (bytes >= 1073741824) {
    result = (bytes / 1073741824).toFixed(2) + ' GB';
  } else if (bytes >= 1048576) {
    result = (bytes / 1048576).toFixed(2) + ' MB';
  } else if (bytes >= 1024) {
    result = (bytes / 1024).toFixed(2) + ' KB';
  } else if (bytes > 1) {
    result = bytes + ' bytes';
  } else if (bytes === 1) {
    result = bytes + ' byte';
  } else {
    result = '0 bytes';
  }
  return result;
}

/**
 * 获取 excel 文本的宽度
 **/
export function getCellWidth(value: string) {
  // 判断是否为null或undefined
  if (value === null || value === undefined) {
    return 10;
  } else if (/.*[\u4e00-\u9fa5]+.*$/.test(value)) {
    // 中文的长度
    const chineseLength = (value.match(/[\u4e00-\u9fa5]/g) || '').length;
    // 其他不是中文的长度
    const otherLength = value.length - chineseLength;
    return chineseLength * 2.1 + otherLength * 1.1;
  } else {
    return value.toString().length * 1.1;
  }
}
