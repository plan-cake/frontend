export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="sticky top-0 z-10 h-25 w-full bg-white" />
      {children}
    </main>
  );
}
