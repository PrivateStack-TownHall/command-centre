const KEYWORDS = [
  // Food & drink — Kings Brew, Castle Kitchen, Byte Burger
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
  "savory",
  "flavorful",
  "cheesy",
  "crispy",
  "filling",
  "hot",
  "warm",

  // Retail & tech — Trade Hub, Quantum Mart, WareTrack
  "durable",
  "reliable",
  "sturdy",
  "functional",
  "innovative",
  "responsive",
  "efficient",
  "accurate",
  "affordable",
  "lightweight",
  "compact",
  "powerful",
  "seamless",
  "authentic",
  "genuine",

  // Hospitality & travel — Medieval Airbnb, Nomad
  "cozy",
  "spacious",
  "clean",
  "comfortable",
  "charming",
  "scenic",
  "relaxing",
  "peaceful",
  "convenient",
  "quiet",
  "stunning",
  "memorable",

  // Media, community & HR — Codigram, Pineapple Stack, M-ployee
  "creative",
  "vibrant",
  "inspiring",
  "helpful",
  "informative",
  "engaging",
  "insightful",
  "professional",
  "supportive",
  "organized",

  // Library — Leather Shelf
  "captivating",
  "gripping",
  "thoughtful",
  "well-written",

  // General sentiment — applies across every app
  "delicious",
  "perfect",
  "amazing",
  "excellent",
  "friendly",
  "fast",
  "slow",
  "quality",
  "packaging",
  "value",
  "recommended",
  "disappointing",
  "poor",
  "worth",
  "easy",
  "beautiful",
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
