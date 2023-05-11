/**
 * @Author: linhe
 * @Date: 2023/2/13 18:18
 */

import type { IFileItem } from '@src/pages/dc-many-file-duplicate-remove/types';

import React, { Fragment, memo, useCallback } from 'react';
import { Button, Form, toast, Upload } from '@qunhe/muya-ui';
import { UploadIcon } from '@qunhe/muya-theme-light';

const FileItem = ({
  values,
  onChange,
  onDelete,
}: {
  values?: IFileItem;
  onChange?: (values: IFileItem) => void;
  onDelete?: () => void;
}) => {
  return (
    <Form<IFileItem> independent inline inlineSpacing={20} values={values} onChange={onChange}>
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
      <Form.Item>
        <Button type="danger" onClick={onDelete}>
          删除
        </Button>
      </Form.Item>
    </Form>
  );
};

const FileItemComp = ({ value = [], onChange }: { value?: IFileItem[]; onChange?: (value: IFileItem[]) => void }) => {
  const handleItemChange = useCallback(
    (values: IFileItem, index: number) => {
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
        <FileItem
          key={values.id}
          values={values}
          onChange={(values) => handleItemChange(values, index)}
          onDelete={() => handleDeleteItem(index)}
        />
      ))}
    </Fragment>
  );
};

export default memo(FileItemComp);
