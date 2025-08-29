// src/components/detail/DataTable.tsx
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import type { EntityBase, PhotoStage, PhotoFile } from "../../types/common";
import { PHOTO_STAGES } from "../../types/common";
import { fetchFilesByHashes } from "../../api/api";

/* Swiper 추가 */
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/* -----------------------------------------------------------
 * Types
 * ---------------------------------------------------------*/
export type GetStageHashes<T extends Record<string, unknown>> = (
  row: T,
  stage: PhotoStage
) => string[];

export interface DataTableProps<T extends EntityBase & Record<string, unknown>> {
  rows: T[];
  page: number;
  pageSize: number;

  getName?: (row: T) => string;
  getPhone?: (row: T) => string | undefined;
  getDomainDate?: (row: T) => string | undefined;
  getStatus?: (row: T) => string | undefined;
  getCreatedAt?: (row: T) => string | undefined;

  getStageHashes?: GetStageHashes<T>;
  onSelectionChange?: (ids: Array<T["id"]>) => void;
  statusOptions?: string[];
}

/* -----------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------*/
const defaultGetStageHashes: GetStageHashes<Record<string, unknown>> = (row, stage) => {
  const raw = row[stage];
  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  return [];
};

/* -----------------------------------------------------------
 * Inline component: PhotoDialog (Swiper 사용)
 * ---------------------------------------------------------*/
function PhotoDialog({
  open,
  photos,
  onClose,
}: {
  open: boolean;
  photos: PhotoFile[];
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>사진 미리보기</DialogTitle>
      <DialogContent dividers>
        {/* Swiper 네비게이션 스타일: 숫자 깨짐 방지 & 아이콘 크기/색 지정 */}
        <Box
          component="style"
          dangerouslySetInnerHTML={{
            __html: `
              .swiper-button-next::after,
              .swiper-button-prev::after {
                font-size: 22px;
                font-weight: bold;
                color: #1976d2;
              }
              .swiper-pagination-bullet {
                background: #1976d2;
              }
            `,
          }}
        />
        <Swiper
          modules={[Navigation, Pagination, Keyboard]}
          navigation
          pagination={{ clickable: true }}
          keyboard={{ enabled: true }}
          style={{ width: "100%", height: "100%" }}
        >
          {photos.length > 0 ? (
            photos.map((p, idx) => (
              <SwiperSlide key={`${idx}-${p.filename}`}>
                <Box
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    width: "100%",
                    minHeight: { xs: 280, sm: 360 },
                  }}
                >
                  <img
                    src={p.externalPath}
                    alt={p.filename}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "60vh",
                      objectFit: "contain",
                      borderRadius: 8,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, wordBreak: "break-all", color: "text.secondary" }}
                  >
                    {p.filename}
                  </Typography>
                </Box>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  표시할 이미지가 없습니다.
                </Typography>
              </Box>
            </SwiperSlide>
          )}
        </Swiper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
}

/* -----------------------------------------------------------
 * 작은 보조 컴포넌트: 상태 선택 (툴바 예시)
 * ---------------------------------------------------------*/
