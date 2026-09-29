import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "sonner";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./utils/redux/store/store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <App />
    </BrowserRouter>
    ,
  </Provider>,
);
