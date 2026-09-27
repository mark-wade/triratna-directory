import SidebarDialog from "../Drawer/Drawer";
import InstallInstructions from "../InstallInstructions/InstallInstructions";

export default function InstallDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <SidebarDialog title="Install the App" open={open} setOpen={setOpen}>
      <div className="px-4 mt-4">
        <InstallInstructions />
      </div>
    </SidebarDialog>
  );
}
