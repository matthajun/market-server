import { join } from 'path';

import { ClientOptions, Transport } from '@nestjs/microservices';

/**
 * admin-server에 토큰을 검증하기 위한 gRPC 옵션
 * @description Get gRPC client options
 *   package: grpc 통신할 때 사용할 proto 파일의 package 이름
 *   url: gRPC 서버의 주소 (웹서버와 다른 포트로 열어야 함)
 *   keepaliveTimeoutMs: gRPC 서버의 keepalive timeout = 서버 타임아웃 시간과 동일하게 설정
 *   protoPath: proto 파일의 경로
 *   keepCase: proto 파일의 camelCase를 유지할지 여부
 * @returns gRPC ClientOptions
 */
export function getVerifyNormalAdminTokenGrpcClientOptions(): ClientOptions {
  const ADMIN_SERVER_GRPC_ENDPOINT = process.env.ADMIN_SERVER_GRPC_ENDPOINT;

  if (!ADMIN_SERVER_GRPC_ENDPOINT) {
    throw new Error('ADMIN_SERVER_GRPC_ENDPOINT env required');
  }

  return {
    transport: Transport.GRPC,
    options: {
      package: 'normal_admin_token_verify_proto',
      url: ADMIN_SERVER_GRPC_ENDPOINT,
      protoPath: join(
        __dirname,
        '../util/grpc/proto/normal-admin-token-verify.proto',
      ),
      loader: { keepCase: true },
      keepalive: { keepaliveTimeoutMs: 61000 },
    },
  };
}

/**
 * media-management 서버에 미디어 상세정보 조회 요청
 * @description Get gRPC client options
 *   package: grpc 통신할 때 사용할 proto 파일의 package 이름
 *   url: gRPC 서버의 주소 (웹서버와 다른 포트로 열어야 함)
 *   keepaliveTimeoutMs: gRPC 서버의 keepalive timeout = 서버 타임아웃 시간과 동일하게 설정
 *   protoPath: proto 파일의 경로
 *   keepCase: proto 파일의 camelCase를 유지할지 여부
 * @returns gRPC ClientOptions
 */
export function getMediaDetailGrpcClientOption(): ClientOptions {
  const MEDIA_MANAGEMENT_SERVER_GRPC_ENDPOINT =
    process.env.MEDIA_MANAGEMENT_SERVER_GRPC_ENDPOINT;

  if (!MEDIA_MANAGEMENT_SERVER_GRPC_ENDPOINT) {
    throw new Error('MEDIA_MANAGEMENT_SERVER_GRPC_ENDPOINT env required');
  }

  return {
    transport: Transport.GRPC,
    options: {
      package: 'get_media_detail_proto',
      url: MEDIA_MANAGEMENT_SERVER_GRPC_ENDPOINT,
      protoPath: join(__dirname, '../util/grpc/proto/get_media_detail.proto'),
      loader: { keepCase: true },
      keepalive: { keepaliveTimeoutMs: 61000 },
    },
  };
}
