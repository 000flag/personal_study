# AWS S3 + CloudFront React 배포 시 403 에러 해결 과정

## 상황 설명

AWS S3와 CloudFront를 사용해서 React + TypeScript + Vite 프로젝트를 배포하는 과정에서 발생한 문제와 해결 과정을 정리해보겠습니다.

### 배포 환경 설정
1. **S3 버킷 퍼블릭 액세스 설정**
   - 퍼블릭 액세스 차단을 해제하고 버킷 정책을 설정했습니다.
   
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

2. **배포 과정**
   - React + TypeScript + Vite 프로젝트를 `npm run build`로 빌드
   - `aws s3 sync ./dist s3://your-bucket-name --delete` 명령어로 S3에 업로드
   - CloudFront 캐시 무효화: `aws cloudfront create-invalidation --distribution-id YOUR_CLOUDFRONT_DISTRIBUTION_ID --paths "/*"`

## 문제 발생 과정

### 첫 번째 배포 (성공)
- 위의 과정대로 배포했을 때 브라우저에서 정상적으로 로드되었습니다.

### 두 번째 배포 (문제 발생)
- 프로젝트 파일을 수정한 후 동일한 배포 과정을 거쳤습니다.
- 브라우저에서 접속하니 **403 Forbidden 에러**가 발생했습니다.
- 특히 `src="/assets/{react+ts}.js"` 같은 assets 파일들에서 에러가 발생했습니다.

### 문제 해결 시도
1. S3 정책과 권한을 다시 확인했지만 문제가 없었습니다.
2. 여러 `index.html`과 `test.js` 파일을 만들어서 assets 접근 가능 여부를 테스트했습니다.
3. 이 과정에서 **상대경로에 문제가 있다는 것**을 발견했습니다.

### 최종 해결
- `vite.config.ts`에 `base: "./"`를 추가해서 `src="./assets/{react+ts}.js"`로 상대경로를 사용하도록 설정했습니다.
- 다시 빌드하고 배포하니 403 에러 없이 정상적으로 작동했습니다.

## 문제 요약

처음 빌드하여 배포했을 때는 정상적으로 로드되었지만, 이후 프로젝트 파일을 수정하고 동일한 방식으로 다시 배포하자 **403 Forbidden 오류**가 발생하였습니다.  
S3 버킷 정책 및 객체 권한을 모두 재확인하고 조정했음에도 문제가 해결되지 않았고, 여러 테스트를 통해 **상대경로 문제일 가능성**을 확인하였습니다.

이에 `vite.config.ts` 파일에 `base: "./"` 옵션을 추가한 후 다시 빌드하고 배포한 결과, 정상적으로 로드되었습니다.

해당 현상의 원인을 명확히 이해하고 유사 사례를 방지하기 위해 아래와 같이 문제 발생 배경과 해결 과정을 정리하였습니다.

## 문제 원인 분석

### 핵심 원인
이 문제는 **Vite의 asset 경로 설정과 S3/CloudFront 경로 매핑의 불일치** 때문에 발생한 현상입니다. 정책이나 권한 문제가 아니었습니다.

### Vite의 base 옵션 동작 방식
- **`base: "/"`** (기본값): `/assets/...`로 빌드됩니다. 즉, 루트 기준 절대경로로 참조합니다.
- **`base: "./"`**: 상대경로로 참조(`./assets/...`)합니다.

### 첫 번째와 두 번째 배포의 차이점
1. **첫 번째 배포**에서는 기본값(`/`)을 사용했고, S3+CloudFront 환경에서 우연히 잘 동작했습니다.
2. **두 번째 배포**에서는 동일한 설정이었는데도 403 Forbidden이 발생했습니다.

### 실제 문제의 근본 원인
React+Vite 빌드 결과의 JS/CSS 등 정적 파일들이 `/assets/~`와 같은 **절대경로**로 참조되어 있었습니다.

- S3 버킷에는 `index.html`, `assets/main.xxx.js` 등으로 파일이 정상적으로 있었습니다.
- 하지만 CloudFront로 URL 접근 시 **경로 매핑이 맞지 않거나 S3 버킷 루트 설정이 달라져서** 실제로 `/assets/~` URL로 object를 찾지 못했습니다.
- 결과적으로 S3에서 403 Forbidden이 발생했습니다.

### 예시 상황
- 배포 후 S3의 `your-bucket-name/index.html`이 `src="/assets/main.1234.js"`로 JS를 로드한다고 가정합니다.
- 실제로 S3 버킷에는 `assets/main.1234.js`가 있어야 하며, CloudFront가 S3 버킷 루트와 올바르게 연결되어 있어야 `/assets/main.1234.js` URL 요청이 S3의 해당 파일을 제대로 반환합니다.
- 하지만 CloudFront의 path, S3 버킷 폴더, custom error routing, 리디렉션 규칙 등의 미묘한 변경으로 인해 `/assets/main.1234.js`에 대한 요청이 S3의 실제 파일로 제대로 라우팅되지 않을 수 있습니다.

