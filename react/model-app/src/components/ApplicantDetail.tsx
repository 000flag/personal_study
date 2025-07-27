import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { Model } from '../types';
import { fetchPhotos, updateModelStatus } from '../api';
import PhotoTabs from './PhotoTabs';

interface Props {
  model: Model;
  onBack: () => void;
}

const ApplicantDetail: React.FC<Props> = ({ model, onBack }) => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [status, setStatus] = useState(model.status);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPhotos(model.picSubmission).then(setPhotos);
  }, [model]);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    await updateModelStatus({ ...model, status: newStatus });
    setStatus(newStatus);
    setLoading(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={onBack} className="mb-3">뒤로가기</Button>
      <h2>{model.name} 상세 정보</h2>
      <p><strong>ID:</strong> {model.id}</p>
      <p><strong>Email:</strong> {model.email}</p>
      <p><strong>Tel:</strong> {model.telNo}</p>
      <p><strong>Height/Weight:</strong> {model.height}/{model.weight}</p>
      <p><strong>BMI:</strong> {model.bmi}</p>
      <Form.Group className="mb-3">
        <Form.Label>상태:</Form.Label>
        <Form.Select value={status} onChange={e => handleStatusChange(e.target.value)}>
          <option>신청</option>
          <option>검토</option>
          <option>계약 완료</option>
        </Form.Select>
      </Form.Group>
      {loading && <Spinner animation="border" />}
      <h3>제출 사진</h3>
      <PhotoTabs photos={photos} />
    </>
  );
};

export default ApplicantDetail;