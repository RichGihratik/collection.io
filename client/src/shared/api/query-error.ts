type QueryErrorBody = {
  message: string;
  messageCode: string;
};

export class QueryError extends Error {
  messageCode: string;

  constructor(body: QueryErrorBody) {
    super(body.message);
    this.messageCode = body.messageCode;
  }
}
