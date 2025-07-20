# React + TypeScript 프로젝트를 AWS S3에 배포하는 모든 과정

React + TypeScript 프로젝트를 **AWS S3와 CloudFront**에 배포하는 방법은 다음과 같습니다. 아래에는 기존 3가지 방법을 상세하게 설명하고, 최신 자동화 방법도 추가로 안내합니다.

### 1. 로컬 환경 → 빌드 → S3 직접 업로드 → 이력 관리 DB → CloudFront 연결

1. **로컬 환경에서 프로젝트 준비**
    - 필요한 종속성 설치: `npm install`
    - 환경별 `.env` 등 환경 파일 세팅
2. **빌드 파일 생성**
    - 명령어 실행: `npm run build` (혹은 `yarn build`)
    - `/dist` 또는 `/build` 폴더에 정적 파일(js, css, html 등) 생성
3. **S3 버킷 생성 및 설정**
    - AWS 콘솔에서 S3 버킷 생성
    - 버킷 이름: 고유하게 지정
4. **정적 웹 호스팅 활성화**
    - S3 버킷의 속성(프로퍼티)에서 ‘정적 웹 사이트 호스팅(Static website hosting)’ 활성화
    - index 문서 및 error 문서 지정
5. **빌드 파일 S3에 업로드**
    - AWS 콘솔에서 업로드하거나
    - CLI 사용:

```bash
aws s3 sync ./build s3://your-bucket-name
```

6. **이력 관리를 위한 데이터베이스(bucket/page table 등) 기록**
    - 배포 이력을 별도의 RDS, DynamoDB, 혹은 여러 S3 버킷으로 관리.
    - 버전/배포 시각/담당자 등 기록
7. **CloudFront와 S3 연결**
    - CloudFront 배포 생성(Origin: S3 버킷)
    - Caching, SSL, Custom Domain 등 설정
    - S3 버킷 정책에서 CloudFront 액세스 허용
8. **최종 배포 확인**
    - CloudFront의 도메인(예: xxxxx.cloudfront.net) 또는 본인 도메인 연결 확인

### 2. Docker 환경 활용: 로컬 → Docker 빌드 및 배포 → 이력 관리 DB → CloudFront 연결

1. **Docker 환경 구축**
    - Dockerfile 작성: Node를 기반 이미지로 사용해 종속성 설치 및 빌드
    - 예시 Dockerfile:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

2. **Docker 빌드 및 컨테이너 실행**
    - `docker build -t react-app .`
    - `docker run -v $(pwd)/build:/build react-app`
3. **생성된 빌드 파일을 로컬로 복사**
4. **S3에 빌드 파일 업로드**
    - AWS CLI를 컨테이너에 설치 후 `aws s3 sync`로 업로드, 또는 컨테이너에서 파일 꺼내 로컬에서 업로드
5. **이력 관리 DB 기록**
    - 배포 전후 메타데이터 기록
6. **CloudFront로 배포**
    - 위 1번 방법과 동일

### 3. CI/CD 자동화: Git → Docker 빌드 → Deploy → DB → CloudFront → S3

1. **Git Repository에 코드 PUSH**
    - 개발 PC에서 변경사항 커밋 후 push
2. **CI/CD 파이프라인 트리거**
    - GitHub Actions, AWS CodePipeline, Jenkins 등에서
    - 도커 이미지를 이용해 `npm install` 및 빌드
3. **배포 아티팩트 업로드**
    - 빌드 결과물을 S3에 자동 업로드
    - 예:

```yaml
- name: Deploy to S3
  run: aws s3 sync build/ s3://your-bucket-name
```

4. **이력 관리 DB 기록**
    - 배포 후 정보 기록(CI 로그에 남기거나 별도 DB 사용)
5. **CloudFront 캐시 무효화(Invalidate)**
    - 새 빌드 반영을 위해 캐시 무효화 요청
    - `aws cloudfront create-invalidation --distribution-id XXXXXX --paths "/*"`
