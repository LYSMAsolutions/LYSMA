// app/[distributor]/layout.tsx

export default function DistributorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F2F4F7] text-[#0F172A]">
      {children}
    </div>
  );
}