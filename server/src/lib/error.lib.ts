export function createError(status: number, message: string) {
  let err: any = new Error(message);
  err.status = status;
  err.isOperational = true;
  return err;
}
