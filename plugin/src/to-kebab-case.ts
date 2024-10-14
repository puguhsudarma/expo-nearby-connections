/**
 * Converts a camelCase string to a kebab-case string.
 *
 * @param str The string to convert.
 * @returns The converted string.
 *
 * @example
 * toKebabCase("camelCase") // returns "camel-case"
 * toKebabCase("CamelCase") // returns "camel-case"
 * toKebabCase("camel_Case") // returns "camel-case"
 * toKebabCase("camel Case") // returns "camel-case"
 * toKebabCase("camel-Case") // returns "camel-case"
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space between camelCase words
    .replace(/[\s_]+/g, "-") // Replace spaces or underscores with hyphens
    .replace(/[^a-zA-Z0-9-]/g, "") // Remove non-alphanumeric characters except hyphen
    .toLowerCase(); // Convert to lowercase
}