6. **배포 확인**
    - CloudFront 또는 S3 Endpoint로 접속하여 정상 동작 확인

## 최신 자동화 방법: AWS CodePipeline \& AWS CDK \& AWS Amplify

### A. AWS CodePipeline, CodeBuild 이용한 완전 자동화[^1_1][^1_2][^1_3][^1_4]

1. **GitHub/GitLab 등과 연동**
    - Source Stage에서 브랜치 감시
2. **CodeBuild에서 빌드**
    - `npm ci`, `npm run build` 실행
    - 빌드 산출물 생성
3. **S3 배포**
    - build 산출물을 S3로 자동 업로드
4. **CloudFront 캐시 무효화**
    - 배포 단계에서 캐시 무효화 자동 수행
5. **CI/CD 파이프라인 정의는 AWS CDK 등 IaC 사용**
    - CDK 코드로 S3, CloudFront, CodePipeline 등 인프라 프로비저닝 자동화
6. **이력 관리**
    - 배포 파이프라인 내에 로그/DB 연동 추가 가능

#### 특징

- 코드 커밋이 배포까지 자동으로 이어짐
- 인프라 변경도 코드 관리(IaC)
- 최소한의 수동 개입, 높은 신뢰성


### B. AWS Amplify 이용한 풀-매니지드 호스팅[^1_4]

1. **GitHub 등 연결 후 프로젝트 Import**
2. **Build/Deploy 설정 자동 생성 (Amplify Console)**
3. **커밋/푸시 시 마다 빌드 및 S3 + CloudFront로 서빙**
4. **배포 버전 별 이력, 롤백 등 지원**
5. **커스텀 도메인, SSL 자동설정**

#### 특징

- UI 기반 설정, 코드형 배포 스크립트 불필요
- 이력/롤백, 미리보기 등 관리 기능 강화


## 정리

| 방법 | 빌드 환경 | 자동화 수준 | 이력 관리 | 사용 도구 | 특징 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | 로컬 PC | 수동 | 수동/직접 | AWS CLI, S3, CloudFront | 손쉬운 직접 업로드 |
| 2 | Docker | 부분 자동화 | 수동/직접 | Docker, AWS CLI | OS와 환경 일관성 |
| 3 | CI/CD | 높음 | 자동 | CI도구, S3, CloudFront | DevOps 기반 자동 배포 |
| 최신 | CodePipeline/Amplify | 최고 | 자동 | IaC(CDK), Amplify | 완전 자동, 손쉬운 롤백/이력/도메인 |

**추천**: 팀 규모, 프로젝트 특성에 따라 위 방법 중 선택하되, 최신 방식(CodePipeline/CDK/Amplify)이 관리 편의성과 확장성, 이력관리에 탁월합니다.
CloudFront와 S3 연동 및 캐시 처리, 이력 관리까지 자동화하는 최신 워크플로우를 적극 활용하세요[^1_1][^1_2][^1_4].

**추가 참고:**

- 공식 AWS 배포 가이드: AWS Prescriptive Guidance, AWS CDK, Amplify 문서 참고[^1_5][^1_6][^1_4].

<div style="text-align: center">⁂</div>

[^1_1]: https://www.youtube.com/watch?v=1k6s4shjpRc

[^1_2]: https://github.com/mikaeelkhalid/react-deployment-cicd-aws-cdk

[^1_3]: https://docs.aws.amazon.com/codepipeline/latest/userguide/tutorials-s3deploy.html

[^1_4]: https://aws.amazon.com/getting-started/hands-on/build-react-app-amplify-graphql/module-one/

[^1_5]: https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/deploy-a-react-based-single-page-application-to-amazon-s3-and-cloudfront.html

[^1_6]: https://aws.plainenglish.io/how-to-deploy-a-react-app-with-aws-cdk-in-s3-aa9f8cb0e4a3

[^1_7]: https://stackoverflow.com/questions/70898140/deploying-a-react-typescript-app-to-aws-s3

[^1_8]: https://www.youtube.com/watch?v=BQqmyk--dIM

