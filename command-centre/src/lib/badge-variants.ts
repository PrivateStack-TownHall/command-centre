export const badgeVariants = {
  coffee: `
    bg-gradient-to-r
    from-[#8B5E3C]/15
    to-[#D6B98C]/25
    text-[#8B5E3C]
  `,

  restaurant: `
    bg-gradient-to-r
    from-[#7F1D1D]/15
    to-[#DC2626]/10
    text-[#7F1D1D]
  `,

  ecommerce: `
    bg-gradient-to-r
    from-[#22C55E]/15
    to-[#86EFAC]/25
    text-[#22C55E]
  `,

  burger: `
    bg-gradient-to-r
    from-[#DC2626]/15
    to-[#FCA5A5]/25
    text-[#DC2626]
  `,

  mart: `
    bg-gradient-to-r
    from-[#2563EB]/15
    to-[#93C5FD]/25
    text-[#2563EB]
  `,

  pineapple: `
    bg-gradient-to-r
    from-[#EAB308]/20
    to-[#FEF08A]/35
    text-[#A16207]
  `,

  employee: `
    bg-gradient-to-r
    from-[#4F46E5]/15
    to-[#A5B4FC]/25
    text-[#4F46E5]
  `,

  pink: `
    bg-gradient-to-r
    from-[#EC4899]/15
    to-[#F9A8D4]/25
    text-[#EC4899]
  `,

  medieval: `
    bg-gradient-to-r
    from-[#D6B98C]/25
    to-[#F3E7D1]/40
    text-[#8B7355]
  `,

  leather: `
    bg-gradient-to-r
    from-[#92400E]/15
    to-[#D6B98C]/25
    text-[#92400E]
  `,
} as const;

export type BadgeColor = keyof typeof badgeVariants;
