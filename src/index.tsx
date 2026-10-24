import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./components/App/App";

// CSS can only tell portrait from landscape, not which way round the device is, which decides which
// corner the camera is in (see NavBar.css)
function updateOrientation() {
  document.documentElement.dataset.orientation = screen.orientation?.type ?? "";
}
updateOrientation();
screen.orientation?.addEventListener("change", updateOrientation);

let container = document.getElementById("app")!;
let root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
