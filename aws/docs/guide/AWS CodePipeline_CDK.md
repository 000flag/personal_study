## 1. WS CodePipeline, AWS CDK, AWS Amplify 자동화 배포 과정

### AWS CodePipeline \& CDK

- **Source 단계:** GitHub, CodeCommit 등 저장소에 푸시 발생 시 파이프라인 트리거
- **Build 단계:** CodeBuild 등으로 빌드(`npm install`, `npm run build`), 산출물(S3에 정적 파일)
- **Deploy 단계:** 빌드 결과물을 S3에 업로드, 필요 시 CloudFront 캐시 무효화
- **Infra as Code:** AWS CDK로 S3, CloudFront, IAM, CodeBuild, CodePipeline 등 인프라 코드 관리
- **배포 기록:** 각 단계에 CloudWatch Event 또는 Lambda로 이력 기록(DB 연동 등)
- **롤백 및 브랜치 전략:** 스테이지별 환경 구분, S3 버전 관리

> 참고: CDK CLI로 `cdk deploy` 명령어 자동화 가능[^3_1][^3_2][^3_3][^3_4].

### AWS Amplify

- **리포지토리 연동:** Amplify Console에서 GitHub 등 연결
- **자동 빌드/배포:** 커밋/푸시마다 빌드(`amplify.yml`), S3 \& CloudFront에 자동 배포
- **환경 분리:** 브랜치별 스테이징, 프로덕션 등 구분 가능
- **동적 배포 이력/롤백:** Amplify 콘솔에서 UI 기반 관리
- **도메인, SSL, 환경변수, Web Application Firewall(WAF) 등 설정**
- **추가 통합:** CodePipeline/Custom CI, S3 ZIP 배포 조합도 가능[^3_5][^3_6][^3_7][^3_8].


## 2. 고려해야 할 핵심 구성 요소

- **소스 관리:** Git 기반(주로 GitHub, CodeCommit)
- **빌드 환경:** CodeBuild(Docker 이미지 사용 가능) 또는 Amplify 자동화 빌드
- **S3 버킷 구성:** 정적 웹 호스팅 비활성화, 버킷 owner enforced, 버전 관리
- **CloudFront 배포:** S3를 오리진으로, 캐시 및 HTTPS/도메인 관리
- **IAM/권한:** Least privilege 원칙으로 IAM 역할 세분화
- **이력 관리:** 각 배포 후 결과, 메타데이터 기록용 DB 또는 로그(S3, DynamoDB, RDS 등)
- **알람/모니터링:** CloudWatch Logs/EventBridge, SNS 알림 설정
- **롤백 전략:** S3 버전 관리, Amplify 롤백 기능, 파이프라인 단계 실패시 자동 알림
- **비용/스케일 고려:** 사용량/트래픽 예측 후 설계


## 3. S3와 CloudFront 연동 시 캐시 정책 \& 보안 강화 구체적 설정

### 캐시 정책 (CloudFront \& S3)

- **Cache-Control 헤더 활용:**
    - S3 오브젝트 업로드 시
`Cache-Control: max-age=31536000, public` (변경 없음이 보장된 파일)
`Cache-Control: max-age=300, public` (자주 변경되는 파일)
- **CloudFront 캐시 정책 설정:**
    - TTL(Time-to-Live) 조정:
        - 최소 TTL: 0~60초, 최대 TTL: 1년까지 개별 설정
        - 정적 리소스는 최대한 길게, index.html 등 진입점은 짧게
    - 경로별 캐시 정책 차등 적용: `/static/`은 장기, `/index.html`은 단기
- **CloudFront Invalidation:**
    - 새로 배포 후 모든 리소스(`/*`) 혹은 핵심 파일만 무효화 작업 필수[^3_9][^3_10][^3_11][^3_12].


### 보안 강화

- **CloudFront Origin Access Control (OAC)/OAI 적용:**
    - S3 퍼블릭 접근 차단
    - CloudFront에서만 S3 접근 허용(OAC 권장, 최신 보안 표준)
    - 버킷 정책에 CloudFront만 오리진으로 명시
- **HTTPS 강제:**
    - CloudFront 뷰어 프로토콜을 HTTPS Only/Redirect로 설정
- **S3 버킷 옵션:**
    - `ACLs Disabled` 및 `Block All Public Access` 활성화
    - Object Ownership: Bucket Owner Enforced
- **WAF(Web Application Firewall):**
    - CloudFront WAF 연동해 OWASP 룰 셋 적용
- **접근로그:**
    - S3, CloudFront 모두 액세스 로그 활성화 후 지정 버킷에 저장[^3_13][^3_14][^3_15][^3_16].


