import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import reportWebVitals from './reportWebVitals';

import LargeFileSegmentationPage from './pages/dc-large-file-segmentation';

import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <HashRouter>
    <Routes>
      <Route path="/segmentation" element={<LargeFileSegmentationPage />} />
      <Route path="*" element={<LargeFileSegmentationPage />} />
    </Routes>
  </HashRouter>
);

reportWebVitals();
