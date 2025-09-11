# Market Server

## Description
e-commerce 마켓서버 POC

### Based on

- [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
- [DDH](https://github.com/Sairyss/domain-driven-hexagon) DDH Introduction.

### Dependencies

- 데이터베이스 및 db클라이언트: Postgresql and [nestjs-typeorm](https://docs.nestjs.com/recipes/sql-typeorm)
- 데이터베이스 형상관리: [liquibase](https://www.liquibase.org/)

## 환경변수

### env example

```
NODE_ENV=
API_DOC_PATH=
PORT=
POSTGRES_URL=
UCC_WEB_URL=
ADMIN_WEB_URL=
JWT_ACCESS_SECRET=
AUTH_SERVER_ENDPOINT=
PAYMENT_SERVER_API_ENDPOINT=
PAYMENT_SERVER_API_KEY=
PAYMENT_SERVER_API_SECRET=
DOWNLOAD_LINK=
BASE_DIR_PATH=

+ Another connective server by gRPC
```

### 커밋 메세지 규칙

- [Conventional Commits](https://www.conventionalcommits.org/ko/v1.0.0/) 의 가이드라인을 따릅니다.

## Docker image build & Running the app on local

#### 1. Docker 이미지 빌드하기

Run `docker build -t market-server --file Dockerfile`

#### 2. docker-compose 실행하기

Run `docker-compose-up -d`

- Server URL: `localhost:3000`
- Server API Document: `localhost:3000/api/docs`
- Database(Postgresql) 접근정보 - Port: 5432 - USER: root - PW: root - Database: local
  > 정확한 환경구성은 docker-compose.yaml 파일을 참조

## 데이터베이스 형상관리

- `Liquibase` 를 사용합니다.
  - [공식문서](https://www.liquibase.org/)


## External 결제 서버

### Port One

- version 1 API 사용 [가이드 문서](https://developers.portone.io/docs/ko/auth/guide/readme?v=v1)
- (신)페이팔 - 카드 결제를 통해 결제
- 사전 설정
    - [관리자 콘솔](https://admin.portone.io/)
    - 테스트용 PG 추가
    - 설정 정보 
        - 가맹점 식별 코드는 클라이언트에 필요
        - REST API Key, REST API Secret 서버의 환경 변수 설정

| 관리 계정                | 관리자 | 가맹점 식별 코드 | 적용 날짜     |
|----------------------|-----|--------|-----------|
| thajun@naver.com     | 박태준 | imp41640175       | 24.07.31~ |

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e
```

## Lint
- TypeScript-ESLint 의 recommended rule 만 사용
- 수동 실행
  > $ yarn lint

## Convention
- 함수명과 변수명은 CamelCase 사용
    - ex) getContents(), toUser
- 인터페이스, 클래스, 타입은 PascalCase 사용
    - ex) GetContentsService, ThemeRepositoryPort
- 파일명은 KebabCase 사용
    - ex) get-contents.ts
- 테이블명은 SnakeCase 사용
    - ex) order_read_model