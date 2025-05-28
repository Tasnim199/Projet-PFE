import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { NotificationProvider } from "./NotificationContext";
import { SearchProvider } from "./SearchContext";
import Modal from "react-modal"; // 👈 AJOUT ICI

Modal.setAppElement("#root");    // 👈 AJOUT ICI AUSSI

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SearchProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </SearchProvider>
  </React.StrictMode>
);
