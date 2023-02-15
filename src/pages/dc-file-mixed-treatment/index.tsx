/**
 * @Author: linhe
 * @Date: 2023/1/17 14:39
 */
import type { IMixedData, IMixedItem } from '@src/pages/dc-file-mixed-treatment/types';

import React, { memo, useCallback, useEffect, useState } from 'react';
import { Button, Form, toast } from '@qunhe/muya-ui';

import dayjs from 'dayjs';

import { collectData } from '@common/core/point';

import { sendMessageByWebhook } from '@common/core/notice';

import MixedItem from '@src/pages/dc-file-mixed-treatment/MixedItem';

import './index.scss';

const XLSX = require('xlsx');

const TOTAl_EXP = '总计';

const getDefaultItem = () => {
  return { id: Date.now(), file: [], dot: ',', channelRow: 1, channelIds: '', phoneRow: 1 };
};

const MixedTreatmentPage = () => {
  useEffect(() => {
    document.title = '杜晨工具-文件渠道混合处理';
  }, []);

  const [values, setValues] = useState<IMixedData>({ data: [getDefaultItem()] });

  const getFileData = useCallback((data: IMixedItem) => {
    return new Promise<{
      file: File;
      dataMap: Map<string, Set<string>>;
    }>((resolve) => {
      const {
        file: [targetFile],
        dot,
        channelIds, // 渠道 id，| 进行分割
        channelRow, // 渠道列
        phoneRow, // 手机号列
      } = data;
      const file = targetFile!.originFile as File;
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        const data: string[] = (fileReader.result as string).split('\n');
        // 1.根据渠道创建对应的列，并且需要有一个聚合的列
        const dataMap = new Map<string, Set<string>>();
        for (const channelId of channelIds.split('|')) {
          dataMap.set(channelId.trim(), new Set());
        }
        dataMap.set(TOTAl_EXP, new Set());
        // 2.根据各自渠道进行取数然后得到最终的 dataMap 数据
        for (const text of data) {
          const childData = text.split(dot);
          const channelId = childData[channelRow - 1]!;
          const phone = childData[phoneRow - 1]!;
          if (dataMap.has(channelId)) {
            // 添加单列数据
            dataMap.get(channelId)?.add(phone);
            // 添加聚合列数据
            dataMap.get(TOTAl_EXP)?.add(phone);
          }
        }
        // 3.把数据进行返回由外部统一处理
        resolve({ file, dataMap });
      };
    });
  }, []);

  const handleSubmit = useCallback(
    async (values: IMixedData) => {
      const { data: fileValues } = values;
      try {
        const workbook = XLSX.utils.book_new(); //创建虚拟workbook
        const totalSet = new Set();
        const fileNameList: string[] = [];
        for (const childValue of fileValues) {
          const { file, dataMap } = await getFileData(childValue);
          fileNameList.push(file.name);
          const [fileName] = file.name.split('.');
          // 单独每个文件的数据
          const exportData: any[] = [];
          for (const channelId of dataMap.keys()) {
            let i = 0;
            for (const phone of dataMap.get(channelId)!.values()) {
              if (!exportData[i]) {
                exportData[i] = {};
              }
              exportData[i] = {
                ...exportData[i],
                [channelId]: phone,
              };
              // 添加所有的手机号数据
              totalSet.add(phone);
              i++;
            }
          }
          // 生成一个 excel
          const worksheet = XLSX.utils.json_to_sheet(exportData);
          XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
        }
        // 所有的数据集合
        const exportData: any[] = [];
        for (const phone of totalSet.values()) {
          exportData.push({ [TOTAl_EXP]: phone });
        }
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(workbook, worksheet, '总计');
        // 生成一个 excel 并导出
        XLSX.writeFile(workbook, `文件集合-${dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')}.xlsx`);
        toast.success('文件渠道混合处理成功，请保存在本地进行查看~');
        // 埋点成功的上报
        collectData({
          key: 'MixedTreatment',
          moduleName: 'Success',
          info: {
            fileName: fileNameList.join('、'),
          },
        });
        // 机器人通知
        sendMessageByWebhook(`文件渠道混合处理成功\n文件名称：${fileNameList.join('、')}`);
      } catch (e) {
        toast.error('文件名称不能超过31个字符，请修改文件名称后重试');
      }
    },
    [getFileData]
  );

  return (
    <div className="app">
      <Form<IMixedData> values={values} onChange={setValues} onSubmit={handleSubmit} labelPosition="top">
        <Form.Item
          name="data"
          label={
            <span style={{ fontSize: 16, color: '#333', fontWeight: 600 }}>
              文件列表
              <span style={{ color: 'red' }}>（注意文件名称不能超过31个字符）</span>
            </span>
          }
        >
          <MixedItem />
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
          <Button htmlType="submit" type="primary">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default memo(MixedTreatmentPage);
