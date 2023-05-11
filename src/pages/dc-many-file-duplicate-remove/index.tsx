/**
 * @Author: linhe
 * @Date: 2023/5/11 09:44
 */
import type { IFileData, IFileItem } from '@src/pages/dc-many-file-duplicate-remove/types';

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, IFormBag, toast } from '@qunhe/muya-ui';

import FileSaver from 'file-saver';

import { collectData } from '@common/core/point';

import { sendMessageByWebhook } from '@common/core/notice';

import FileItem from './FileItem';

const getDefaultItem = (): IFileItem => {
  return { id: Date.now(), file: [] };
};

const ManyFileDuplicateRemove = () => {
  useEffect(() => {
    document.title = '杜晨工具-多文件去除重复项';
  }, []);

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<IFileData>({ data: [getDefaultItem()] });
  const formBagRef = useRef<IFormBag<IFileData>>(null);

  const getFileData = useCallback((item: IFileItem) => {
    const {
      file: [targetFile],
    } = item;
    return new Promise<Set<string>>((resolve, reject) => {
      const file = targetFile!.originFile as File;
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        try {
          const data: string[] = (fileReader.result as string).split('\n');
          const set = new Set<string>();
          for (const child of data) {
            set.add(child.replace('\r', ''));
          }
          resolve(set);
        } catch {
          reject('');
        }
      };
    });
  }, []);

  const handleSubmit = useCallback(
    async (values: IFileData) => {
      const { data } = values;
      setLoading(true);
      try {
        let newData: string[] = [];
        for (const item of data) {
          const set: Set<string> = await getFileData(item);
          if (newData.length === 0) {
            // 将set处理成数组
            for (const child of set.values()) {
              newData.push(child);
            }
          } else {
            // 筛选出重复项
            newData = newData.filter((o) => !set.has(o));
          }
        }
        // 将结果页进行数据
        FileSaver.saveAs(new Blob([newData.join('\n')]), '多文件去除重复项结果.txt');
        toast.success('多文件去除重复项处理成功，请保存在本地进行查看~');
        // 埋点成功的上报
        collectData({ key: 'ManyFileDuplicateRemove', moduleName: 'Success' });
        // 机器人通知
        sendMessageByWebhook('多文件去除重复项成功');
      } catch (e: any) {
        toast.error(e?.message || '多文件去除重复项处理失败，请联系胖虎');
      } finally {
        setLoading(false);
      }
    },
    [getFileData]
  );

  return (
    <div className="app">
      <Form<IFileData>
        formBagRef={formBagRef}
        values={values}
        onChange={setValues}
        onSubmit={handleSubmit}
        labelPosition="top"
      >
        <Form.Item
          name="data"
          label={
            <span style={{ fontSize: 16, color: '#333', fontWeight: 600 }}>
              文件列表
              <span style={{ color: 'red' }}>（注意将主文件放第一个）</span>
            </span>
          }
        >
          <FileItem />
        </Form.Item>
        <Form.Item labelPosition="left">
          <Button
            type="primary"
            onClick={() => {
              values.data.push(getDefaultItem());
              setValues({ data: [...values.data] });
            }}
          >
            新增文件
          </Button>
          <Button loading={loading} htmlType="submit" type="primary">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default memo(ManyFileDuplicateRemove);
