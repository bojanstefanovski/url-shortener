
export type ErrorCode =
  | "invalid_input"
  | "invalid_url"
  | "protocol_forbidden"
  | "invalid_chars"
  | "spaces_not_allowed"
  | "bad_percent_encoding"
  | "invalid_special_chars"
  | "localhost_forbidden"
  | "private_ip_forbidden"
  | "port_not_allowed"
  | "not_found"
  | "internal_error";

type AppErrorLike = { code: ErrorCode; statusCode: number };

export const makeErrorc = (code: ErrorCode, statusCode = 400): AppErrorLike => {
  return { code, statusCode };
}