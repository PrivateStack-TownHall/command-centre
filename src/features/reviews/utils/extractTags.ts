const KEYWORDS = [
  "aroma",
  "floral",
  "smooth",
  "bold",
  "bitter",
  "sweet",
  "rich",
  "fresh",
  "creamy",
  "strong",
  "balanced",
  "fruity",
  "nutty",
  "spicy",
  "mild",
  "crisp",
  "juicy",
  "tender",
  "delicious",
  "perfect",
  "amazing",
  "excellent",
  "friendly",
  "fast",
  "quality",
  "packaging",
  "value",
  "recommended",
];

/**
 * Extracts a handful of descriptive tags directly from a review's own
 * comment text (case-insensitive whole-word match). Returns [] when
 * nothing matches — no fabricated tags are ever shown.
 */
export function extractTags(comment: string, max = 3): string[] {
  if (!comment) return [];

  const lower = comment.toLowerCase();
  const found: string[] = [];

  for (const keyword of KEYWORDS) {
    if (found.length >= max) break;

    const regex = new RegExp(`\\b${keyword}\\b`, "i");

    if (regex.test(lower)) {
      found.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
    }
  }

  return found;
}
