import { createRoot } from "react-dom/client";
import store from "./redux/store.js";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);
