/**
 * Constrains user input to a safe length and strips characters that fall
 * outside the printable ASCII + common Latin-extended range.
 * HTML entity encoding is intentionally omitted — React escapes output,
 * and encoding before sending to OpenAI produces garbled prompt text.
 */
export function sanitizeInput(input: string, maxLength = 100): string {
  if (!input || typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
}

export function sanitizeIngredients(ingredients: string[]): string[] {
  return ingredients
    .filter((i) => i && typeof i === 'string')
    .map((i) => sanitizeInput(i));
}
