# React + TypeScript 프로젝트를 AWS S3에 배포하는 방법

## 방법 1: 로컬 환경에서 직접 배포

### 1단계: 프로젝트 준비 및 빌드
```bash
# React + TypeScript 프로젝트 생성
npx create-react-app my-react-app --template typescript
cd my-react-app

# 개발 서버 실행 (테스트용)
npm start

# 프로덕션 빌드 생성
npm run build
```

### 2단계: AWS CLI 설정
```bash
# AWS CLI 설치
npm install -g aws-cli

# AWS 계정 설정
aws configure
# Access Key ID 입력
# Secret Access Key 입력
# Default region 입력 (예: ap-northeast-2)
# Output format 입력 (json)
```

### 3단계: S3 버킷 생성 및 설정
```bash
# S3 버킷 생성
aws s3 mb s3://my-react-app-bucket

# 정적 웹사이트 호스팅 활성화
aws s3 website s3://my-react-app-bucket --index-document index.html --error-document error.html

# 퍼블릭 액세스 차단 해제 (AWS Console에서 수행 권장)
```

### 4단계: 버킷 정책 설정
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::my-react-app-bucket/*"
        }
    ]
}
```

### 5단계: 빌드 파일 업로드
```bash
# build 폴더의 모든 파일을 S3에 업로드
aws s3 sync build/ s3://my-react-app-bucket --delete

# 캐시 제어 헤더 설정
aws s3 sync build/ s3://my-react-app-bucket --cache-control "max-age=31536000" --exclude "*.html"
aws s3 sync build/ s3://my-react-app-bucket --cache-control "no-cache" --exclude "*" --include "*.html"
```

### 6단계: CloudFront 배포 설정
```bash
# CloudFront 배포 생성 (JSON 파일로 설정)
aws cloudfront create-distribution --distribution-config file://distribution-config.json
```

distribution-config.json 예시:
```json
{
    "CallerReference": "my-react-app-2025",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-my-react-app-bucket",
                "DomainName": "my-react-app-bucket.s3.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-my-react-app-bucket",
        "ViewerProtocolPolicy": "redirect-to-https",
        "MinTTL": 0,
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {"Forward": "none"}
        }
    },
    "Comment": "React App CloudFront Distribution",
    "Enabled": true
}
```

### 7단계: 데이터베이스 배포 이력 관리
```bash
# DynamoDB 테이블 생성 (배포 이력 관리)
aws dynamodb create-table \
    --table-name page-deployment-history \
    --attribute-definitions \
        AttributeName=deploymentId,AttributeType=S \
        AttributeName=timestamp,AttributeType=S \
    --key-schema \
        AttributeName=deploymentId,KeyType=HASH \
        AttributeName=timestamp,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5

# 배포 이력 기록
aws dynamodb put-item \
    --table-name page-deployment-history \
    --item '{
        "deploymentId": {"S": "deploy-001"},
        "timestamp": {"S": "2025-07-20T10:00:00Z"},
        "version": {"S": "1.0.0"},
        "s3Bucket": {"S": "my-react-app-bucket"},
        "cloudfrontId": {"S": "E1234567890"}
    }'
```

---

## 방법 2: Docker를 이용한 배포

### 1단계: Dockerfile 생성
```dockerfile
# 멀티 스테이지 빌드
FROM node:18-alpine as build

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm ci --only=production

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# Nginx를 사용한 프로덕션 스테이지
FROM nginx:alpine

# 빌드된 파일을 nginx로 복사
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2단계: Docker Compose 설정
```yaml
# docker-compose.yml
version: '3.8'
services:
  react-app:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
  
  # AWS CLI 컨테이너 (배포용)
  aws-deploy:
    image: amazon/aws-cli:latest
    volumes:
      - ./build:/build
      - ~/.aws:/root/.aws:ro
    command: >
      sh -c "
        aws s3 sync /build s3://my-react-app-bucket --delete &&
        aws cloudfront create-invalidation --distribution-id E1234567890 --paths '/*'
      "
    depends_on:
      - react-app
```

### 3단계: Docker 빌드 및 배포 스크립트
```bash
#!/bin/bash
# deploy-docker.sh

# Docker 이미지 빌드
docker build -t my-react-app .

# 컨테이너 실행하여 빌드 생성
docker run --rm -v $(pwd)/build:/app/build my-react-app npm run build

# S3에 배포
docker run --rm \
  -v $(pwd)/build:/build \
  -v ~/.aws:/root/.aws:ro \
  amazon/aws-cli:latest \
  s3 sync /build s3://my-react-app-bucket --delete

# CloudFront 캐시 무효화
docker run --rm \
  -v ~/.aws:/root/.aws:ro \
  amazon/aws-cli:latest \
  cloudfront create-invalidation --distribution-id E1234567890 --paths "/*"

# 배포 이력 기록
docker run --rm \
  -v ~/.aws:/root/.aws:ro \
  amazon/aws-cli:latest \
  dynamodb put-item \
  --table-name page-deployment-history \
  --item "{
    \"deploymentId\": {\"S\": \"deploy-$(date +%s)\"},
    \"timestamp\": {\"S\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"},
    \"method\": {\"S\": \"docker\"},
    \"version\": {\"S\": \"$(git rev-parse --short HEAD)\"}
  }"
```

---

## 방법 3: Git CI/CD 파이프라인 (GitHub Actions)

### 1단계: GitHub Actions 워크플로우 설정
```yaml
# .github/workflows/deploy.yml
name: Deploy React App to S3

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Build application
      run: npm run build
      env:
        CI: false
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ap-northeast-2
    
    - name: Deploy to S3
      run: |
        aws s3 sync build/ s3://${{ secrets.S3_BUCKET_NAME }} --delete
        aws s3 sync build/ s3://${{ secrets.S3_BUCKET_NAME }} --cache-control "max-age=31536000" --exclude "*.html"
        aws s3 sync build/ s3://${{ secrets.S3_BUCKET_NAME }} --cache-control "no-cache" --exclude "*" --include "*.html"
    
    - name: Invalidate CloudFront
      run: |
        aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
    
    - name: Record deployment
      run: |
        aws dynamodb put-item \
          --table-name page-deployment-history \
          --item '{
            "deploymentId": {"S": "deploy-${{ github.run_number }}"},
            "timestamp": {"S": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"},
            "method": {"S": "github-actions"},
            "version": {"S": "${{ github.sha }}"},
            "branch": {"S": "${{ github.ref_name }}"},
            "actor": {"S": "${{ github.actor }}"}
          }'
```

### 2단계: Docker 기반 CI/CD
```yaml
# .github/workflows/docker-deploy.yml
name: Docker Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Build Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        file: ./Dockerfile
        push: false
        tags: my-react-app:latest
        cache-from: type=gha
        cache-to: type=gha,mode=max
    
    - name: Extract build files
      run: |
        docker create --name temp-container my-react-app:latest
        docker cp temp-container:/usr/share/nginx/html ./build
        docker rm temp-container
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ap-northeast-2
    
    - name: Deploy to S3
      run: |
        aws s3 sync build/ s3://${{ secrets.S3_BUCKET_NAME }} --delete
        aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

---

## 최신 배포 방법들 (2025년 기준)

### 방법 4: AWS CDK (Infrastructure as Code)

AWS CDK를 사용한 현대적 배포 방식입니다.

#### 1단계: CDK 프로젝트 설정
```bash
# CDK 설치
npm install -g aws-cdk

# CDK 프로젝트 초기화
mkdir react-app-cdk
cd react-app-cdk
cdk init app --language typescript

# 필요한 라이브러리 설치
npm install @aws-cdk/aws-s3 @aws-cdk/aws-cloudfront @aws-cdk/aws-s3-deployment
```

#### 2단계: CDK 스택 구성
```typescript
// lib/react-app-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';

export class ReactAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 버킷 생성
    const bucket = new s3.Bucket(this, 'ReactAppBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // CloudFront 배포
    const distribution = new cloudfront.Distribution(this, 'ReactAppDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(30),
        },
      ],
    });

    // 빌드 파일 배포
    new s3deploy.BucketDeployment(this, 'DeployReactApp', {
      sources: [s3deploy.Source.asset('../build')],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // DynamoDB 테이블 (배포 이력)
    const deploymentTable = new dynamodb.Table(this, 'DeploymentHistory', {
      tableName: 'page-deployment-history',
      partitionKey: { name: 'deploymentId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // 출력
    new cdk.CfnOutput(this, 'BucketName', { value: bucket.bucketName });
    new cdk.CfnOutput(this, 'DistributionDomainName', { value: distribution.distributionDomainName });
    new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
  }
}
```

#### 3단계: CDK 배포
```bash
# CDK 부트스트랩 (최초 1회)
cdk bootstrap

# 스택 배포
cdk deploy

# React 앱 빌드 후 다시 배포
npm run build
cdk deploy
```

### 방법 5: AWS Amplify (최신 권장 방법)

AWS Amplify는 현재 가장 권장되는 배포 방법으로, 2025년에 새로운 개발자 도구 개선사항이 추가되었습니다.

#### 1단계: Amplify CLI 설치 및 초기화
```bash
# Amplify CLI 설치
npm install -g @aws-amplify/cli

# Amplify 설정
amplify configure

# 프로젝트 초기화
amplify init
```

#### 2단계: 호스팅 추가
```bash
# 호스팅 추가
amplify add hosting

# 배포
amplify publish
```

#### 3단계: GitHub 연동 자동 배포
```bash
# Git 연동 설정
amplify add hosting
# 선택: Amazon CloudFront and S3
# 선택: Continuous deployment (Git-based deployments)

# GitHub 저장소 연결 후 자동 배포 설정
amplify publish
```

### 방법 6: AWS SAM (Serverless Application Model)

#### 1단계: SAM 템플릿 작성
```yaml
# template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Parameters:
  BucketName:
    Type: String
    Default: my-react-app-sam-bucket

Resources:
  ReactAppBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Ref BucketName
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: error.html
      PublicAccessBlockConfiguration:
        BlockPublicAcls: false
        BlockPublicPolicy: false
        IgnorePublicAcls: false
        RestrictPublicBuckets: false

  BucketPolicy:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: !Ref ReactAppBucket
      PolicyDocument:
        Statement:
          - Effect: Allow
            Principal: '*'
            Action: 's3:GetObject'
            Resource: !Sub '${ReactAppBucket}/*'

  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - Id: S3Origin
            DomainName: !GetAtt ReactAppBucket.RegionalDomainName
            S3OriginConfig:
              OriginAccessIdentity: ''
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad
        Enabled: true
        CustomErrorResponses:
          - ErrorCode: 404
            ResponseCode: 200
            ResponsePagePath: /index.html

Outputs:
  BucketName:
    Value: !Ref ReactAppBucket
  DistributionDomainName:
    Value: !GetAtt CloudFrontDistribution.DomainName
  DistributionId:
    Value: !Ref CloudFrontDistribution
```

#### 2단계: SAM 배포
```bash
# SAM 빌드
sam build

# SAM 배포
sam deploy --guided

# React 앱 빌드 후 S3 동기화
npm run build
aws s3 sync build/ s3://my-react-app-sam-bucket --delete
```

### 방법 7: Terraform (Infrastructure as Code)

#### 1단계: Terraform 설정
```hcl
# main.tf
provider "aws" {
  region = "ap-northeast-2"
}

resource "aws_s3_bucket" "react_app" {
  bucket = "my-react-app-terraform-bucket"
}

resource "aws_s3_bucket_website_configuration" "react_app" {
  bucket = aws_s3_bucket.react_app.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "react_app" {
  bucket = aws_s3_bucket.react_app.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_cloudfront_distribution" "react_app" {
  origin {
    domain_name = aws_s3_bucket.react_app.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.react_app.bucket}"

    s3_origin_config {
      origin_access_identity = ""
    }
  }

  enabled = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.react_app.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

output "bucket_name" {
  value = aws_s3_bucket.react_app.bucket
}

output "distribution_domain_name" {
  value = aws_cloudfront_distribution.react_app.domain_name
}
```

#### 2단계: Terraform 배포
```bash
# Terraform 초기화
terraform init

# 배포 계획 확인
terraform plan

# 배포 실행
terraform apply

# React 앱 빌드 후 S3 업로드
npm run build
aws s3 sync build/ s3://$(terraform output -raw bucket_name) --delete
```

## 배포 방법 비교

| 방법 | 복잡도 | 유지보수성 | 자동화 | 비용 | 권장도 |
|------|--------|------------|--------|------|--------|
| 로컬 직접 배포 | 낮음 | 낮음 | 낮음 | 낮음 | ⭐⭐ |
| Docker | 중간 | 중간 | 중간 | 중간 | ⭐⭐⭐ |
| GitHub Actions | 중간 | 높음 | 높음 | 낮음 | ⭐⭐⭐⭐ |
| AWS CDK | 높음 | 높음 | 높음 | 중간 | ⭐⭐⭐⭐⭐ |
| AWS Amplify | 낮음 | 높음 | 높음 | 중간 | ⭐⭐⭐⭐⭐ |
| AWS SAM | 중간 | 높음 | 높음 | 낮음 | ⭐⭐⭐⭐ |
| Terraform | 높음 | 높음 | 높음 | 중간 | ⭐⭐⭐⭐ |

## 2025년 권장 사항

1. **신규 프로젝트**: AWS Amplify 사용 권장
2. **기존 인프라 통합**: AWS CDK 사용 권장
3. **간단한 배포**: GitHub Actions + S3 조합
4. **엔터프라이즈**: Terraform 또는 CDK 사용

각 방법은 프로젝트 규모, 팀 구성, 운영 요구사항에 따라 선택하시면 됩니다.