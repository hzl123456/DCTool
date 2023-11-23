import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Bmob from 'hydrogen-js-sdk';

import reportWebVitals from './reportWebVitals';

import LargeFileSegmentationPage from './pages/dc-large-file-segmentation';
import FileDuplicateRemovePage from './pages/dc-file-duplicate-remove';
import MixedTreatmentPage from './pages/dc-file-mixed-treatment';
import ManyFileDuplicateRemovePage from './pages/dc-many-file-duplicate-remove';
import HomePage from './pages/home';

import './index.scss';

// @ts-ignore

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

Bmob.initialize('d22f237ea849bd69', '950109');

const ENTER_KEY = 'enterAnimation:' + new Date().getDate();

const App = () => {
  const [hasShow, setHasShow] = useState<boolean>(localStorage.getItem(ENTER_KEY) === 'true');

  return (
    <>
      {!hasShow && (
        <iframe
          title="tree"
          style={{ position: 'fixed', zIndex: 10, top: 0, left: 0, width: '100vw', height: '100vh', border: 'none' }}
          src="https://qhstaticssl.kujiale.com/text/html/1700734891325/tree.html"
          onLoad={() => {
            setTimeout(() => {
              setHasShow(true);
              localStorage.setItem(ENTER_KEY, 'true');
            }, 5000);
          }}
        />
      )}
      <HashRouter>
        <Routes>
          <Route path="/segmentation" element={<LargeFileSegmentationPage />} />
          <Route path="/duplicateRemove" element={<FileDuplicateRemovePage />} />
          <Route path="/mixedTreatment" element={<MixedTreatmentPage />} />
          <Route path="/manyFileDuplicateRemove" element={<ManyFileDuplicateRemovePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </HashRouter>
    </>
  );
};

root.render(<App />);

reportWebVitals();
