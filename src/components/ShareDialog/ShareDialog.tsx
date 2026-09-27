import SidebarDialog from "../Drawer/Drawer";
import ShareApp from "../ShareApp/ShareApp";

export default function ShareDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <SidebarDialog title="Share the App" open={open} setOpen={setOpen}>
      <div className="px-4 mt-4">
        <ShareApp />
      </div>
    </SidebarDialog>
  );
}
