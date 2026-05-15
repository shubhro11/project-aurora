import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";
import store from "./store/store.jsx";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, Flip } from 'react-toastify';

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
  <BrowserRouter>
    <ToastContainer
      position="top-center"
      autoClose={3500}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover
      theme="colored"
      transition={Flip}
    />

    <App />
  </BrowserRouter>
</Provider>
);
