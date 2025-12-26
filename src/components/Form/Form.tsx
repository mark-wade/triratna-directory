export default function Form({
  onSubmit,
  className,
  children,
}: {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <form className={className} onSubmit={onSubmit}>
      {children}
    </form>
  );
}
