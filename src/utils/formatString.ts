export function formatString(str: string) {
  return str.replace(/[^\w\s]/gi, "").replace(/\s/g, "");
}
