// src/api/api.ts
import directoryData from '../data/directory.json';
import filesData from '../data/files.json';
import searchData from '../data/search.json';

type Dir = { id: string; name: string; children?: Dir[] };
export interface FileItem {
  name: string;
  path: string;
  url?: string;
  size?: number;
  type?: string;
  updatedAt?: string;
}

/**
 * 디렉토리 트리 가져오기
 */
export const fetchDirectoryTree = async (): Promise<Dir[]> => {
  try {
    const res = await fetch('/api/directory');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as Dir[];
  } catch {
    console.warn('API /api/directory failed, falling back to data/directory.json');
    return directoryData as Dir[];
  }
};

/**
 * 특정 디렉토리의 파일 목록 가져오기
 */
export const fetchFilesInDirectory = async (path: string): Promise<FileItem[]> => {
  try {
    const res = await fetch(`/api/files?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as FileItem[];
  } catch {
    console.warn(`API /api/files?path=${path} failed, falling back to data/files.json`);

    const all = filesData as FileItem[];
    // 1) 루트일 때: 최상위(segments 길이 1)
    if (path === '/' || path === '') {
      return all.filter(f => {
        const segs = f.path.split('/').filter(Boolean);
        // "/foo" → ["foo"] → length===1
        return segs.length === 1;
      });
    }
    // 2) 서브폴더일 때: 바로 아래 파일만 (depth 1)
    //    e.g. path="/B1", match "/B1/file.ext" but not "/B1/sub1/file"
    const prefix = path.endsWith('/') ? path : path + '/';
    return all.filter(f => {
      if (!f.path.startsWith(prefix)) return false;
      const rest = f.path.slice(prefix.length);
      // rest 가 "file.ext" → split("/")→ ["file.ext"] length===1
      return rest.split('/').length === 1;
    });
  }
};

/**
 * 업로드는 모의 구현 예시
 */
export const uploadFile = async (folder: string, file: File) => {
  // 실제 API가 없을 경우 여기도 try/catch 로 폴백 로직을 추가할 수 있습니다.
  const form = new FormData();
  form.append('file', file);
  return fetch(`/api/upload?folder=${encodeURIComponent(folder)}`, {
    method: 'POST',
    body: form,
  });
};

/**
 * 다운로드는 새 창으로 열기
 */
export const downloadFile = (path: string) => {
  window.open(`/api/download?path=${encodeURIComponent(path)}`, '_blank');
};

/**
 * 검색
 */
export const searchFiles = async (query: string): Promise<FileItem[]> => {
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as FileItem[];
  } catch {
    console.warn(`API /api/search?q=${query} failed, falling back to filesData filter`);
    const q = query.toLowerCase();
    // filesData 는 전체 파일 목록, 여기를 필터링
    return (filesData as FileItem[]).filter(f =>
      f.name.toLowerCase().includes(q)
    );
  }
};