function SelectStatusInline({ options }: { options: string[] }) {
  return (
    <Box display="inline-flex" alignItems="center" gap={1}>
      <Typography variant="body2" color="text.secondary">
        상태
      </Typography>
      <Box
        component="select"
        style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #e5e7eb" }}
        defaultValue=""
      >
        <option value="">선택</option>
        {options.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Box>
    </Box>
  );
}

/* -----------------------------------------------------------
 * Main component
 * ---------------------------------------------------------*/
function DataTable<T extends EntityBase & Record<string, unknown>>({
  rows,
  page,
  pageSize,
  getName,
  getPhone,
  getDomainDate,
  getStatus,
  getCreatedAt,
  getStageHashes = defaultGetStageHashes as GetStageHashes<T>,
  onSelectionChange,
  statusOptions = ["신청", "검토", "승인", "완료"],
}: DataTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Array<T["id"]>>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPhotos, setDialogPhotos] = useState<PhotoFile[]>([]);

  const headerColSpanLeft = 6;
  const rightTailColSpan = 1;

  const stageLabels: Record<PhotoStage, string> = useMemo(
    () => ({
      submission: "제출",
      picBefore: "이전",
      picAfter: "이후",
    }),
    []
  );

  const handleSelectAll = (checked: boolean) => {
    const ids = checked ? rows.map((r) => r.id) : [];
    setSelectedIds(ids);
  };

  const toggleSelect = (id: T["id"]) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  useEffect(() => {
    if (onSelectionChange) onSelectionChange(selectedIds);
  }, [selectedIds, onSelectionChange]);

  const openDialogFor = async (row: T, stage: PhotoStage) => {
    const hashes = getStageHashes(row, stage);
    const photos = hashes.length ? await fetchFilesByHashes(hashes) : [];
    setDialogPhotos(photos);
    setDialogOpen(true);
  };

  return (
    <>
      {selectedIds.length > 0 && (
        <Box display="flex" gap={2} mb={2} alignItems="center">
          <Typography>{selectedIds.length}개 선택됨</Typography>
          <SelectStatusInline options={statusOptions} />
        </Box>
      )}

      <TableContainer>
        <Table size="small" sx={{ backgroundColor: "#fff" }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.length > 0 && selectedIds.length === rows.length}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < rows.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell align="center" sx={{ whiteSpace: "nowrap", minWidth: 60, p: "8px 12px" }}>
                번호
              </TableCell>
              <TableCell align="center" sx={{ whiteSpace: "nowrap", minWidth: 120, p: "8px 12px" }}>
                이름
              </TableCell>
              <TableCell align="center" sx={{ whiteSpace: "nowrap", minWidth: 120, p: "8px 12px" }}>
                전화번호
              </TableCell>
              <TableCell align="center" sx={{ whiteSpace: "nowrap", minWidth: 120, p: "8px 12px" }}>
                일자
              </TableCell>
              <TableCell align="center" sx={{ whiteSpace: "nowrap", minWidth: 100, p: "8px 12px" }}>
                상태
              </TableCell>
              <TableCell align="center" colSpan={PHOTO_STAGES.length}>
                업로드
              </TableCell>
              <TableCell align="center" sx={{ whiteSpace: "nowrap", minWidth: 120, p: "8px 12px" }}>
                등록일
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={headerColSpanLeft} />
              {PHOTO_STAGES.map((stage) => (
                <TableCell
                  key={stage}
                  align="center"
                  sx={{ whiteSpace: "nowrap", textAlign: "center", minWidth: 70, p: "8px 12px" }}
                >
                  {stageLabels[stage]}
                </TableCell>
              ))}
              <TableCell colSpan={rightTailColSpan} />
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, index) => {
              const name = getName ? getName(row) : String(row.id);
              const phone = getPhone?.(row);
              const domainDate = getDomainDate?.(row);
              const status = getStatus?.(row);
              const createdAt = getCreatedAt?.(row);

              return (
                <TableRow key={String(row.id)} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(row.id)}
                      onChange={() => toggleSelect(row.id)}
                    />
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap", textAlign: "center" }}>{page * pageSize + index + 1}</TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    <Typography
                      component={RouterLink}
                      to={`/model/${encodeURIComponent(String(row.id))}`}
                      sx={{
                        fontWeight: 700,
                        color: "inherit",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline", cursor: "pointer" },
                      }}
                    >
                      {name}
                    </Typography>
                    {phone && (
                      <Typography variant="caption" display="block" sx={{ whiteSpace: "nowrap" }}>
                        {phone}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap", textAlign: "center" }}>{phone ?? "-"}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap", textAlign: "center" }}>{domainDate ?? "-"}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap", textAlign: "center" }}>{status ?? "-"}</TableCell>

                  {PHOTO_STAGES.map((stage) => {
                    const hashes = getStageHashes(row, stage);
                    const hasPhoto = hashes.length > 0;
                    const countLabel = hasPhoto ? String(hashes.length) : "-";

                    return (
                      <TableCell key={`${row.id}-${stage}`} align="center">
                        {hasPhoto ? (
                          <Tooltip title="미리보기">
                            <IconButton
                              size="small"
                              onClick={() => openDialogFor(row, stage)}
                              sx={{
                                px: 1,
                                py: 0.5,
                                borderRadius: "6px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.5,
                                border: "1px solid rgba(0,0,0,0.1)",
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                              <Typography variant="caption" sx={{ lineHeight: 1 }}>
                                {countLabel}
                              </Typography>
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Typography variant="caption" color="textSecondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                    );
                  })}

                  <TableCell sx={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {createdAt ? new Date(createdAt).toLocaleDateString() : "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <PhotoDialog open={dialogOpen} photos={dialogPhotos} onClose={() => setDialogOpen(false)} />
    </>
  );
}

export default DataTable;
