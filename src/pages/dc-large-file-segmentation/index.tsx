/**
 * @Author: linhe
 * @Date: 2023/1/17 14:39
 */
import React, { memo, useCallback, useState } from 'react';
import { Button, Form, InputNumber, toast, Upload } from '@qunhe/muya-ui';
import { UploadIcon } from '@qunhe/muya-theme-light';
import FileSaver from 'file-saver';
import JSZip from 'jszip';

import './index.scss';

const LargeFileSegmentationPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback((values: any) => {
    const {
      count,
      file: [targetFile],
    } = values;
    const file = targetFile.originFile as File;
    const [fileName, fileEnd] = file.name.split('.');
    setLoading(true);
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = () => {
      try {
        const fileTextArray = (fileReader.result as string).split('\n');
        const fileTextLength = fileTextArray.length;
        const fileDataLength = Math.floor(fileTextLength / count);
        let index = 1;
        const zip = new JSZip();
        for (let i = 0; i < fileTextLength; i += fileDataLength) {
          // 添加一个文件
          zip.file(`${fileName}-文件${index++}.${fileEnd}`, fileTextArray.slice(i, i + fileDataLength).join('\n'));
        }
        // 转成压缩包然后进行保存
        zip.generateAsync({ type: 'blob' }).then((content) => {
          FileSaver.saveAs(content, `${fileName}.zip`);
          toast.success('文件分割完成，请保存在本地进行查看~');
        });
      } catch {
        toast.error('文件分割失败，请联系胖虎处理~');
      } finally {
        setLoading(false);
      }
    };
  }, []);

  return (
    <div className="app">
      <Form defaultValues={{ count: 2 }} onSubmit={handleSubmit} labelWidth={100}>
        <Form.Item name="file" label="分割文件" rule={[{ type: 'any', required: true, message: '请选择分割文件' }]}>
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
        <Form.Item name="count" label="分割份数" rule={[{ type: 'number', required: true, message: '请输入分割份数' }]}>
          <InputNumber style={{ width: 300 }} min={2} precision={0} placeholder="请输入分割份数" />
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

export default memo(LargeFileSegmentationPage);
