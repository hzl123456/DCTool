import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Bmob from 'hydrogen-js-sdk';

import { random } from 'lodash-es';

import reportWebVitals from './reportWebVitals';

import LargeFileSegmentationPage from './pages/dc-large-file-segmentation';
import FileDuplicateRemovePage from './pages/dc-file-duplicate-remove';
import MixedTreatmentPage from './pages/dc-file-mixed-treatment';
import ManyFileDuplicateRemovePage from './pages/dc-many-file-duplicate-remove';
import HomePage from './pages/home';

import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

Bmob.initialize('d22f237ea849bd69', '950109');

const TreeList = [
  { url: 'https://qhstaticssl.kujiale.com/text/html/1700734891325/tree.html', time: 6 },
  { url: 'https://qhstaticssl.kujiale.com/text/html/1700789041347/tree.html', time: 3 },
  { url: 'https://qhstaticssl.kujiale.com/text/html/1700796319938/tree.html', time: 10 },
];

const App = () => {
  // 三分之一的概率
  const [showTree, setShowTree] = useState<boolean>(random(1, 3) === 3);

  // 随机出现一棵树
  const treeData = useMemo(() => TreeList[random(0, TreeList.length - 1)], []);

  return (
    <>
      {showTree && !!treeData && (
        <iframe
          title="tree"
          style={{ position: 'fixed', zIndex: 10, top: 0, left: 0, width: '100vw', height: '100vh', border: 'none' }}
          src={treeData.url}
          onLoad={() => setTimeout(() => setShowTree(false), treeData.time * 1000)}
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
