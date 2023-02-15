/**
 * @Author: linhe
 * @Date: 2023/2/13 18:25
 */
export interface IMixedData {
  data: IMixedItem[];
}

export interface IMixedItem {
  id: number;
  file: { originFile: File }[];
  dot: string;
  channelRow: number;
  channelIds: string;
  phoneRow: number;
}
