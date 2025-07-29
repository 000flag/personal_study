# React + TypeScript AWS S3 배포 가이드

## 개요

React와 TypeScript로 개발된 웹 애플리케이션을 AWS S3에 배포하는 종합 가이드입니다. 이 문서는 정적 웹사이트 호스팅을 위한 S3 배포 전략과 CloudFront를 통한 CDN 구성, 그리고 효율적인 배포 자동화 방법을 제시합니다.

<br/>

## 목표

- React + TypeScript 애플리케이션의 S3 배포 방법 습득
- CloudFront CDN을 통한 성능 최적화 구현
- 배포 이력 관리를 위한 Database Bucket 활용
- 다양한 배포 방법론 비교 및 비용 분석
- 개발 환경에서 프로덕션까지의 배포 파이프라인 구축

<br/>

## CDN과 CloudFront 설명

### CDN(Content Delivery Network)이란?

CDN은 전 세계에 분산된 서버 네트워크를 통해 사용자에게 가장 가까운 위치에서 콘텐츠를 제공하는 서비스입니다.

### CloudFront의 역할

**성능 향상**
- 전 세계 엣지 로케이션에서 콘텐츠 캐싱
- 사용자와 가장 가까운 서버에서 콘텐츠 제공으로 지연 시간 최소화

**보안 강화**
- DDoS 공격 방어
- SSL/TLS 인증서를 통한 HTTPS 지원
- AWS Shield와 통합된 보안 기능

**비용 절감**
- S3 데이터 전송 비용 절약
- 캐싱을 통한 S3 요청 수 감소

<br/>

## Database Bucket 설명

### Page Table의 역할

Database Bucket은 배포 이력 관리를 위한 메타데이터 저장소입니다.

**주요 기능**
- 배포 버전 이력 추적
- 롤백 지점 관리
- 배포 상태 모니터링
- 배포 메타데이터 저장

**Page Table 구조**
```json
{
  "deploymentId": "deploy-20250625-001",
  "timestamp": "2025-06-25T12:00:00Z",
  "version": "v1.2.3",
  "buildHash": "abc123def456",
  "status": "success",
  "files": [
    {
      "path": "index.html",
      "hash": "xyz789",
      "size": 2048
    }
  ]
}
```

<br/>

### CloudFront에서 S3로의 설정

CloudFront를 S3와 연동하기 위해서는 다음 설정이 필요합니다:

```yaml
CloudFront 설정:
  - Origin: S3 버킷 도메인
  - Default Root Object: index.html
  - Error Pages: 404 → index.html (SPA 라우팅 지원)
  - Cache Behaviors: 정적 자원 캐싱 정책
  - SSL Certificate: AWS Certificate Manager 인증서
```

## 배포 방법 3가지

### 방법 1: 로컬 환경 직접 배포

**프로세스**
1. 로컬에서 React TypeScript 개발
2. 로컬 환경에서 빌드 (`npm run build` → `/dist` 생성)
3. AWS CLI를 통한 S3 업로드
4. Database Bucket에 배포 이력 기록
5. CloudFront 캐시 무효화

**장점**
- 간단하고 직관적인 프로세스
- 개발자가 직접 제어 가능
- 즉시 배포 가능

**단점**
- 수동 작업으로 인한 실수 가능성
- 개발 환경 차이로 인한 빌드 불일치
- 배포 과정의 표준화 부족

**구현 예시**
```bash
# 빌드
npm run build

# S3 업로드
aws s3 sync ./dist s3://your-bucket-name --delete

# CloudFront 무효화
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### 방법 2: Docker 컨테이너 배포

**프로세스**
1. 로컬에서 React TypeScript 개발
2. Docker 컨테이너 생성 (Node.js + React + TypeScript 환경)
3. 컨테이너 내에서 빌드 실행
4. 컨테이너에서 S3 배포
5. Database Bucket 이력 관리
6. CloudFront 연동

**Docker 구성**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "run", "deploy"]
```

**장점**
- 일관된 빌드 환경 보장
- 개발 환경과 독립적인 배포
- 환경 격리를 통한 안정성

**단점**
- Docker 학습 곡선
- 추가적인 컨테이너 관리 필요
- 로컬 Docker 환경 구성 필요

### 방법 3: Git CI/CD 파이프라인 자동화

