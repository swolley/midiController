export const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("../views/HomeView.vue"),
    },

    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("../views/NotFoundView.vue"),
    },
];
