import normalizeUrl from "normalize-url";

export const canonicalizeUrl = (input: string): string => {
  return normalizeUrl(input, {
    stripHash: true,
    removeTrailingSlash: true, 
    sortQueryParameters: true,
    removeQueryParameters: [
      /^utm_\w+/i,
      "fbclid",
      "gclid",
      "mc_cid",
      "mc_eid"
    ],
  });
}