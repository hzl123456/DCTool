/**
 * @Author: linhe
 * @Date: 2023/2/17 17:57
 */
import React, { memo } from 'react';
import { ButtonGroup, Button } from '@qunhe/muya-ui';
import { NavLink } from 'react-router-dom';

const PAGE_DATA = [
  { title: '大型文件分割', path: '/segmentation' },
  { title: '文件去重', path: '/duplicateRemove' },
  { title: '文件渠道混合处理', path: '/mixedTreatment' },
  { title: '多文件去除重复项', path: '/manyFileDuplicateRemove' },
];

const HomePage = () => {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ fontSize: 16, color: 'red', fontWeight: 600, marginBottom: 20 }}>
        注意，本工具只支持处理 csv、txt 等纯文本文件
      </div>
      <ButtonGroup>
        {PAGE_DATA.map((o) => (
          <NavLink to={o.path} key={o.title}>
            <Button type="primary" style={{ marginRight: 20 }}>
              {o.title}
            </Button>
          </NavLink>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default memo(HomePage);
