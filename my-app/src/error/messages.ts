
export type ErrorCode = 
  | "invalid_url"
  | "protocol_not_allowed" 
  | "localhost_forbidden"
  | "private_ip_forbidden"
  | "port_not_allowed"
  | "internal_error" 
  | "err"
  | "invalid_special_chars"
  | "spaces_not_allowed"
  | "bad_percent_encoding"

export const errorMessages: Record<ErrorCode, string> = {
  invalid_url: "L'URL n'est pas valide",
  protocol_not_allowed: "Seules les URLs http(s) sont autorisées",
  localhost_forbidden: "Les adresses localhost ne sont pas autorisées",
  private_ip_forbidden: "Les adresses IP privées ne sont pas autorisées",
  port_not_allowed: "Ce port n'est pas autorisé",
  internal_error: "",
  invalid_special_chars: "Les caracteres speciaux sont pas autorise",
  err: "",
  spaces_not_allowed: "Les espaces non encode ne sont pas autorise",
  bad_percent_encoding: "Encodage pas correcte"

};