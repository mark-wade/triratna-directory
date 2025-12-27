import NavBar from "../NavBar/NavBar";

export default function NavWrapper({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar title={title} />
      <main className="fullheight lg:pl-20 pb-14 lg:pb-0">{children}</main>
    </>
  );
}
