/**
 * @Author: linhe
 * @Date: 2023/2/13 18:18
 */
import type { IMixedItem } from '@src/pages/dc-file-mixed-treatment/types';

import { HelpIcon } from '@qunhe/muya-theme-light';
import React, { Fragment, memo, useCallback } from 'react';
import { Button, Form, Input, InputNumber, toast, Upload, RangeDateTimePicker, Tooltip, Switch } from '@qunhe/muya-ui';
import { UploadIcon } from '@qunhe/muya-theme-light';

const MixedItem = ({
  values,
  onChange,
  onDelete,
}: {
  values?: IMixedItem;
  onChange?: (values: IMixedItem) => void;
  onDelete?: () => void;
}) => {
  return (
    <Form<IMixedItem> independent inline inlineSpacing={20} values={values} onChange={onChange}>
      <Form.Item
        labelPosition="top"
        name="file"
        label="文件"
        rule={[{ type: 'array', required: true, message: '请选择上传文件' }]}
      >
        <Upload multiple={false} request={(option) => ({ ...option, abort: () => {} })}>
          {({ getInputProps, getRootProps, getResultProps, uploadFiles }) => {
            return (
              <div style={{ width: 200 }}>
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
                    title="点击上传文件"
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
        labelPosition="top"
        name="dot"
        label="行分隔符"
        rule={[{ type: 'string', required: true, message: '请输入行分隔符' }]}
      >
        <Input style={{ width: 80 }} placeholder="请输入行分隔符" />
      </Form.Item>
      <Form.Item
        labelPosition="top"
        name="channelRow"
        label="渠道ID所属列"
        rule={[{ type: 'number', required: true, message: '请输入渠道ID所属列' }]}
      >
        <InputNumber style={{ width: 100 }} min={1} precision={0} placeholder="请输入渠道ID所属列" />
      </Form.Item>
      <Form.Item labelPosition="top" name="channelIds" label="渠道ID（不填表示所有渠道）">
        <Input style={{ width: 150 }} placeholder="用 | 进行分隔" />
      </Form.Item>
      <Form.Item
        labelPosition="top"
        name="phoneRow"
        label="手机号所属列"
        rule={[{ type: 'number', required: true, message: '请输入手机号所属列' }]}
      >
        <InputNumber style={{ width: 100 }} min={1} precision={0} placeholder="请输入手机号所属列" />
      </Form.Item>
      {/** 时间筛选是可选项 **/}
      <Form.Item labelPosition="top" name="timeRow" label="时间所属列（选填）">
        <InputNumber style={{ width: 120 }} allowClear min={1} precision={0} placeholder="时间所属列（选填）" />
      </Form.Item>
      <Form.Item
        labelPosition="top"
        name="timeRange"
        label={
          <span>
            时间区间（选填）
            <Tooltip title="只有日期的时间格式会被当做为当天的第一秒进行处理，如：20230601 会当做 2023-06-01 00:00:01 进行处理">
              <HelpIcon />
            </Tooltip>
          </span>
        }
      >
        <RangeDateTimePicker placeholder={['开始时间', '结束时间']} allowClear />
      </Form.Item>
      <Form.Item
        labelPosition="top"
        name="deleteRegex"
        label={
          <span>
            剔除行匹配（选填）
            <Tooltip
              title={
                '如果需要剔除某一行的数据，可以在这里输入该行匹配的值，如：需要剔除包含 "\\N|" 字符串的行数据，就在输入框内输入 "\\N|"'
              }
            >
              <HelpIcon />
            </Tooltip>
          </span>
        }
      >
        <Input style={{ width: 200 }} placeholder="剔除行匹配（选填）" />
      </Form.Item>
      <Form.Item labelPosition="top" name="includeTitle" label="是否存在标题">
        <Switch />
      </Form.Item>
      <Form.Item>
        <Button type="danger" onClick={onDelete}>
          删除
        </Button>
      </Form.Item>
    </Form>
  );
};

const MixedItemComp = ({
  value = [],
  onChange,
}: {
  value?: IMixedItem[];
  onChange?: (value: IMixedItem[]) => void;
}) => {
  const handleItemChange = useCallback(
    (values: IMixedItem, index: number) => {
      value.splice(index, 1, values);
      onChange?.([...value]);
    },
    [onChange, value]
  );

  const handleDeleteItem = useCallback(
    (index: number) => {
      if (value.length === 1) {
        toast.error('最后一项不能被删除');
        return;
      }
      value.splice(index, 1);
      onChange?.([...value]);
    },
    [onChange, value]
  );

  return (
    <Fragment>
      {value.map((values, index) => (
        <MixedItem
          key={values.id}
          values={values}
          onChange={(values) => handleItemChange(values, index)}
          onDelete={() => handleDeleteItem(index)}
        />
      ))}
    </Fragment>
  );
};

export default memo(MixedItemComp);
