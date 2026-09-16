import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import PageContainer from "@/components/shared/page/PageContainer";
import PageHeader from "@/components/shared/page/PageHeader";

import { badgeVariants } from "@/lib/badge-variants";
import { APPLICATIONS } from "@/lib/constants";

import { APPLICATION_CONFIG, type ApplicationId } from "../config/application.config";

/** Overview of every application in the ecosystem — fixes the old bug
 *  where "/applications" accidentally rendered the Kings Brew page. */
function ApplicationsListPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Applications"
          description="Every application connected to the ecosystem. Pick one to manage its data."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {APPLICATIONS.map((app, index) => {
            const config = APPLICATION_CONFIG[app.id as ApplicationId];

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
              >
                <Link
                  to={app.path}
                  className="
                    group
                    flex
                    h-full
                    flex-col
                    gap-3
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    transition-all
                    hover:-translate-y-1
                    hover:shadow-md
                  "
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                      {app.emoji}
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {app.name}
                      </h3>

                      <p className="text-xs text-slate-500">
                        {config.resources.length} tab
                        {config.resources.length > 1 ? "s" : ""}:{" "}
                        {config.resources.map((r) => r.label).join(", ")}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500">{app.description}</p>

                  <span
                    className={`
                      mt-auto
                      w-fit
                      rounded-md
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      ${badgeVariants[config.color]}
                    `}
                  >
                    Manage {config.entityPluralName}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}

export default ApplicationsListPage;
