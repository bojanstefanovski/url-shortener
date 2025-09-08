export type ErrorCode = 
  | "invalid_url"
  | "protocol_forbidden" 
  | "localhost_forbidden"
  | "private_ip_forbidden"
  | "port_not_allowed"
  | "internal_error" 
  | "err"
  | "invalid_special_chars"
  | "spaces_not_allowed"
  | "bad_percent_encoding"

export const errorMessages: Record<ErrorCode, string> = {
  invalid_url: "The URL is not valid",
  protocol_forbidden: "Only http(s) URLs are allowed",
  localhost_forbidden: "Localhost addresses are not allowed",
  private_ip_forbidden: "Private IP addresses are not allowed",
  port_not_allowed: "This port is not allowed",
  internal_error: "Internal server error",
  invalid_special_chars: "Special characters are not allowed",
  err: "Unexpected error",
  spaces_not_allowed: "Unencoded spaces are not allowed",
  bad_percent_encoding: "Incorrect percent encoding",
};