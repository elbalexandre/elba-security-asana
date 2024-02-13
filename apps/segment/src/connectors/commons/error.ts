type SegmentErrorOptions = { response?: Response; request?: Request };

export class SegmentError extends Error {
  statusCode?: number;
  response?: Response;
  request?: Request;

  constructor(
    message: string,
    statusCode?: number,
    { response, request }: SegmentErrorOptions = {}
  ) {
    super(message);
    this.statusCode = statusCode;
    this.response = response;
    this.request = request;
  }
}
