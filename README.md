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

[liquibase](https://www.liquibase.org/)를 사용합니다.

### 스키마 변경 작업 방법

#### 1. `.sql`파일 작성

- 저장경로: `migrations/liquibase/changelog/<my-diff>.sql`

_Example_: `migrations/liquibase/changelog/create-item.sql`

```sql
--liquibase formatted sql
--changeset jasper.park:1
CREATE SEQUENCE IF NOT EXISTS id_seq;

--changeset jasper.park:2
CREATE TABLE "public"."item" (
    "id" varchar NOT NULL DEFAULT nextval('id_seq'::regclass),
    "name" varchar NOT NULL,
    "createdAt" timestamp DEFAULT now(),
    "updatedAt" timestamp DEFAULT now(),
    "deletedAt" timestamp,
    PRIMARY KEY ("id")
);

--changeset jasper.park:3
COMMENT ON COLUMN "public"."item"."id" IS '아이템 ID';
COMMENT ON COLUMN "public"."item"."name" IS '아이템 이름';
COMMENT ON COLUMN "public"."item"."createdAt" IS '생성일시';
COMMENT ON COLUMN "public"."item"."updatedAt" IS '수정일시';
COMMENT ON COLUMN "public"."item"."deletedAt" IS '삭제일시';
```

#### 2. changelog에 sql 추가

> `migrations/liquibase/changelog/changelog.xml` 에 `.sql` 추가

마이그레이션은 `changelog.xml` 파일 내용 내의 `<include file={파일명}/>` 순서대로 실행됩니다.

_변경전 changelog.xml_

```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
   xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xmlns:pro="http://www.liquibase.org/xml/ns/pro"
   xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
      http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.1.xsd
      http://www.liquibase.org/xml/ns/pro
      http://www.liquibase.org/xml/ns/pro/liquibase-pro-4.1.xsd">

    <!-- more <include> tags go here -->
</databaseChangeLog>
```

_변경후 changelog.xml_

```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog
   xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xmlns:pro="http://www.liquibase.org/xml/ns/pro"
   xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
      http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.1.xsd
      http://www.liquibase.org/xml/ns/pro
      http://www.liquibase.org/xml/ns/pro/liquibase-pro-4.1.xsd">

    <include file="create-item.sql"/>
    <!-- more <include> tags go here -->
</databaseChangeLog>
```

#### 3. migration 실행

Run `liquibase --defaults-file=migrations/liquibase/changelog/liquibase.properties update`

_실행결과 성공예시_

```sh
2023-05-16 17:04:50 ####################################################
2023-05-16 17:04:50 ##   _     _             _ _                      ##
2023-05-16 17:04:50 ##  | |   (_)           (_) |                     ##
2023-05-16 17:04:50 ##  | |    _  __ _ _   _ _| |__   __ _ ___  ___   ##
2023-05-16 17:04:50 ##  | |   | |/ _` | | | | | '_ \ / _` / __|/ _ \  ##
2023-05-16 17:04:50 ##  | |___| | (_| | |_| | | |_) | (_| \__ \  __/  ##
2023-05-16 17:04:50 ##  \_____/_|\__, |\__,_|_|_.__/ \__,_|___/\___|  ##
2023-05-16 17:04:50 ##              | |                               ##
2023-05-16 17:04:50 ##              |_|                               ##
2023-05-16 17:04:50 ##                                                ##
2023-05-16 17:04:50 ##  Get documentation at docs.liquibase.com       ##
2023-05-16 17:04:50 ##  Get certified courses at learn.liquibase.com  ##
2023-05-16 17:04:50 ##                                                ##
2023-05-16 17:04:50 ####################################################
2023-05-16 17:04:50 Starting Liquibase at 08:04:50 (version 4.22.0 #9559 built at 2023-05-10 20:45+0000)
2023-05-16 17:04:50 Liquibase Version: 4.22.0
2023-05-16 17:04:50 Liquibase Open Source 4.22.0 by Liquibase
2023-05-16 17:04:51 Running Changeset: create-item.sql::1::jasper.park
2023-05-16 17:04:51 Running Changeset: create-item.sql::2::jasper.park
2023-05-16 17:04:51 Running Changeset: create-item.sql::3::jasper.park
2023-05-16 17:04:51
2023-05-16 17:04:51 UPDATE SUMMARY
2023-05-16 17:04:51 Run:                          3
2023-05-16 17:04:51 Previously run:               0
2023-05-16 17:04:51 Filtered out:                 0
2023-05-16 17:04:51 -------------------------------
2023-05-16 17:04:51 Total change sets:            3
2023-05-16 17:04:51
2023-05-16 17:04:51 Liquibase: Update has been successful.
2023-05-16 17:04:51 Liquibase command 'update' was executed successfully.
```

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

# test coverage
$ pnpm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
