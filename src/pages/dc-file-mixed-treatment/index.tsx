/**
 * @Author: linhe
 * @Date: 2023/1/17 14:39
 */
import type { IMixedData, IMixedItem } from '@src/pages/dc-file-mixed-treatment/types';

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, toast, IFormBag } from '@qunhe/muya-ui';

import dayjs from 'dayjs';

import { collectData } from '@common/core/point';

import { sendMessageByWebhook } from '@common/core/notice';

import { getCellWidth } from '@common/utils';

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

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<IMixedData>({ data: [getDefaultItem()] });
  const formBagRef = useRef<IFormBag<IMixedData>>(null);

  const getFileData = useCallback((data: IMixedItem) => {
    return new Promise<{
      file: File;
      dataMap: Map<string, Set<string>>;
    }>((resolve) => {
      const {
        file: [targetFile],
        dot,
        channelIds: inputChannelIds = '', // 渠道 id，| 进行分割
        channelRow, // 渠道列
        phoneRow, // 手机号列
        timeRow = 1,
        timeRange = [],
        deleteRegex,
        includeTitle, // 是否包含标题
      } = data;
      const file = targetFile!.originFile as File;
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = () => {
        let loadData: string[] = (fileReader.result as string).split('\n');
        // 如果存在标题的话需要移除第一行数据
        if (includeTitle) {
          loadData = loadData.slice(1, loadData.length);
        }
        let data: string[] = [];
        if (!!deleteRegex) {
          // 存在删除配置，需要剔除删除行
          for (const text of loadData) {
            if (!text.includes(deleteRegex)) {
              data.push(text);
            }
          }
        } else {
          // 不存在删除配置，使用原始数据
          data = loadData;
        }
        // 0.如果 inputChannelIds 没有填写的话，先筛选出所有的渠道，注意移除第一行数据
        let channelIds = inputChannelIds;
        if (!channelIds) {
          const channelIdSet = new Set<string>();
          const channelIdList: string[] = [];
          for (const text of data) {
            const childData = text.split(dot);
            const channelId = childData[channelRow - 1]!;
            // 文件最后存在空行，得到的 channelId 为 undefined 所以要去掉，但是注意不能去掉空字符串的
            if (channelId !== undefined) {
              channelIdSet.add(channelId);
            }
          }
          for (const channelId of channelIdSet.values()) {
            channelIdList.push(channelId);
          }
          // 根据标题是否存在分割符来判断是否要移除第一行
          channelIds = channelIdList.join('|');
        }
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
          // 如果存在 timeRange 的话需要根据时间进行筛选
          if (timeRange.length === 2) {
            try {
              let time = childData[timeRow - 1]!;
              // 这里需要处理一下格式，默认为当天的第一秒
              if (!time.includes('-')) {
                time = `${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)} 00:00:01`;
              }
              const now = dayjs(time);
              const start = timeRange[0]!;
              const end = timeRange[1]!;
              if (now.isBefore(start) || now.isAfter(end)) {
                continue;
              }
            } catch {
              // do nothing
            }
          }
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
      setLoading(true);
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
          const colsCellWidth: { wch: number }[] = [];
          for (const channelId of dataMap.keys()) {
            let i = 0;
            if (!exportData[i]) {
              exportData[i] = {};
            }
            const mapValue = dataMap.get(channelId)!;
            const channelIdName = `${channelId}（${mapValue.size}）`;
            // 根据 channelIdName 和 phone 得到最后的宽度
            let cellWidth = getCellWidth(channelIdName);
            if (mapValue.size === 0) {
              exportData[i] = {
                ...exportData[i],
                [channelIdName]: null,
              };
              i++;
            } else {
              for (const phone of mapValue.values()) {
                cellWidth = Math.max(cellWidth, getCellWidth(phone));
                exportData[i] = {
                  ...exportData[i],
                  [channelIdName]: phone,
                };
                // 添加所有的手机号数据
                totalSet.add(phone);
                i++;
              }
            }
            colsCellWidth.push({ wch: cellWidth + 0.5 });
          }
          // 生成一个 excel
          const worksheet = XLSX.utils.json_to_sheet(exportData);
          worksheet['!cols'] = colsCellWidth;
          XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
        }
        // 所有的数据集合
        const exportData: any[] = [];
        for (const phone of totalSet.values()) {
          exportData.push({ [`${TOTAl_EXP}（${totalSet.size}）`]: phone });
        }
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        worksheet['!cols'] = [{ wch: getCellWidth(TOTAl_EXP) + 0.5 }];
        XLSX.utils.book_append_sheet(workbook, worksheet, TOTAl_EXP);
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
      } catch (e: any) {
        toast.error(e?.message || '文件渠道混合处理失败，请联系胖虎');
      } finally {
        setLoading(false);
      }
    },
    [getFileData]
  );

  return (
    <div className="app">
      <Form<IMixedData>
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
          <Button loading={loading} htmlType="submit" type="primary">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default memo(MixedTreatmentPage);
