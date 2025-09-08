const allowedProtocol = ["https:", "http:"];
const allowedPorts = [443, 80];
const blockedLocalHostname = ["127.0.0.1", "localhost", "[::1]"];

export const isPrivateIpHost = (host: string): boolean => {
  // IPv4
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = ipv4.slice(1).map(Number);
    return (
      a === 10 ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a === 127 ||
      (a === 169 && b === 254)
    );
  }

  let v6 = host.replace(/^\[|\]$/g, "").toLowerCase();
  const pct = v6.indexOf("%");
  if (pct !== -1) v6 = v6.slice(0, pct);

  if (v6 === "::1") return true;
  if (/^(fc|fd)/i.test(v6)) return true;
  if (/^fe8/i.test(v6)) return true;

  return false;
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