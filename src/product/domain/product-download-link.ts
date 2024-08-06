export class ProductDownloadLink {
  constructor(readonly downloadLink: string) {}

  /**
   * 상품 다운로드 링크 생성
   * @param mediaId
   * @returns
   */
  static create(mediaId: string): ProductDownloadLink {
    const downloadLink =
      process.env.DOWNLOAD_LINK + mediaId + '?size=original&fileType=model';

    return new ProductDownloadLink(downloadLink);
  }
}
