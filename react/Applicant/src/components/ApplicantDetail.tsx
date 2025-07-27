import { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import StraightenIcon from '@mui/icons-material/Straighten';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import PhotoTabs from './PhotoTabs';
import ConfirmDialog from './ConfirmDialog';
import type { ModelDetail, Photo } from '../types/types';

interface ApplicantDetailProps {
  detail: ModelDetail | null;
  photos: Photo[];
  status: string;
  onStatusChange: (newStatus: string) => void;
  onBack: () => void;
  loading: boolean;
}

export default function ApplicantDetail({
  detail,
  photos,
  status,
  onStatusChange,
  onBack,
  loading,
}: ApplicantDetailProps) {
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [nextStatus, setNextStatus] = useState<string>('');

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
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

  const handleChange = (value: string) => {
    setNextStatus(value);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    onStatusChange(nextStatus);
    setConfirmOpen(false);
  };

  if (loading) {
    return (
      <Box textAlign="center" py={5}>
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  if (!detail) {
    return (
      <Card>
        <CardContent>
          <Typography>상세 정보를 불러올 수 없습니다.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* ─── 상단 바 ─── */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
        flexWrap="wrap"
      >
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onBack}>
          목록으로 돌아가기
        </Button>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        flexWrap="wrap"
      >
        <Typography variant="h5" fontWeight="bold">
          지원자: {detail.name}
        </Typography>

        <Box display="flex" alignItems="center" gap={2} mt={{ xs: 1, md: 0 }}>
          <Chip label={status} color={getStatusColor(status)} />

          <FormControl size="small" variant="outlined">
            <InputLabel id="status-label">상태</InputLabel>
            <Select
              labelId="status-label"
              label="상태"
              value={status}
              onChange={(e) => handleChange(e.target.value)}
            >
              <MenuItem value="신청">신청</MenuItem>
              <MenuItem value="검토">검토</MenuItem>
              <MenuItem value="계약 완료">계약 완료</MenuItem>
              <MenuItem value="거절">거절</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* ─── 개인정보 & 신체정보 ─── */}
      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              border: '1px solid #ddd',
            }}
          >
            <CardHeader
              avatar={<PersonIcon />}
              title="개인정보"
              sx={{ borderBottom: '2px solid #f5f5f5' }}
              slotProps={{
                title: {
                  component: 'div',
                  sx: {
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }
                }
              }}
            />
            <CardContent>
              <Grid container spacing={2}>
                {[
                  ['이름', detail.name],
                  ['CustNo', detail.custNo],
                  ['이메일', detail.email],
                  ['전화번호', detail.telNo],
                  ['생년월일', detail.birth],
                  ['나이', `${detail.age}세`],
                ].map(([label, val]) => (
                  // each row takes half the card width
                  <Grid size={{ xs: 12, sm: 6 }} key={label}>
                    <Typography variant="caption" color="textSecondary">
                      {label}
                    </Typography>
                    <Typography variant="body1">{val}</Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 신체정보: 50% width on all breakpoints */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              border: '1px solid #ddd',
            }}
          >
            <CardHeader
              avatar={<StraightenIcon />}
              title="신체정보"
              sx={{ borderBottom: '2px solid #f5f5f5' }}
              slotProps={{
                title: {
                  component: 'div',
                  sx: {
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }
                }
              }}
            />
            <CardContent>
              <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                gap={2}
              >
                {[
                  ['키', `${detail.height}cm`],
                  ['몸무게', `${detail.weight}kg`],
                  ['BMI', detail.bmi],
                  ['진행 단계', detail.progressStage],
                ].map(([label, val]) => (
                  <Box key={label} flexBasis={{ xs: '100%', sm: '48%' }}>
                    <Typography variant="caption" color="textSecondary">
                      {label}
                    </Typography>
                    <Box mt={0.5}>
                      {label === '진행 단계' ? (
                        <Chip label={val as string} size="small" />
                      ) : (
                        <Typography variant="body1" component="div">
                          {val}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ─── 수술정보 ─── */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 2,
          border: '1px solid #ddd',
        }}
      >
        <CardHeader
          avatar={<MedicalInformationIcon />}
          title="수술정보"
          sx={{ borderBottom: '2px solid #f5f5f5' }}
          slotProps={{
            title: {
              component: 'div',
              sx: {
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }
            }
          }}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              {[
                ['수술종류', detail.cstype],
                ['수술일', detail.operDate],
                ['경험', detail.experience || '없음'],
              ].map(([label, val]) => (
                <Box key={label} mb={1}>
                  <Typography variant="caption" color="textSecondary">
                    {label}
                  </Typography>
                  <Typography variant="body1">{val}</Typography>
                </Box>
              ))}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {[
                ['사진 수', detail.photoCount],
                ['메모', detail.note || '없음'],
                ['할인메모', detail.noteDiscount || '없음'],
              ].map(([label, val]) => (
                <Box key={label} mb={1}>
                  <Typography variant="caption" color="textSecondary">
                    {label}
                  </Typography>
                  <Typography variant="body1">{val}</Typography>
                </Box>
              ))}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ─── 제출된 사진 탭 ─── */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 2,
          border: '1px solid #ddd',
        }}
      >
        <CardHeader
          avatar={<PhotoLibraryIcon />}
          title={`제출된 사진 (${detail.photoCount})`}
          sx={{ borderBottom: '2px solid #f5f5f5' }}
          slotProps={{
            title: {
              component: 'div',
              sx: {
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }
            }
          }}
        />
        <CardContent>
          <PhotoTabs photos={photos} />
        </CardContent>
      </Card>

      {/* ─── 상태 변경 확인 다이얼로그 ─── */}
      <ConfirmDialog
        open={confirmOpen}
        title="상태 변경 확인"
        message={`상태를 '${nextStatus}'(으)로 변경하시겠습니까?`}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
}
