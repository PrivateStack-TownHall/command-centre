import type { ReactNode } from "react";

interface DetailPanelSectionProps {
  title: string;
  children: ReactNode;
}

function DetailPanelSection({ title, children }: DetailPanelSectionProps) {
  return (
    <section
      className="
        border-b
        border-slate-100

        p-4
      "
    >
      <h3
        className="
          mb-3

          text-xs
          font-semibold
          uppercase
          tracking-wider

          text-slate-500
        "
      >
        {title}
      </h3>

      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default DetailPanelSection;
