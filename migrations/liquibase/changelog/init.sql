--liquibase formatted sql
--changeset ralph.park:product
create table if not exists product
(
    id          varchar                                not null
        constraint product_pk
            primary key,
    "mediaId"               varchar                                not null,
    "userId"                varchar                                not null,
    "name"                  varchar                                not null,
    -- price 의 화폐 단위는 달러($)이고 소수점 3번째자리에서 반올림하여 저장하므로 numeric(10,2) 로 정의
    "price"                 numeric(10,2)                          not null,
    "sellerThumbnailImageId"  varchar                                not null,
    "createdAt"             timestamp with time zone default now() not null,
    "updatedAt"             timestamp with time zone,
    "deletedAt"             timestamp with time zone
);

--changeset jasper:event
create table if not exists event
(
    id            varchar not null
        constraint event_pk
            primary key,
    type          varchar,
    position      integer,
    payload       json,
    "createdAt"   timestamp with time zone default now(),
    "aggregateId" varchar
);

create unique index if not exists event_aggregateid_position_uindex
    on event ("aggregateId", position);

--changeset jasper:create_fn_notify_event_insert endDelimiter:$$
CREATE OR REPLACE FUNCTION notify_event_insert()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('event_channel', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--changeset jasper:create_trigger_insert_event
CREATE OR REPLACE TRIGGER insert_event
    AFTER INSERT
    ON EVENT
    FOR EACH ROW
EXECUTE PROCEDURE notify_event_insert();

--changeset jasper:cart_read_model
create table if not exists cart_read_model
(
    id      varchar not null
        constraint cart_read_model_pk
            primary key,
    content json
);

--changeset dori:create_table_if_not_exists_order_history_read_model
DROP TYPE IF EXISTS "public"."order_status_enum";
CREATE TYPE "public"."order_status_enum" AS ENUM ('created', 'success', 'timeout');

create table if not exists order_history_read_model
(
    id          varchar not null
        constraint order_history_read_model_pk
            primary key,
    "userId"    varchar not null,
    "orderId"    varchar not null,
    "status" "public"."order_status_enum" NOT NULL,
    content     json,
    "createdAt" timestamp with time zone default now() not null,
    UNIQUE("orderId", "status")
);

create index if not exists order_history_read_model_userid_index
    on order_history_read_model ("userId");

--changeset ralph:create_table_if_not_exists_product_comment
create table if not exists product_comment
(
    id          varchar                                not null
                constraint product_comment_pk          primary key,
    "userId"                    varchar                                not null,
    "productId"                 varchar                                not null,
    content                     varchar(1000)                          not null,
    "authorProfileImageMediaId" varchar                                not null,
    "createdAt"                 timestamp with time zone default now() not null,
    "updatedAt"                 timestamp with time zone
);

create index if not exists "product_comment_productId_index"
    on product_comment ("productId");

--changeset ralph:create_table_if_not_exists_seller
create table if not exists seller
(
    id          varchar                                not null
                constraint seller_pk          primary key,
    "firstName"                 varchar                                 not null,
    "lastName"                  varchar                                 not null,
    status                      varchar                                 not null,
    "createdAt"                 timestamp with time zone default now()  not null,
    "updatedAt"                 timestamp with time zone
);

--changeset ralph:create_table_planning_event
create table if not exists planning_event
(
    id          varchar                                not null
                constraint planning_event_pk          primary key,
    title                       varchar                                 not null,
    description                 varchar,
    link                        varchar,
    "startDate"                 date                                    not null,
    "endDate"                   date                                    not null,
    "imageMediaId"              varchar,
    "createdAt"                 timestamp with time zone default now()  not null,
    "updatedAt"                 timestamp with time zone,
    "deletedAt"                 timestamp with time zone
);

--changeset ralph:create_table_product_review
create table if not exists product_review
(
    id          varchar                                not null
                constraint product_review_pk          primary key,
    "userId"                    varchar                                 not null,
    "productId"                 varchar                                 not null,
    content                     varchar(1000)                           not null,
    -- starRating 은 1.0 에서 5.0 사이의 값이고 0.5 단위로 증가하여 numeric(2,1) 로 정의
    "starRating"                numeric(2,1)                            not null,
    "authorProfileImageMediaId" varchar                                 not null,
    "createdAt"                 timestamp with time zone default now()  not null,
    UNIQUE("productId", "userId")
);

--changeset ralph:create_table_product_view
create table if not exists product_view
(
    id          varchar                                not null
                constraint product_view_pk          primary key,
   "productId"                 varchar                                not null,
   "userId"                    varchar                                not null,
   "createdAt"                 timestamp with time zone default now() not null
);

create index if not exists "product_view_productId_userId_index"
    on product_view ("productId", "userId");

--changeset ralph:create_table_product_like
create table if not exists product_like
(
    id          varchar                                not null
                constraint product_like_pk          primary key,
    "productId"                 varchar                                 not null,
    "userId"                    varchar                                 not null,
    status                      varchar                                 not null,
    "createdAt"                 timestamp with time zone default now()  not null,
    "updatedAt"                 timestamp with time zone,
    UNIQUE("productId", "userId")
);

--changeset ralph:sales_history_read_model
create table if not exists sales_history_read_model
(
    id          varchar                                 not null
                constraint sales_history_read_model_pk  primary key,
    "sellerId"                  varchar                 not null,
    price                       numeric(10,2)           not null,
    content                     json                    not null,
    "createdAt" timestamp with time zone default now()
);

create index if not exists "sales_history_read_model_sellerId_index"
    on sales_history_read_model ("sellerId");

--changeset ralph:create_table_product_download_history
create table if not exists product_download_history
(
    id          varchar                                not null
                constraint product_download_history_pk primary key,
    "userId"                    varchar                                 not null,
    "productId"                 varchar                                 not null,
    "createdAt"                 timestamp with time zone default now()
);

create index if not exists "product_download_history_productId_index"
    on product_download_history ("productId");
