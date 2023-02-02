/**
 * @Author: linhe
 * @Date: 2023/1/17 14:39
 */
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Button, Form, InputNumber, Input, toast, Upload } from '@qunhe/muya-ui';
import { UploadIcon } from '@qunhe/muya-theme-light';
import FileSaver from 'file-saver';

import { collectData } from '@common/core/point';

import { formatSizeUnits } from '@common/utils';

import { sendMessageByWebhook } from '@common/core/notice';

import './index.scss';

const FileDuplicateRemovePage = () => {
  useEffect(() => {
    document.title = '杜晨工具-文件去重';
  }, []);

  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback((values: any) => {
    const {
      file: [targetFile],
      row,
      dot,
    } = values;
    const file = targetFile.originFile as File;
    const [fileName, fileEnd] = file.name.split('.');
    setLoading(true);
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = () => {
      try {
        const data: string[] = (fileReader.result as string).split('\n');
        // 通过 map 进行数据的去重
        const dataMap = new Map();
        for (const child of data) {
          dataMap.set(child.split(dot)?.[row - 1], child);
        }
        // 重新得到新的数据
        const newData: string[] = [];
        for (const child of dataMap.values()) {
          newData.push(child);
        }
        // 本地保存文件
        FileSaver.saveAs(new Blob([newData.join('\n')]), `${fileName}-去重后.${fileEnd}`);
        toast.success('文件去重完成，请保存在本地进行查看~');
        // 埋点成功的上报
        collectData({
          key: 'FileDuplicateRemove',
          moduleName: 'Success',
          info: {
            fileName: file.name,
            fileSize: formatSizeUnits(file.size),
            row,
            dot,
          },
        });
        // 机器人通知
        sendMessageByWebhook(
          `胖虎去重文件成功\n文件名称：${file.name}\n文件大小：${formatSizeUnits(
            file.size
          )}\n第几列去重：${row}\n行分隔符：${dot}`
        );
      } catch {
        toast.error('文件分割失败，请联系胖虎处理~');
        // 埋点失败的上报
        collectData({
          key: 'FileDuplicateRemove',
          moduleName: 'Error',
          info: {
            fileName: file.name,
            fileSize: formatSizeUnits(file.size),
            row,
            dot,
          },
        });
        // 机器人通知
        sendMessageByWebhook(
          `胖虎去重文件失败\n文件名称：${file.name}\n文件大小：${formatSizeUnits(
            file.size
          )}\n第几列去重：${row}\n行分隔符：${dot}`
        );
      } finally {
        setLoading(false);
      }
    };
  }, []);

  return (
    <div className="app">
      <Form defaultValues={{ row: 1, dot: ',' }} onSubmit={handleSubmit} labelWidth={100}>
        <Form.Item name="file" label="去重文件" rule={[{ type: 'any', required: true, message: '请选择分割文件' }]}>
          <Upload multiple={false} request={(option) => ({ ...option, abort: () => {} })}>
            {({ getInputProps, getRootProps, getResultProps, uploadFiles }) => {
              return (
                <div style={{ width: 300 }}>
                  {!!uploadFiles?.length ? (
                    <div>
                      {uploadFiles.map((file) => (
                        <Upload.Result
                          key={file.uid}
                          style={{ width: '100%' }}
                          {...getResultProps({ file: { ...file, percent: 100, status: 'success' } })}
                        />
                      ))}
                    </div>
                  ) : (
                    <Upload.Card
                      {...getRootProps()}
                      width="100%"
                      height={80}
                      icon={<UploadIcon fontSize={24} />}
                      title="将文件拖拽到此处，或点击上传"
                    >
                      <input {...getInputProps()} />
                    </Upload.Card>
                  )}
                </div>
              );
            }}
          </Upload>
        </Form.Item>
        <Form.Item
          name="row"
          label="第几列去重"
          rule={[{ type: 'number', required: true, message: '请输入第几列去重' }]}
        >
          <InputNumber style={{ width: 300 }} min={1} precision={0} placeholder="请输入第几列去重" />
        </Form.Item>
        <Form.Item name="dot" label="行分隔符" rule={[{ type: 'string', required: true, message: '请输入行分隔符' }]}>
          <Input style={{ width: 300 }} placeholder="请输入行分隔符" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="reset">重置</Button>
          <Button htmlType="submit" loading={loading} type="primary">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default memo(FileDuplicateRemovePage);
