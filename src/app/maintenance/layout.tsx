export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Standalone layout — no navbar, no footer, just the maintenance page
  return <>{children}</>;
}
