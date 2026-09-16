import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {children}
    </div>
  );
}

export default PageContainer;
