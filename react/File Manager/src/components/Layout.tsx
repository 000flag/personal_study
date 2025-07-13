import React, { useState } from 'react';
import { Row, Col, Breadcrumb } from 'react-bootstrap';
import SearchBar from './SearchBar';
import DirectoryTree from './DirectoryTree';
import FileUploader from './FileUploader';
import FileList from './FileList';
import ImageThumbnails from './ImageThumbnails';

const Layout: React.FC = () => {
  const [dir, setDir] = useState('/');
  const [search, setSearch] = useState('');

  // Breadcrumb용 경로 분리
  const parts = dir === '/' ? [''] : dir.split('/').filter(p => p);

  return (
    <Row noGutters>
      {/* 사이드바 */}
      <Col className="sidebar">
        <SearchBar onSearch={setSearch} />
        <DirectoryTree
          selected={dir}
          onSelect={setDir}
          searchQuery={search}
        />
      </Col>

      {/* 메인 영역 */}
      <Col className="main-area">
        {/* 브레드크럼 */}
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item onClick={() => setDir('/')}>Home</Breadcrumb.Item>
          {parts.map((p, i) => (
            <Breadcrumb.Item
              key={i}
              active={i === parts.length - 1}
              onClick={() => setDir('/' + parts.slice(0, i + 1).join('/'))}
            >
              {p}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>

        {/* 업로드 카드 */}
        <FileUploader selectedDir={dir} />

        {/* 파일 목록 */}
        <FileList
          selectedDir={dir}
          searchQuery={search}
        />

        {/* 이미지 썸네일 */}
        <ImageThumbnails selectedDir={dir} />
      </Col>
    </Row>
  );
};

export default Layout;
