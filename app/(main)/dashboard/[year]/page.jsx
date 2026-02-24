import DepartmentGrid from "@/app/components/DepartmentGrid";

export default async function Page({ params }) {
  const { year } = await params;

  return <DepartmentGrid year={year} />;
}