export function parsePrimaryKey(primaryKeyParam: string) {
  return Object.fromEntries(
    new URLSearchParams(decodeURIComponent(primaryKeyParam)).entries()
  );
}
