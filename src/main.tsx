import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import intuvieLogo from "@/assets/intuvie_logo.jpg";

const favicon = document.querySelector<HTMLLinkElement>("#favicon");
if (favicon) favicon.href = intuvieLogo;

createRoot(document.getElementById("root")!).render(<App />);
  