import { Sidebar } from '@/components/Sidebar';

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-8 container mx-auto">{children}</div>
      </main>
    </div>
  );
}
