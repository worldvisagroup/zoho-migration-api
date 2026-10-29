/**
 * Interface representing normalized first and last names.
 */
export interface ExtractedNames {
  firstName: string;
  lastName: string;
}

/**
 * Capitalizes a single word by converting the first letter to uppercase and the rest to lowercase.
 *
 * @param word - Individual word string
 * @returns {string} Capitalized word
 */
export function capitalizeWord(word: string): string {
  if (!word) {
    return '';
  }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Capitalizes a name string properly (Title Case):
 * - Capitalizes each whitespace-delimited word.
 * - Handles hyphenated names (e.g. "mary-jane" -> "Mary-Jane").
 * - Handles apostrophe-containing names (e.g. "o'connor" -> "O'Connor").
 * - Trims unnecessary whitespace.
 *
 * @param name - Raw name string
 * @returns {string} Properly capitalized name
 */
export function capitalizeName(name?: string | null): string {
  if (!name || typeof name !== 'string') {
    return '';
  }
  const trimmed = name.trim();
  if (!trimmed) {
    return '';
  }

  return trimmed
    .split(/\s+/)
    .map(part => {
      // Handle hyphenated names
      if (part.includes('-')) {
        return part
          .split('-')
          .map(segment => capitalizeWord(segment))
          .join('-');
      }
      // Handle apostrophes
      if (part.includes("'")) {
        return part
          .split("'")
          .map(segment => capitalizeWord(segment))
          .join("'");
      }
      return capitalizeWord(part);
    })
    .join(' ');
}

/**
 * Extracts and normalizes first and last names according to Zoho migration rules:
 * 1. If `First_Name` is available and non-empty, use its trimmed, capitalized value.
 * 2. If `Last_Name` is available and non-empty, use its trimmed, capitalized value.
 * 3. If either name is missing, fall back to parsing `Full_Name`:
 *    - Split by whitespace into name components.
 *    - The last component is treated as the `lastName`.
 *    - All preceding components concatenated with spaces form the `firstName`.
 *    - For single-word full names (e.g. "madonna"), `lastName` receives the word, and `firstName` is empty.
 * 4. Capitalizes all names (e.g. "john doe" -> "John", "Doe"; "JANE" -> "Jane").
 * 5. Handles empty, missing, or whitespace-only inputs safely, returning empty strings.
 *
 * @param firstNameRaw - Raw First_Name field from Zoho
 * @param lastNameRaw - Raw Last_Name field from Zoho
 * @param fullNameRaw - Raw Full_Name field from Zoho
 * @returns {ExtractedNames} Object containing capitalized `firstName` and `lastName`
 */
export function extractNames(
  firstNameRaw?: string | null,
  lastNameRaw?: string | null,
  fullNameRaw?: string | null,
): ExtractedNames {
  const fName = typeof firstNameRaw === 'string' ? firstNameRaw.trim() : '';
  const lName = typeof lastNameRaw === 'string' ? lastNameRaw.trim() : '';
  const fullName = typeof fullNameRaw === 'string' ? fullNameRaw.trim() : '';

  let firstName = fName;
  let lastName = lName;

  if (!firstName || !lastName) {
    if (fullName) {
      const parts = fullName.split(/\s+/).filter(Boolean);
      if (parts.length > 0) {
        const extractedLast = parts[parts.length - 1] ?? '';
        const extractedFirst = parts.slice(0, parts.length - 1).join(' ');

        if (!firstName) {
          firstName = extractedFirst;
        }
        if (!lastName) {
          lastName = extractedLast;
        }
      }
    }
  }

  return {
    firstName: capitalizeName(firstName),
    lastName: capitalizeName(lastName),
  };
}
