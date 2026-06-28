import PageHeader from "@/components/shared/page/PageHeader";

interface ProductsTabProps {
  productName: string;
  productPluralName: string;
}

function ProductsTab({ productName, productPluralName }: ProductsTabProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={productPluralName}
        description={`Manage all ${productPluralName.toLowerCase()} for this application.`}
        badge={productName}
      />

      <div className="rounded-md border border-slate-200 bg-white p-6">
        Products Table
      </div>
    </div>
  );
}

export default ProductsTab;