[^1_9]: https://www.geeksforgeeks.org/cloud-computing/how-to-host-your-react-application-in-aws-s3/

[^1_10]: https://stackoverflow.com/questions/59261197/hosting-a-react-application-in-aws-s3-without-any-backend

[^1_11]: https://dev.to/ashishdonga/how-to-deploy-your-react-js-app-to-aws-at-low-cost-april-2022-3ga1

[^1_12]: https://sergiolema.dev/2024/02/19/deploy-a-react-frontend-to-aws-s3/

[^1_13]: https://www.reddit.com/r/reactjs/comments/1apyfe6/deploying_react_apps_on_aws_s3/

[^1_14]: https://circleci.com/blog/automating-react-app-deployment-to-aws-elastic-beanstalk/

[^1_15]: https://dev.to/saddamazad/deploy-react-vite-on-aws-s3-and-cloudfront-a-complete-guide-1gjg

[^1_16]: https://blog.engineermindscape.com/p/building-and-deploying-a-react-cv-800

[^1_17]: https://www.youtube.com/watch?v=CORUc9CcK5I

[^1_18]: https://stackoverflow.com/questions/44191613/how-to-deploy-react-project-to-aws-s3

[^1_19]: https://velog.io/@leynsp/Next.js-프로젝트를-AWS-S3로-배포하기-with-Docker

[^1_20]: https://velog.io/@yoonth95/GitHub-Actions으로-CICD-구축하기-AWS-S3-및-CloudFront를-활용한-자동-배포


---

## React + TypeScript 프로젝트를 AWS S3에 배포하는 방법 상세 가이드

최종 목표는 React + TypeScript 프로젝트를 **AWS S3에 배포**하고, **CloudFront를 통한 별도 캐싱 및 CDN 설정**을 하는 것입니다. EC2 인스턴스를 사용하지 않고, S3에 정적 파일을 올려서 개별 관리하는 방식을 채택합니다. 이력 관리를 위한 데이터베이스 연동도 포함합니다.

# 1. 로컬 환경 → 로컬 빌드 → S3 업로드 → 이력 관리 DB → CloudFront 연결

### 1) 프로젝트 빌드 및 환경 설정

- React + TypeScript 프로젝트 루트에서 의존성 설치

```bash
npm install
```

- 환경 변수 파일 생성 및 설정 (`.env` 또는 `.env.production`)

```env
REACT_APP_API_URL=https://api.example.com
```

- 빌드 명령어 실행 (`/dist` 또는 `/build` 폴더 생성)

```bash
npm run build
```


### 2) AWS S3 세팅 및 배포

- AWS S3 버킷 생성 (고유한 이름 지정)
- 버킷에서 **정적 웹 호스팅** 활성화
    - 인덱스 문서: `index.html`
    - 오류 문서: `index.html` (SPA를 위한 fallback)
- 빌드 산출물 `dist` 또는 `build` 폴더 내용 S3에 업로드

```bash
aws s3 sync ./build s3://your-bucket-name --delete
```

- S3 버킷 정책
    - CloudFront 허용 정책 추가(버킷 정책에서 Origin Access Identity 또는 OAI 설정)
- 배포 이력 관리를 위한 데이터베이스 업데이트 (예: DynamoDB, RDS)
    - 배포 시각, 빌드 버전, 배포자, 배포 상태 기록
    - 간단한 API 또는 CLI 스크립트로 이력 테이블 업데이트


### 3) CloudFront 배포 설정

- CloudFront에서 S3 버킷을 오리진으로 하는 배포 생성
- 캐싱 정책 설정 (인덱스 문서 캐시 최소화, 정적 리소스 장기 캐시)
- OAI (Origin Access Identity) 설정으로 S3 직접 접근 차단 및 CloudFront 경유만 허용
- SSL 인증서 적용 (AWS Certificate Manager)
- 커스텀 도메인 연결 및 경로 설정


### 4) 최종 배포 확인

