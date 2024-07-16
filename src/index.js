import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { TenantProvider } from "./TenantContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <TenantProvider>
    <App />
  </TenantProvider>
);
