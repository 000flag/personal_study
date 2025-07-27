import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ApplicantList from './components/ApplicantList';
import ApplicantDetail from './components/ApplicantDetail';
import type { Model, ModelDetail, Photo } from './types/types';
import {
  fetchModels,
  fetchModelDetail,
  fetchPhotos,
  updateModelStatus,
} from './api/api';
import "./App.css";

const App: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  const [models, setModels] = useState<Model[]>([]);
  const [pageInfo, setPageInfo] = useState({
    current: 0,
    total: 1,
    pageSize: 20,
    totalElements: 0,
  });

  const [detail, setDetail] = useState<ModelDetail | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState<Record<string, string | number | boolean>>({});
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadList(0);
  }, []);

  useEffect(() => {
    if (!selectedModel) {
      setDetail(null);
      setPhotos([]);
      return;
    }
    setLoadingDetail(true);
    fetchModelDetail(selectedModel.id)
      .then(d => {
        setDetail(d);
        return fetchPhotos(d.picSubmission);
      })
      .then(imgs => setPhotos(imgs))
      .finally(() => setLoadingDetail(false));
  }, [selectedModel]);


  // 목록 로드 (페이징 + 검색 파라미터는 로컬 필터링)
  const loadList = async (
    page = 0,
    q = '',
    filtersArg: Record<string, string | number | boolean> = {},
    sortByArg = '',
    sortDirArg: 'asc' | 'desc' = 'asc'
  ) => {
    // filtersArg 복사 후 name 제거 (이전 검색어 제거)
    const filtersCopy = { ...filtersArg };
    delete filtersCopy.name;

    // 검색어가 있을 경우 name 필드 포함
    const combinedFilters = {
      ...filtersCopy,
      ...(q ? { name: q } : {}),
    };

    // console.log('loadList 호출됨:', {
    //   page,
    //   keyword: q,
    //   filters: combinedFilters,
    //   sortBy: sortByArg,
    //   sortDirection: sortDirArg,
    // });

    try {
      const res = await fetchModels(page, combinedFilters, sortByArg, sortDirArg);

      setModels(res.data.content);
      setPageInfo({
        current: res.data.pageable.pageNumber,
        total: res.data.totalPages,
        pageSize: res.data.pageable.pageSize,
        totalElements: res.data.totalElements,
      });
    } catch (err) {
      console.error('loadList 에러:', err);
    }
  };

  const handleSortChange = (field: string) => {
    let newDirection: 'asc' | 'desc' = 'asc';

    if (sortBy === field) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }

    setSortBy(field);
    setSortDirection(newDirection);
    loadList(0, keyword, filters, field, newDirection);
  };

  // 일반 검색 핸들러
  const handleSimpleSearch = (q: string) => {
    setKeyword(q);
    setFilters({}); // 기존 filters 클리어
    loadList(0, q, {}); // 빈 필터로 실행
  };

  // 상세 검색 핸들러
  const handleDetailSearch = (f: Record<string, string | number | boolean | Date | null>) => {
    const converted: Record<string, string | number | boolean> = {};
    Object.entries(f).forEach(([key, val]) => {
      if (val instanceof Date) converted[key] = val.toISOString();
      else if (val !== null) converted[key] = val;
    });
    setFilters(converted);
    loadList(0, keyword, converted);
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 4 }}>
      {selectedModel ? (
        <ApplicantDetail
          detail={detail}
          photos={photos}
          status={detail?.status || '신청'}
          loading={loadingDetail}
          onBack={() => setSelectedModel(null)}
          onStatusChange={async newStatus => {
            if (!detail) return;
            await updateModelStatus({ ...detail, status: newStatus });
            setDetail({ ...detail, status: newStatus });
          }}
        />
      ) : (
        <>
          {/* ── 타이틀 ── */}
          <Typography variant="h5" fontWeight="bold" sx={{ textAlign: 'left', mb: 1 }}>
            지원자 목록
          </Typography>

          <Divider
            sx={{
              mb: 3,
              height: '4px',
              bgcolor: 'primary.main',
            }}
          />

          <ApplicantList
            models={models}
            pageInfo={pageInfo}
            onPageChange={(page) => loadList(page, keyword, filters)}
            onSelect={m => setSelectedModel(m)}
            onStatusChange={async (m, s) => {
              const full = await fetchModelDetail(m.id);
              await updateModelStatus({ ...full, status: s });
              loadList(pageInfo.current, keyword, filters);
            }}
            onSimpleSearch={handleSimpleSearch}
            onDetailSearch={handleDetailSearch}
            keyword={keyword}
            setKeyword={setKeyword}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
          />
        </>
      )}
    </Container>
  );
};

export default App;
