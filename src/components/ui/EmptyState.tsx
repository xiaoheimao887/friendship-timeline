export function EmptyState({ icon, title, description, action }: {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && <div className="text-5xl mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-warm-text mb-2">{title}</h3>
      {description && <p className="text-warm-muted text-sm max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}
