import DataTable from "@/components/data-table/DataTable";

import { columns } from "../columns/monitoring.columns";

interface Props {
  data: any[];
}

export default function ServiceHealthCard({ data }: Props) {
  return (
    <div className="rounded-md border border-gray-300 bg-white p-5">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
