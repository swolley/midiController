import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const app = createApp(App);

app.use(router);
const store = createPinia();
store.use(piniaPluginPersistedstate);
app.use(store);

app.mount("#app");
