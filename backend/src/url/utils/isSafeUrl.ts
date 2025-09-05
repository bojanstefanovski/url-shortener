const allowedProtocol = ["https:", "http:"];
const allowedPorts = [443, 80];
const blockedLocalHostname = ["127.0.0.1", "localhost", "[::1]"];

export const isPrivateIpHost = (host: string) => {
  const privateIp = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!privateIp) return false;

  const [firstNumber, secondNumber] = privateIp.slice(1).map(Number);

  return (
    firstNumber === 10 ||
    (firstNumber === 172 && secondNumber >= 16 && secondNumber <= 31) ||
    (firstNumber === 192 && secondNumber === 168) ||
    firstNumber === 127 ||
    (firstNumber === 169 && secondNumber === 254)
  );
};

export const isSafeUrl = (
  longUrl: string
): { safe: boolean; reason?: string } => {
  let urlToCheck: URL;

  try {
    urlToCheck = new URL(longUrl);
  } catch {
    return { safe: false, reason: "invalid_url" };
  }

  if (!allowedProtocol.includes(urlToCheck.protocol)) {
    return { safe: false, reason: "protocol_forbidden" };
  }

  if (blockedLocalHostname.includes(urlToCheck.hostname)) {
    return { safe: false, reason: "localhost_forbidden" };
  }

  if (isPrivateIpHost(urlToCheck.hostname)) {
    return { safe: false, reason: "private_ip_forbidden" };
  }

  if (
    urlToCheck.port &&
    !allowedPorts.includes(parseInt(urlToCheck.port, 10))
  ) {
    return { safe: false, reason: "port_not_allowed" };
  }

  return { safe: true };
};