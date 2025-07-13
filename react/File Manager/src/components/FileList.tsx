// src/components/FileList.tsx
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import {
  fetchFilesInDirectory,
  searchFiles,
  downloadFile,
  FileItem
} from '../api/api';

interface Props {
  selectedDir: string;
  searchQuery: string;
}

const FileList: React.FC<Props> = ({ selectedDir, searchQuery }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (searchQuery.trim()) {
      // 1) searchQuery 있을 땐 전역 검색 API 사용
      searchFiles(searchQuery)
        .then(data => setFiles(data))
        .finally(() => setLoading(false));
    } else {
      // 2) 검색어 없으면 현재 폴더만 로드
      fetchFilesInDirectory(selectedDir)
        .then(data => setFiles(data))
        .finally(() => setLoading(false));
    }
  }, [selectedDir, searchQuery]);

  if (loading) {
    return <p>Loading files…</p>;
  }

  return (
    <Table hover bordered size="sm">
      <thead>
        <tr>
          <th>이름</th>
          <th>크기</th>
          <th>수정된 날짜</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {files.map(f => (
          <tr key={f.path}>
            <td>{f.name}</td>
            <td>{f.size ?? '-'}</td>
            <td>{f.updatedAt ?? '-'}</td>
            <td>
              <a onClick={() => downloadFile(f.path)}>Download</a>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default FileList;
