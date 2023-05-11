/**
 * @Author: linhe
 * @Date: 2023/2/13 18:25
 */
export interface IFileData {
  data: IFileItem[];
}

export interface IFileItem {
  id: number;
  file: { originFile?: File }[];
}
