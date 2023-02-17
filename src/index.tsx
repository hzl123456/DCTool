import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Bmob from 'hydrogen-js-sdk';

import reportWebVitals from './reportWebVitals';

import LargeFileSegmentationPage from './pages/dc-large-file-segmentation';
import FileDuplicateRemovePage from './pages/dc-file-duplicate-remove';
import MixedTreatmentPage from './pages/dc-file-mixed-treatment';
import HomePage from './pages/home';

import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

Bmob.initialize('d22f237ea849bd69', '950109');

root.render(
  <HashRouter>
    <Routes>
      <Route path="/segmentation" element={<LargeFileSegmentationPage />} />
      <Route path="/duplicateRemove" element={<FileDuplicateRemovePage />} />
      <Route path="/mixedTreatment" element={<MixedTreatmentPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  </HashRouter>
);

reportWebVitals();
