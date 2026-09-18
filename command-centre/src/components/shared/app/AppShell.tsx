import type { ReactNode } from "react";

interface AppShellProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

function AppShell({ sidebar, header, children }: AppShellProps) {
  return (
    <div
      className="
        flex
        h-dvh
        w-dvw
        overflow-hidden

        bg-gradient-to-br
        from-blue-50
        via-slate-50
        to-amber-50
      "
    >
      {sidebar}

      <div
        className="
          my-4
          mr-4

          flex
          min-w-0
          flex-1
          flex-col

          h-[calc(100dvh-2rem)]
        "
      >
        <main
          className="
            flex
            h-full
            flex-col

            rounded-md

            border
            border-white/50

            bg-white/80

            backdrop-blur-xl

            shadow-lg
            shadow-slate-200/50

            overflow-hidden
          "
        >
          {header}

          <div
            className="
              flex-1

              overflow-y-auto
              overflow-x-hidden

              p-6
            "
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
