import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Bmob from 'hydrogen-js-sdk';

import { Button, Input, Result, toast } from '@qunhe/muya-ui';

import { checkLogin } from '@common/core/notice';

import reportWebVitals from './reportWebVitals';

import LargeFileSegmentationPage from './pages/dc-large-file-segmentation';
import FileDuplicateRemovePage from './pages/dc-file-duplicate-remove';
import MixedTreatmentPage from './pages/dc-file-mixed-treatment';
import ManyFileDuplicateRemovePage from './pages/dc-many-file-duplicate-remove';
import HomePage from './pages/home';

import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

Bmob.initialize('d22f237ea849bd69', '950109');

const localPassword = localStorage.getItem('localPassword') || '';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    checkLogin(localPassword).then(setIsLogin);
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    const isLogin = await checkLogin(value);
    if (!isLogin) {
      toast.error('使用密码输入错误');
    } else {
      localStorage.setItem('localPassword', value);
      setIsLogin(true);
    }
    setLoading(false);
  }, [value]);

  if (!isLogin) {
    return (
      <Result
        style={{ marginTop: 120 }}
        type="forbidden"
        title="暂无访问权限"
        extra={
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="请输入使用密码" width={160} />
            <Button style={{ marginLeft: 10 }} type="primary" loading={loading} onClick={handleSubmit}>
              提交
            </Button>
          </div>
        }
      />
    );
  }
  return (
    <HashRouter>
      <Routes>
        <Route path="/segmentation" element={<LargeFileSegmentationPage />} />
        <Route path="/duplicateRemove" element={<FileDuplicateRemovePage />} />
        <Route path="/mixedTreatment" element={<MixedTreatmentPage />} />
        <Route path="/manyFileDuplicateRemove" element={<ManyFileDuplicateRemovePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </HashRouter>
  );
};

root.render(<App />);

reportWebVitals();