- CloudFront 배포 도메인 또는 커스텀 도메인 접속하여 정상 동작 확인
- 배포 이력 확인 및 필요하면 롤백 절차 진행


# 2. 로컬 환경 → Docker 가상화 환경 → 빌드 \& 배포 → 이력 관리 DB → CloudFront → S3

### 1) Dockerfile 작성

```dockerfile
# 1단계: 빌드
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2단계: 프로덕션 이미지
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

- `nginx.conf` 예시 (SPA 라우팅 지원용)

```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri /index.html;
  }
}
```


### 2) Docker 이미지 빌드 및 실행

```bash
docker build -t react-ts-app .
docker run -p 8080:80 react-ts-app
```


### 3) 빌드 아티팩트 분리 및 AWS 배포

- 위 단계에서 빌드된 `/app/build` 폴더를 컨테이너 외부에 복사하거나,
- AWS CLI 설치된 컨테이너에서 직접 `aws s3 sync` 명령으로 S3에 업로드


### 4) 이력 관리 DB 업데이트

- 배포 성공 시점에 배포 이력 (버전, 시각, 메타데이터 등) DB에 기록


### 5) CloudFront 설정

- 1번 방법과 동일하게 CloudFront 배포 및 정책 설정


# 3. Git + CI/CD 파이프라인 + Docker 환경 → 빌드 → 배포 → 이력 관리 DB → CloudFront → S3

### 1) Git Repository 커밋 및 푸시

- 프로젝트 코드를 GitHub, GitLab 등 원격 저장소에 Push


### 2) CI/CD 파이프라인 구성 예 (GitHub Actions 또는 AWS CodePipeline)

- `.github/workflows/deploy.yml` 예시 (GitHub Actions)

```yaml
name: Deploy React App

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies and build
        run: |
          npm install
          npm run build

      - name: Deploy to S3
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: 'ap-northeast-2'
        run: |
          aws s3 sync build/ s3://your-bucket-name --delete

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```


### 3) Docker를 통한 빌드 환경 통일 (선택적)

- CI에서 Docker 이미지를 만들어 빌드 후 배포 가능
- 도커 이미지 내부에서 `npm ci`, `npm run build` 실행 후 S3 업로드


### 4) 이력 관리 DB 자동 업데이트

- CI/CD 파이프라인 중에 이력 DB에 버전 및 배포 정보 기록(별도의 API 호출 또는 직접 DB 연결)


### 5) CloudFront 캐시 무효화 및 배포 완료 확인

# 최신 방법: AWS Amplify 및 AWS CDK 기반 완전 자동화 방법

| 방법 | 설명 |
| :-- | :-- |
| **AWS Amplify** | GitHub 등 리포지토리 연결 → Amplify에서 빌드, 배포 완전 자동화<br>- 빌드 스크립트 자동 생성<br>- 배포 이력 및 롤백 관리<br>- 커스텀 도메인 및 SSL 자동 설정 |
| **AWS CDK + CodePipeline** | 코드형 인프라(IaC)로 S3, CloudFront, CodePipeline, CodeBuild 설정<br>- Git Push 시 자동 빌드 및 배포<br>- CloudFront 캐시 무효화 자동화<br>- 이력 관리 연동 가능 |

### AWS Amplify 상세 프로세스

1. GitHub 등 리포지토리 연결 후 Amplify 프로젝트 생성
2. 빌드 설정 (`amplify.yml`) 자동 생성 또는 수동 작성
3. git push 시마다 Amplify가 자동으로 빌드, S3 배포, CloudFront 서비스 구성
4. 배포 상태, 버전 관리, 롤백 UI 제공
5. 커스텀 도메인 및 SSL 자동 설정
6. 별도의 서버 설정 불필요, 플랫폼 관리 완전 자동화

### AWS CDK + CodePipeline 활용 예시

1. AWS CDK 프로젝트로 인프라 코드 작성 (S3 버킷, CloudFront, CodeBuild, CodePipeline)
2. GitHub 연동 설정 (Webhooks 또는 CodeStar 연결)
3. CodeBuild 스테이지에서 `npm ci && npm run build` 빌드 수행
4. 빌드 결과를 S3 버킷에 자동 업로드
5. CloudFront 캐시 무효화 자동 실행
6. CDK로 인프라 관리 → 반복 배포 및 인프라 변경도 코드로 버전 관리 가능
7. 이력 관리를 위한 추가 Lambda 함수 또는 DB 연동 가능

## 정리

| 방법 | 환경 구성 | 배포 자동화 수준 | 주요 도구 | 특징 |
| :-- | :-- | :-- | :-- | :-- |
| 1. 로컬 빌드 | 로컬 npm, AWS CLI | 수동 | AWS CLI, S3, CloudFront | 가장 기본, 수동 배포, 이해 쉽고 빠름 |
| 2. Docker | Docker 기반 빌드 \& 실행 | 일부 자동화 | Docker, AWS CLI, S3 | 환경 일관성 유지, 빌드 분리 |
| 3. CI/CD | Git + CI/CD + Docker 빌드 | 자동 | GitHub Actions / CodePipeline | DevOps 기반 완전 자동배포 환경 구축 |
| 최신 | AWS Amplify / AWS CDK + CodePipeline | 매우 높음 | AWS Amplify, AWS CDK, CodePipeline | 전 과정 자동화, 인프라 + 배포 통합 관리 |

이 4가지 배포 방법을 프로젝트 및 팀 상황에 맞게 선택하고, CloudFront와 S3의 권한, 캐싱 정책, 이력 관리까지 신경 써서 구축하시길 권장합니다. 특히 최신 자동화 방법인 AWS Amplify 또는 CDK 기반 파이프라인은 확장성과 유지보수가 뛰어나 운영 비용과 시간을 절감할 수 있습니다.

<div style="text-align: center">⁂</div>

[^2_1]: https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/deploy-a-react-based-single-page-application-to-amazon-s3-and-cloudfront.html

[^2_2]: https://www.youtube.com/watch?v=BQqmyk--dIM

[^2_3]: https://stackoverflow.com/questions/70898140/deploying-a-react-typescript-app-to-aws-s3

[^2_4]: https://aws.plainenglish.io/deploying-a-react-app-to-aws-s3-and-cloudfront-using-aws-cdk-66162dc3f3dd

[^2_5]: https://aws.plainenglish.io/how-to-deploy-a-react-app-with-aws-cdk-in-s3-aa9f8cb0e4a3

[^2_6]: https://stackoverflow.com/questions/65831617/unable-to-start-react-with-typescript-in-docker-container

[^2_7]: https://github.com/mikaeelkhalid/react-deployment-cicd-aws-cdk

[^2_8]: https://aws.amazon.com/blogs/mobile/amplify-gen2-ga/

[^2_9]: https://sergiolema.dev/2024/02/19/deploy-a-react-frontend-to-aws-s3/

[^2_10]: https://www.youtube.com/watch?v=FfboFUeIR_8

[^2_11]: https://www.youtube.com/watch?v=lSlQZK_O0DU

[^2_12]: https://www.pulumi.com/events/how-to-deploy-react-app-to-aws/

[^2_13]: https://www.geeksforgeeks.org/cloud-computing/how-to-host-your-react-application-in-aws-s3/

[^2_14]: https://www.docker.com/blog/how-to-dockerize-react-app/

[^2_15]: https://velog.io/@yoonth95/GitHub-Actions으로-CICD-구축하기-AWS-S3-및-CloudFront를-활용한-자동-배포

[^2_16]: https://docs.aws.amazon.com/lambda/latest/dg/lambda-typescript.html

[^2_17]: https://dev.to/saddamazad/deploy-react-vite-on-aws-s3-and-cloudfront-a-complete-guide-1gjg

[^2_18]: https://adjh54.tistory.com/417

[^2_19]: https://arcozz.tistory.com/2

[^2_20]: https://aws.amazon.com/getting-started/hands-on/build-react-app-amplify-graphql/module-one/

