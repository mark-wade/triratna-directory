import NavBar from "../NavBar/NavBar";

export default function NavWrapper({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className ? className + " fullheight" : "fullheight"}>
      <NavBar title={title} />
      <main className=" h-full split:pl-20 pb-14 split:pb-0">{children}</main>
    </div>
  );
}
