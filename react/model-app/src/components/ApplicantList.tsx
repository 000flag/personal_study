import React, { useEffect, useState } from 'react';
import { Table, Form, Spinner } from 'react-bootstrap';
import { fetchModels, updateModelStatus } from '../api';
import { Model } from '../types';
import PaginationComponent from './PaginationComponent';

interface Props {
  onSelect: (model: Model) => void;
}

const ApplicantList: React.FC<Props> = ({ onSelect }) => {
  const [models, setModels] = useState<Model[]>([]);
  const [pageable, setPageable] = useState({ pageNumber: 0, pageSize: 20, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(false);

  const load = async (page = 0) => {
    setLoading(true);
    const res = await fetchModels(page);
    setModels(res.data.content);
    setPageable({
      pageNumber: res.data.pageable.pageNumber,
      pageSize: res.data.pageable.pageSize,
      totalPages: res.data.totalPages,
      totalElements: res.data.totalElements,
    });
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (model: Model, status: string) => {
    await updateModelStatus({ ...model, status });
    load(pageable.pageNumber);
  };

  return (
    <>
      {loading && <Spinner animation="border" />}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {models.map(model => (
            <tr key={model.id}>
              <td>{model.id}</td>
              <td className="text-primary" style={{ cursor: 'pointer' }} onClick={() => onSelect(model)}>
                {model.name}
              </td>
              <td>{model.email}</td>
              <td>{model.telNo}</td>
              <td>
                <Form.Select value={model.status} onChange={e => handleStatusChange(model, e.target.value)}>
                  <option>신청</option>
                  <option>검토</option>
                  <option>계약 완료</option>
                </Form.Select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <PaginationComponent
        pageNumber={pageable.pageNumber}
        totalPages={pageable.totalPages}
        onPageChange={load}
      />
    </>
  );
};

export default ApplicantList;