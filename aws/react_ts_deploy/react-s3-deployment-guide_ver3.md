# React + TypeScript 프로젝트를 AWS S3에 배포하는 방법
> **작성일:** 2025-07-20

## 목차
- [React + TypeScript 프로젝트를 AWS S3에 배포하는 방법](#react--typescript-프로젝트를-awss3에-배포하는-방법)
  - [목차](#목차)
  - [소개](#소개)
  - [필수 전제 조건](#필수-전제-조건)
  - [방법 1](#방법1)
    - [로컬 빌드 → 수동 S3 업로드 ](#로컬빌드수동s3업로드-)
  - [방법 2](#방법2)
    - [Docker 빌드 → S3 업로드 ](#docker빌드s3업로드-)
  - [방법 3](#방법3)
    - [Git CI/CD → Docker → S3 자동화 ](#gitcicddockers3자동화-)
  - [2025년 최신 옵션 ](#2025년-최신-옵션-)
    - [AWS CDK Static Site 스택 예시](#awscdkstaticsite스택-예시)
  - [문서 참고 링크 ](#문서참고링크-)

---

## 소개
React + TypeScript 애플리케이션을 정적 호스팅 방식으로 **Amazon S3**에 배포하고, **Amazon CloudFront**를 통해 전 세계에 빠르게 제공하는 가이드입니다.  
- **목표:** `/dist` 또는 `/build` 산출물을 S3에 업로드하고 CloudFront를 통해 HTTPS로 서비스  
- **특징:** EC2, ECS 같은 서버 인스턴스를 사용하지 않고 유지보수 비용이 적음  
- **부가:** 페이지 히스토리(이력) 관리를 위한 **page‑table Bucket**(또는 DynamoDB) 설계 예시 포함  

---

## 필수 전제 조건
| 도구 | 최소 버전 | 설치 확인 |
|------|-----------|-----------|
| Node.js | 18 LTS | `node -v` |
| npm / pnpm / yarn | 최신 안정 버전 | `npm -v` |
| AWS CLI v2 | 2.15 이상 | `aws --version` |
| Docker Desktop | 4.x 이상 | `docker -v` |
| Git | 2.40 이상 | `git --version` |

> AWS CLI 구성: `aws configure` → **AWS Access Key ID / Secret Access Key / region(ap-northeast-2) / output(json)**

---

## 방법 1
### 로컬 빌드 → 수동 S3 업로드 <a id="방법-1"></a>

1. **프로젝트 생성 & 빌드**
   ```bash
   npx create-react-app my-app --template typescript
   cd my-app
   # 환경 분리
   cp .env .env.production
   npm run build          # → build/ 폴더 생성
   ```

2. **S3 버킷 (page‑table Bucket 포함)**
   - **정적 호스팅 버킷**: `my‑app‑web‑prod`
     * 버킷 차단 옵션 > 퍼블릭 ACL 허용 해제
     * _정적 웹사이트 호스팅_ 활성화, **index.html / error.html** 지정
   - **page‑table Bucket**: `my‑app‑history`  
     * 버전 관리(Versioning) ON → 히스토리 롤백 용이
     * PutObject 권한만 부여하는 IAM Policy 별도 작성

3. **CloudFront 배포**
   - 오리진: `my‑app‑web‑prod.s3.amazonaws.com`
   - **OAC(Origin Access Control)** 생성 후 버킷에 권한 추가
   - 기본 루트 객체: `index.html`
   - 캐싱 무효화(In‑validation) 기본 패턴: `/*`

4. **배포 스크립트**
   ```bash
   # build 결과 업로드
   aws s3 sync build/ s3://my-app-web-prod --delete
   # page‑table 기록
   TIMESTAMP=$(date +%Y%m%d-%H%M%S)
   aws s3 cp build/index.html s3://my-app-history/index-$TIMESTAMP.html
   # CloudFront 캐시 무효화
   DISTR_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[0].DomainName=='my-app-web-prod.s3.amazonaws.com'].Id" --output text)
   aws cloudfront create-invalidation --distribution-id $DISTR_ID --paths "/*"
   ```

5. **(선택) 배포 자동화 스크립트 예시**
   ```bash
   # deploy.sh
   npm run build &&
   aws s3 sync build/ s3://my-app-web-prod --delete &&
   aws s3 cp build/index.html s3://my-app-history/index-$(date +%s).html &&
   aws cloudfront create-invalidation --distribution-id $1 --paths "/*"
   ```
   > `./deploy.sh CLOUDFRONT_ID`

---

## 방법 2
### Docker 빌드 → S3 업로드 <a id="방법-2"></a>

1. **다중 스테이지 Dockerfile**
   ```dockerfile
   # 1️⃣ Build stage
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build     # → /app/build

   # 2️⃣ Minimal deploy stage
   FROM public.ecr.aws/nginx/nginx:alpine
   COPY --from=builder /app/build /usr/share/nginx/html
   # 헬스체크
   HEALTHCHECK CMD wget -qO- http://localhost || exit 1
   ```

2. **컨테이너에서 산출물 추출**
   ```bash
   docker build -t my-app:prod .
   ID=$(docker create my-app:prod)
   docker cp $ID:/usr/share/nginx/html ./build
   docker rm -v $ID
   ```

3. **S3 동기화**
   ```bash
   aws s3 sync ./build s3://my-app-web-prod --delete
   ```

4. **page‑table Bucket 기록 & CloudFront 무효화**  
   방법 1의 스크립트와 동일.

---

## 방법 3
### Git CI/CD → Docker → S3 자동화 <a id="방법-3"></a>

**GitHub Actions 예시(`.github/workflows/deploy.yml`)**

```yaml
name: CI – Build & Deploy
on:
  push:
    branches: [main]

env:
  AWS_REGION: ap-northeast-2
  BUCKET_WEB: my-app-web-prod
  BUCKET_HISTORY: my-app-history

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Use Node.js 18
      uses: actions/setup-node@v4
      with:
        node-version: 18

    - name: Cache node_modules
      uses: actions/cache@v4
      with:
        path: ~/.npm
        key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}

    - name: Install & Build
      run: |
        npm ci
        npm run build

    - name: Upload to S3
      run: |
        aws s3 sync build/ s3://$BUCKET_WEB --delete
        TIMESTAMP=$(date +%s)
        aws s3 cp build/index.html s3://$BUCKET_HISTORY/index-$TIMESTAMP.html
        CF_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[0].DomainName=='${{ env.BUCKET_WEB }}.s3.amazonaws.com'].Id" --output text)
        aws cloudfront create-invalidation --distribution-id $CF_ID --paths "/*"
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

> **IAM 정책 요약:**  
> * `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` for both buckets  
> * `cloudfront:CreateInvalidation`, `cloudfront:ListDistributions`

---

## 2025년 최신 옵션 <a id="2025년-최신-옵션"></a>

| 서비스 | 특징 | 단계 요약 |
|--------|------|-----------|
| **AWS Amplify Hosting (Gen 2)** | 풀매니지드 CI/CD + 호스팅, 커스텀 도메인, PR Preview | Amplify 콘솔 → Git 연동 → `amplify.yml` 자동 생성 → 자동 빌드 & 배포 |
| **AWS CDK v2 파이프라인** | IaC(인프라코드) + CI/CD 한 번에 선언 | `cdk init app --language typescript` → `StaticSiteStack` 작성 → `PipelineStack`에서 S3 Deploy Action → `npx cdk deploy` |
| **AWS CodeCatalyst Blueprint(Static Site)** | 코드 저장소+워크플로+이슈 추적 올‑인‑원 | 프로젝트 생성 시 **Static Website Blueprint** 선택 → 자동으로 S3 + CloudFront + 워크플로 생성 |
| **CloudFront Functions SPA 라우팅** | S3 SPA의 404 → `index.html` 리다이렉트 처리 서버리스 함수 | CloudFront Functions 생성 → Viewer Request 이벤트에서 경로 재작성 |

### AWS CDK Static Site 스택 예시
```ts
// cdk/lib/static-site-stack.ts
import { Bucket, BucketEncryption, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
export class StaticSiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'WebBucket', {
      encryption: BucketEncryption.S3_MANAGED,
      removalPolicy: RemovalPolicy.RETAIN,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    const oai = new OriginAccessIdentity(this, 'OAI');
    bucket.grantRead(oai);

    new Distribution(this, 'WebDistribution', {
      defaultBehavior: { origin: new S3Origin(bucket, { originAccessIdentity: oai }) },
      defaultRootObject: 'index.html',
    });
  }
}
```

---

## 문서 참고 링크 <a id="문서-참고-링크"></a>
- **AWS Amplify Hosting Gen 2** 공식 문서  
- **Amazon CloudFront OAC(Origin Access Control)** 가이드  
- **AWS CodeCatalyst Blueprints** 개요  
- **AWS CDK** Static Site 배포 참조 블로그  
- **AWS Prescriptive Guidance** React SPA → S3 + CloudFront 패턴  

> 위 링크들은 AWS 공식 Docs 또는 AWS 블로그에서 2024‑2025년 최신 버전으로 확인할 수 있습니다.  
