export function toTitleCase(value) {
  return String(value ?? "").replace(/(^|\s|-)\S/g, (letter) => letter.toUpperCase());
}