**프로세스**
1. 로컬에서 React TypeScript 개발
2. Git에 commit/push
3. CI/CD 파이프라인 트리거
4. Docker 컨테이너에서 자동 빌드
5. 자동 S3 배포
6. Database Bucket 자동 이력 관리
7. CloudFront 자동 캐시 무효화

**GitHub Actions 예시**
```yaml
name: Deploy to S3
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to S3
        run: aws s3 sync ./dist s3://${{ secrets.S3_BUCKET }} --delete
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          
      - name: Invalidate CloudFront
        run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
```

**장점**
- 완전 자동화된 배포 프로세스
- 코드 변경 시 자동 배포
- 배포 이력 자동 관리
- 팀 협업에 최적화

**단점**
- 초기 설정 복잡성
- CI/CD 파이프라인 관리 필요
- Git 워크플로우 의존성

<br/>

## AWS 비용 예측

### 방법 1: 로컬 직접 배포
**월 예상 비용: $5-15**
- S3 스토리지:
  - S3 Standard: 모든 데이터 유형에 적합한 범용 스토리지로, 대개 자주 액세스하는 데이터에 사용됨
    - 처음 50TB/월	| GB당 USD 0.025
    - 다음 450TB/월	| GB당 USD 0.024
    - 500TB 초과/월	| GB당 USD 0.023
- S3 요청: $1-2
- CloudFront: $1-5
- 데이터 전송: $2-5

### 방법 2: Docker 배포
**월 예상 비용: $5-15**
- 기본 S3/CloudFront 비용 동일
- 로컬 Docker 실행으로 추가 AWS 비용 없음
- 개발자 시간 비용은 절약

### 방법 3: CI/CD 자동화
**월 예상 비용: $8-25**
- S3/CloudFront 기본 비용: $5-15
- GitHub Actions: $0 (공개 리포지토리) / $3-10 (프라이빗)
- 추가 자동화 도구 비용 가능

**정확한 비용 계산을 위한 참고 링크**
- [AWS Pricing Calculator](https://calculator.aws/) - 실제 사용량 기반 정확한 비용 산출
- [AWS S3 요금 정책](https://aws.amazon.com/s3/pricing/) - S3 스토리지 및 요청 비용 상세 정보
- [AWS CloudFront 요금 정책](https://aws.amazon.com/cloudfront/pricing/) - CDN 데이터 전송 비용 상세 정보

**비용 최적화 팁**
- CloudFront 캐싱 정책 최적화
- S3 Intelligent-Tiering 활용
- 불필요한 파일 정리
- 압축 최적화 (gzip, brotli)

<br/>

## 권장 사항

**개발 초기**: 방법 1 (로컬 직접 배포)
- 빠른 프로토타이핑과 테스트에 적합

**팀 개발**: 방법 3 (CI/CD 자동화)
- 안정적이고 일관된 배포 프로세스 확보

**운영 환경**: 방법 3 + 추가 모니터링
- CloudWatch, AWS X-Ray 등을 통한 모니터링 강화

<br/>

## 참고: 왜 EC2가 아닌 S3에 배포하는지?

### S3 배포의 장점

**비용 효율성**
- EC2 인스턴스 운영 비용 대비 S3 정적 호스팅 비용이 현저히 낮음
- 서버 유지보수 비용 절약

**관리 용이성**
- 서버 관리, 보안 패치, OS 업데이트 등의 운영 부담 없음
- AWS가 인프라 관리를 담당

**확장성**
- 트래픽 증가에 따른 자동 확장
- 글로벌 CDN 연동을 통한 전 세계 사용자 대응

**개별 파일 관리**
- S3에서는 각 파일이 개별적으로 관리되어 세밀한 버전 관리 가능
- 특정 파일만 업데이트하여 효율적인 배포 가능

**고가용성**
- AWS S3의 99.999999999%(11 9's) 내구성 보장
- 다중 가용 영역에 걸친 자동 복제

<br/>

## 결론

React + TypeScript 애플리케이션의 S3 배포는 비용 효율적이고 확장 가능한 솔루션입니다. 프로젝트의 규모와 팀의 요구사항에 따라 적절한 배포 방법을 선택하고, CloudFront를 통한 성능 최적화와 Database Bucket을 통한 이력 관리를 통해 안정적인 서비스 운영이 가능합니다.

성공적인 S3 배포를 통해 서버 관리의 부담 없이 고성능의 웹 애플리케이션을 전 세계 사용자에게 제공할 수 있습니다.