## 4. 자동화 배포 과정 비용

| 서비스 | 비용 구조(2025년 7월 기준) | 비고 |
| :-- | :-- | :-- |
| **CodePipeline** | 파이프라인 1개당 월 \$1.00 | 30일 이상 활성\&사용시 부과[^3_17] |
| **CodeBuild** | 빌드분당 \$0.01(표준), \$0.025(대형) 등 | 1,000분/월 무료티어 |
| **Amplify(호스팅)** | 5GB CDN 저장공간 무료, 이후 GB당 \$0.023 | 12개월 무료, 배포 1,000분 무료 |
| **Amplify(빌드\&배포)** | 빌드 1,000분 무료, 이후 분당 \$0.01 | 대형 인스턴스, SSR 등은 별도 요금 |
| **CloudFront** | GB당 \$0.085~0.12(지역·데이터 전송량별 차등) | WAF 월 \$15 + 룰별 추가 요금 |
| **S3** | GB당 \$0.023(표준) | PUT 등 API 트랜잭션 소액 부과 |
| **Domain, SSL** | Route53/외부 기준 \$12~/연, SSL 무료 |  |

- 수동 관리 EC2 대비 훨씬 저비용, 실제 청구는 트래픽/빈도/저장량 측면에서 증감.
- Amplify 기본 사용시 도메인·SSL·WAF까지 통합 관리, 비용 예상·통제 용이[^3_18][^3_19][^3_17].


## 결론

- **완전 자동화** 배포 가능(코드 커밋 → S3 업로드 → CloudFront Cache 무효화 → 안전\&최신 서비스)
- **캐시 정책**: 정적 파일과 진입점 파일별로 TTL 구분, Cache-Control 헤더 적극 활용, CloudFront Invalidation 필수
- **보안**: S3 퍼블릭 접근 차단 + OAC, CloudFront HTTPS, WAF 등 필수 적용
- **비용**: 무료티어 활용 시 소규모는 월 \$1-10대, 고트래픽/대용량은 추가 비용 발생

프로젝트와 팀 사정에 맞춰 CodePipeline+CDK 또는 Amplify를 선택하고, 캐시 및 보안 설계를 꼼꼼히 적용하세요.

<div style="text-align: center">⁂</div>

[^3_1]: https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/set-up-a-ci-cd-pipeline-by-using-aws-codepipeline-and-aws-cdk.html

[^3_2]: https://docs.aws.amazon.com/ko_kr/prescriptive-guidance/latest/patterns/set-up-a-ci-cd-pipeline-by-using-aws-codepipeline-and-aws-cdk.html

[^3_3]: https://docs.aws.amazon.com/cdk/v2/guide/deploy.html

[^3_4]: https://faun.pub/deploy-your-static-web-app-to-s3-using-aws-codepipeline-cdk-3ad0808ee1b3

[^3_5]: https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/custom-pipelines/

[^3_6]: https://repost.aws/questions/QUwEJrZuRqRvSwjgmz2Oq8MQ/aws-amplify-deployment-automation

[^3_7]: https://github.com/aws/aws-cdk/issues/16208

[^3_8]: https://www.linkedin.com/pulse/cicd-pipeline-scalable-web-app-using-aws-amplify-jegede-oluwatosin-0ha3f

[^3_9]: https://docs.aws.amazon.com/whitepapers/latest/build-static-websites-aws/controlling-how-long-amazon-s3-content-is-cached-by-amazon-cloudfront.html

[^3_10]: https://www.reddit.com/r/aws/comments/15za8sy/how_to_find_ideal_caching_policy_for_cloudfront/

[^3_11]: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-cache-policies.html

[^3_12]: https://www.linkedin.com/pulse/performance-enhancement-aws-cloudfront-caching-best-practices-soares-rkdcf

[^3_13]: https://aws.plainenglish.io/preventing-unauthorized-access-to-your-s3-buckets-using-cloudfront-oai-c019490aae81

[^3_14]: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html

[^3_15]: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/SecurityAndPrivateContent.html

[^3_16]: https://repost.aws/knowledge-center/cloudfront-access-to-amazon-s3

[^3_17]: https://aws.amazon.com/codepipeline/pricing/

[^3_18]: https://aws.amazon.com/amplify/pricing/

[^3_19]: https://stackoverflow.com/questions/63416420/are-there-any-disadvantages-to-using-aws-amplify-to-host-spas-compared-to-codepi

[^3_20]: https://octopus.com/devops/cloud-deployment/aws-deployments/