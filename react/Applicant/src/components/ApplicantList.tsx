import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Pagination,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import type { Model } from '../types/types';
import ApplicantSearch from './ApplicantSearch';
import DetailedSearch from './DetailedSearch';

interface ApplicantListProps {
  models: Model[];
  pageInfo: {
    current: number;
    total: number;
    pageSize: number;
    totalElements: number;
  };
  onPageChange: (page: number) => void;
  onSelect: (model: Model) => void;
  onStatusChange: (m: Model, newStatus: string) => Promise<void>;
  onSimpleSearch: (q: string) => void;
  onDetailSearch: (f: Record<string, string | number | boolean | Date | null>) => void;
  keyword: string;
  setKeyword: (v: string) => void;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case '신청':
      return 'primary';
    case '검토':
      return 'warning';
    case '계약 완료':
      return 'success';
    case '거절':
      return 'error';
    default:
      return 'default';
  }
};

export default function ApplicantList({
  models,
  pageInfo,
  onPageChange,
  onSelect,
  onStatusChange,
  onSimpleSearch,
  onDetailSearch,
  keyword,
  setKeyword,
  sortBy,
  sortDirection,
  onSortChange
}: ApplicantListProps) {
  const [showDetailSearch, setShowDetailSearch] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  const handleStatusClick = (event: React.MouseEvent<HTMLElement>, m: Model) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedModel(m);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedModel(null);
  };

  const statusOptions = ['신청', '검토', '계약 완료', '거절'];

  return (
    <Box>
      {/* ── 검색 헤더 ── */}
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          지원자 검색
        </Typography>
        <Tooltip title="일반/상세 검색 전환">
          <IconButton onClick={() => setShowDetailSearch(!showDetailSearch)}>
            <TuneIcon color={showDetailSearch ? 'primary' : 'action'} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── 검색 UI ── */}
      <Box mb={2}>
        {!showDetailSearch ? (
          <ApplicantSearch
            name={keyword}
            onNameChange={(v) => setKeyword(v)}
            onSearch={onSimpleSearch}
          />
        ) : (
          <DetailedSearch
            name={keyword}
            onNameChange={(v) => setKeyword(v)}
            onSearch={onDetailSearch}
          />
        )}
      </Box>

      {/* ── 리스트 테이블 ── */}
      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead sx={{ backgroundColor: '#fafafa' }}>
            <TableRow>
              <TableCell onClick={() => onSortChange('name')} sx={{ cursor: 'pointer' }}>
                이름 {sortBy === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
              </TableCell>
              <TableCell onClick={() => onSortChange('status')} sx={{ cursor: 'pointer' }}>
                상태 {sortBy === 'status' && (sortDirection === 'asc' ? '▲' : '▼')}
              </TableCell>
              <TableCell>연락처</TableCell>
              <TableCell onClick={() => onSortChange('height')} sx={{ cursor: 'pointer' }}>
                신체정보 {sortBy === 'height' && (sortDirection === 'asc' ? '▲' : '▼')}
              </TableCell>
              <TableCell>생년월일</TableCell>
              <TableCell>수술종류</TableCell>
              <TableCell>진행상황</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {models.map((m) => (
              <TableRow
                key={m.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => onSelect(m)}
              >
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {m.name}
                </TableCell>
                <TableCell>
                  <Chip
                    label={m.status}
                    color={getStatusColor(m.status)}
                    size="small"
                    onClick={(e) => handleStatusClick(e, m)}
                    sx={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell>
                  {m.email}
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    {m.telNo}
                  </Typography>
                </TableCell>
                <TableCell>
                  {m.height}cm / {m.weight}kg
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    BMI: {m.bmi}
                  </Typography>
                </TableCell>
                <TableCell>{m.birth}</TableCell>
                <TableCell>{m.cstype}</TableCell>
                <TableCell>
                  <Chip label={m.progressStage} size="small" color="default" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── 상태 변경 메뉴 ── */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {statusOptions
          .filter((s) => selectedModel && s !== selectedModel.status)
          .map((s) => (
            <MenuItem
              key={s}
              onClick={async () => {
                if (selectedModel) {
                  await onStatusChange(selectedModel, s);
                }
                handleMenuClose();
              }}
            >
              {s}
            </MenuItem>
          ))}
      </Menu>

      {/* ── 페이지네이션 & 카운트 ── */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
        <Typography variant="body2" color="text.secondary">
          총 {pageInfo.totalElements}명 중{' '}
          {pageInfo.current * pageInfo.pageSize + 1}–{' '}
          {Math.min((pageInfo.current + 1) * pageInfo.pageSize, pageInfo.totalElements)}명 표시
        </Typography>
        <Pagination
          count={pageInfo.total}
          page={pageInfo.current + 1}
          onChange={(_, p) => onPageChange(p - 1)}
          color="primary"
        />
      </Box>
    </Box>
  );
}
