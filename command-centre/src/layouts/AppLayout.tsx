import { Outlet, useLocation } from "react-router-dom";

import AppShell from "@/components/shared/app/AppShell";
import AppHeader from "@/components/shared/app/AppHeader";
import AppSidebar from "@/components/shared/app/AppSidebar";
import PageTransition from "@/components/shared/page/PageTransition";

export default function AppLayout() {
  const location = useLocation();

  return (
    <AppShell sidebar={<AppSidebar />} header={<AppHeader />}>
      <PageTransition key={location.pathname}>
        <Outlet />
      </PageTransition>
    </AppShell>
  );
}