### base: "./"로 해결되는 이유
- `base: "./"`로 설정하면 Vite가 모든 정적 asset을 상대경로(`./assets/~~`)로 index.html에서 참조하게 빌드합니다.
- 상대경로이기 때문에 어떤 경로로 로드하든 index.html이 있는 곳에서 상대 위치의 assets를 항상 찾을 수 있습니다.
- S3/CloudFront 라우팅이나 path re-mapping의 영향도 받지 않습니다.

## 결론

**첫 번째 배포에서는 경로 설정과 CloudFront, S3의 root path가 우연히 잘 맞아서** 문제가 드러나지 않았습니다.

**두 번째 배포에서는 S3 경로 구조나 CloudFront path 설정이 미묘하게 달라졌거나, 캐시/라우팅에 따라 `/assets/` 절대경로 자원이 제대로 노출되지 않아 403 Forbidden**이 발생했습니다.

**`base: "./"`는 상대경로라서 root path에 영향을 받지 않아 안정적으로 동작**합니다.

## 현업 배포 팁

1. S3+CloudFront 조합에서 "최상위(/)"가 항상 S3 버킷의 최상위(root)에 일치하는지, 혹시 Prefix나 custom origin path를 사용하는지 확인이 필요합니다.

2. **정적 웹사이트 호스팅 옵션이 off인 경우**에는 경로 및 index/error document 핸들링에 더 주의해야 합니다.

3. 일반적으로 SPA 배포에서 `base: "/"`로 배포하는 것이 표준이지만, CloudFront/S3 라우팅 문제가 있을 때는 `base: "./"`도 효과적인 우회책이 될 수 있습니다.

정리하자면, 이 문제는 "정책/권한" 문제가 아니라 **Vite의 asset 경로 설정과 S3/CloudFront 경로 매핑의 불일치** 때문에 발생한 현상이었습니다. `base: "./"`로 상대 경로 대응을 해서 해결된 것입니다.

## 추가로 고려해야 할 사항들

### 1. 캐시 무효화의 한계
CloudFront 캐시 무효화(`create-invalidation`)를 했음에도 문제가 해결되지 않았다는 점이 중요합니다. 이는 **브라우저 캐시나 DNS 캐시**도 영향을 줄 수 있음을 의미합니다. 

- 브라우저의 하드 리프레시 (Ctrl+F5 또는 Cmd+Shift+R)를 시도해보시길 권장합니다.
- 또는 시크릿 모드(incognito)에서 테스트해보시는 것도 좋습니다.

### 2. CloudFront 설정 확인 포인트
첫 번째와 두 번째 배포 사이에 무엇이 달라졌는지 더 구체적으로 확인해보시면 좋겠습니다:

- **Origin Path 설정**: CloudFront에서 S3 Origin에 특별한 prefix path를 설정했는지 확인
- **Behavior 설정**: Path Pattern이 `/*`로 되어 있는지, `Default Root Object`가 `index.html`로 설정되어 있는지 확인
- **Error Pages 설정**: 404나 403 에러에 대한 custom error response가 설정되어 있는지 확인

### 3. S3 정적 웹사이트 호스팅 vs REST API 엔드포인트
S3에는 두 가지 접근 방식이 있습니다:

1. **정적 웹사이트 호스팅 엔드포인트**: `http://bucket-name.s3-website-region.amazonaws.com`
2. **REST API 엔드포인트**: `https://bucket-name.s3.region.amazonaws.com`

CloudFront의 Origin으로 어떤 것을 사용하고 있는지에 따라 경로 처리 방식이 달라질 수 있습니다. 정적 웹사이트 호스팅을 사용하면 index.html 자동 라우팅이나 404 처리가 다르게 동작합니다.

### 4. 디버깅을 위한 실용적인 팁

문제 발생 시 다음과 같이 단계별로 확인해보시면 원인을 더 명확히 파악할 수 있습니다:

1. **S3에서 직접 접근**: CloudFront 없이 S3 URL로 직접 접근해서 파일이 제대로 있는지 확인
2. **개발자 도구 Network 탭**: 정확히 어떤 URL로 요청이 가고 있는지, 응답 코드와 헤더는 무엇인지 확인
3. **CloudFront 로그 활성화**: 실제 CloudFront에서 어떤 요청을 받고 있는지 로그로 확인

### 5. vite.config.ts 권장 설정

앞으로 S3 + CloudFront 배포를 위한 안정적인 Vite 설정을 제안드립니다:

```typescript
// vite.config.ts
export default defineConfig({
  base: "./", // 상대경로 사용으로 경로 문제 방지
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // 프로덕션에서는 소스맵 비활성화
  },
  // SPA 라우팅을 위한 설정 (필요한 경우)
  server: {
    historyApiFallback: true
  }
})
```

### 6. 향후 배포 시 체크리스트

매번 안정적인 배포를 위해 다음 순서를 권장드립니다:

1. `npm run build`로 빌드
2. `dist` 폴더 내용 확인 (index.html에서 asset 경로가 상대경로인지 확인)
3. `aws s3 sync ./dist s3://bucket-name --delete`로 업로드
4. CloudFront 캐시 무효화
5. 브라우저 하드 리프레시로 테스트

이렇게 하시면 비슷한 문제를 미연에 방지할 수 있을 것입니다.