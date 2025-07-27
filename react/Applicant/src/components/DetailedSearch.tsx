import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';
import { Button } from '@mui/material';
import Flatpickr from 'react-flatpickr';
import { Korean } from 'flatpickr/dist/l10n/ko';
import 'flatpickr/dist/themes/material_blue.css';

export interface DetailedSearchProps {
    name: string;
    onNameChange: (v: string) => void;
    onSearch: (params: Record<string, string | number | boolean | Date | null>) => void;
}

export default function DetailedSearch({ name, onNameChange, onSearch }: DetailedSearchProps) {
    const [filters, setFilters] = useState<Record<string, string | number | boolean | Date | null>>({
        name: name || '',
    });

    // name prop이 바뀌면 로컬 state도 업데이트
    useEffect(() => {
        setFilters((prev) => ({ ...prev, name }));
    }, [name]);

    const handleChange = (field: string, value: string | number | boolean | Date | null) => {
        if (typeof value === 'string' && value.trim() === '') {
            setFilters(prev => ({ ...prev, [field]: null }));
            if (field === 'name') onNameChange('');
            return;
        }
        setFilters(prev => ({ ...prev, [field]: value }));
        if (field === 'name' && typeof value === 'string') onNameChange(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const params: Record<string, string | number | boolean | Date | null> = { ...filters };

        ['operDateFrom', 'operDateTo'].forEach(key => {
            if (params[key] instanceof Date) {
                params[key] = (params[key] as Date).toISOString().split('T')[0];
            }
        });

        ['createdFrom', 'createdTo'].forEach(key => {
            if (params[key] instanceof Date) {
                params[key] = (params[key] as Date).toISOString();
            }
        });

        onSearch(params);
    };

    const getDateValue = (key: string): Date | null => {
        const val = filters[key];
        return val instanceof Date ? val : null;
    };

    return (
        <Card className="mb-3">
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Row className="gy-3">
                        <Col md={3}>
                            <Form.Label>ID</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="ID 입력"
                                onChange={e => handleChange('id', Number(e.currentTarget.value))}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label>고객번호</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="고객번호 입력"
                                onChange={e => handleChange('cusNo', e.currentTarget.value)}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label>상태</Form.Label>
                            <Form.Select onChange={e => handleChange('status', e.currentTarget.value)}>
                                <option value="">전체</option>
                                <option value="신청">신청</option>
                                <option value="승인">승인</option>
                                <option value="거절">거절</option>
                                <option value="완료">완료</option>
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Form.Label>이름</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="이름 입력"
                                value={filters.name?.toString() ?? ''}
                                onChange={e => handleChange('name', e.currentTarget.value)}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label>이메일</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="이메일 입력"
                                onChange={e => handleChange('email', e.currentTarget.value)}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label>전화번호</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="전화번호 입력"
                                onChange={e => handleChange('telNo', e.currentTarget.value)}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label>시술종류</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="시술 종류 입력"
                                onChange={e => handleChange('cstype', e.currentTarget.value)}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label>키 최소</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                placeholder="키 (cm) 최소값"
                                onChange={e => {
                                    const v = e.currentTarget.value;
                                    handleChange('minHeight', v === '' ? null : Number(v));
                                }}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label>키 최대</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                placeholder="키 (cm) 최대값"
                                onChange={e => {
                                    const v = e.currentTarget.value;
                                    handleChange('maxHeight', v === '' ? null : Number(v));
                                }}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label>몸무게 최소</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                placeholder="몸무게 (kg) 최소값"
                                onChange={e => {
                                    const v = e.currentTarget.value;
                                    handleChange('minWeight', v === '' ? null : Number(v));
                                }}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label>몸무게 최대</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                placeholder="몸무게 (kg) 최대값"
                                onChange={e => {
                                    const v = e.currentTarget.value;
                                    handleChange('maxWeight', v === '' ? null : Number(v));
                                }}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label>나이 최소</Form.Label>
                            <Form.Control
                                type="number"
                                min={20}
                                placeholder="나이 최소값 (20세 이상)"
                                onChange={e => {
                                    const v = e.currentTarget.value;
                                    handleChange('minAge', v === '' ? null : Number(v));
                                }}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label>나이 최대</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="나이 최대값"
                                onChange={e => {
                                    const v = e.currentTarget.value;
                                    handleChange('maxAge', v === '' ? null : Number(v));
                                }}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Label>생년월일</Form.Label>
                            <Flatpickr
                                className="form-control"
                                placeholder="YYYYMMDD"
                                value={getDateValue('birth') ?? undefined}
                                onChange={([date]) => handleChange('birth', date)}
                                options={{
                                    dateFormat: 'Ymd', // YYYYMMDD 형식
                                    locale: Korean,
                                    allowInput: true,
                                }}
                            />
                        </Col>

                        {/* 수술일 시작 */}
                        <Col md={3}>
                            <Form.Label>수술일 시작</Form.Label>
                            <Flatpickr
                                className="form-control"
                                placeholder="YYYYMMDD"
                                value={getDateValue('operDateFrom') ?? undefined}
                                onChange={([date]) => handleChange('operDateFrom', date)}
                                options={{
                                    enableTime: true,
                                    dateFormat: 'Y-m-d H:i',
                                    locale: Korean
                                }}
                            />
                        </Col>

                        {/* 수술일 종료 */}
                        <Col md={3}>
                            <Form.Label>수술일 종료</Form.Label>
                            <Flatpickr
                                className="form-control"
                                placeholder="YYYYMMDD"
                                value={getDateValue('operDateTo') ?? undefined}
                                onChange={([date]) => handleChange('operDateTo', date)}
                                options={{
                                    enableTime: true,
                                    dateFormat: 'Y-m-d H:i',
                                    locale: Korean
                                }}
                            />
                        </Col>

                        {/* 활성화 여부 */}
                        <Col md={3}>
                            <Form.Label>활성화 여부</Form.Label>
                            <Form.Select onChange={e => handleChange('activated', e.currentTarget.value === 'true')}>
                                <option value="">전체</option>
                                <option value="true">활성</option>
                                <option value="false">비활성</option>
                            </Form.Select>
                        </Col>

                        {/* 생성일 시작 */}
                        <Col md={3}>
                            <Form.Label>생성일 시작</Form.Label>
                            <Flatpickr
                                className="form-control"
                                placeholder="YYYYMMDD"
                                value={getDateValue('createdFrom') ?? undefined}
                                onChange={([date]) => handleChange('createdFrom', date)}
                                options={{
                                    enableTime: true,
                                    dateFormat: 'Y-m-d H:i',
                                    locale: Korean
                                }}
                            />
                        </Col>

                        {/* 생성일 종료 */}
                        <Col md={3}>
                            <Form.Label>생성일 종료</Form.Label>
                            <Flatpickr
                                className="form-control"
                                placeholder="YYYYMMDD"
                                value={getDateValue('createdTo') ?? undefined}
                                onChange={([date]) => handleChange('createdTo', date)}
                                options={{
                                    enableTime: true,
                                    dateFormat: 'Y-m-d H:i',
                                    locale: Korean
                                }}
                            />
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-3">
                        <Button variant="outlined" color="primary" type="submit">
                            검색
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
}
