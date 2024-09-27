/**
 * @Author: linhe
 * @Date: 2023/2/13 18:25
 */
import type { Dayjs } from 'dayjs';

export interface IMixedData {
  data: IMixedItem[];
}

export interface IMixedItem {
  id: number;
  file: { originFile: File }[];
  dot: string;
  channelRow: number;
  channelIds?: string;
  phoneRow: number;
  timeRow?: number; // 时间的区间
  timeRange?: Dayjs[]; // 时间范围
  deleteRegex?: string; // 删除的正则
  includeTitle?: boolean; // 是否包含标题
}
