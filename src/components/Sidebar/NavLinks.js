// sidebar nav links
export default {
  category1: [
    {
      menu_title: "sidebar.setting",
      menu_icon: "zmdi zmdi-wrench",
      type_multi: null,
      new_item: false,
      child_routes: [
        {
          menu_title: "sidebar.business",
          new_item: false,
          path: "/app/setting/business",
        },
        {
          menu_title: "sidebar.branchoffices",
          new_item: false,
          path: "/app/setting/branchoffices",
        },
        {
          menu_title: "sidebar.areas",
          new_item: false,
          path: "/app/setting/areas",
        },
        {
          menu_title: "sidebar.planes",
          new_item: false,
          path: "/app/setting/planes",
        },
        {
          menu_title: "sidebar.lessons",
          new_item: false,
          path: "/app/setting/lessons",
        },
        {
          menu_title: "sidebar.services",
          new_item: false,
          path: "/app/setting/services",
        },
        {
          menu_title: "sidebar.schedules",
          new_item: false,
          path: "/app/setting/schedules",
        },
        {
          menu_title: "sidebar.screens",
          new_item: false,
          path: "/app/setting/screens",
        },
        {
          menu_title: "sidebar.departaments",
          new_item: false,
          path: "/app/setting/departaments",
        },
        {
          menu_title: "sidebar.positions",
          new_item: false,
          path: "/app/setting/positions",
        },
        {
          menu_title: "sidebar.store",
          new_item: false,
          path: "/app/setting/store",
        },
        {
          menu_title: "sidebar.packages",
          new_item: false,
          path: "/app/setting/packages",
        },
        {
          menu_title: "sidebar.discounts",
          new_item: false,
          path: "/app/setting/discounts",
        },
        {
          menu_title: "sidebar.typeclient",
          new_item: false,
          path: "/app/setting/typeclient",
        },
        {
          menu_title: "sidebar.rewards",
          new_item: false,
          path: "/app/setting/rewards",
        },
      ],
    },
    {
      menu_title: "sidebar.users",
      menu_icon: "zmdi zmdi-account",
      type_multi: null,
      new_item: false,
      child_routes: [
        {
          menu_title: "sidebar.rols",
          new_item: false,
          path: "/app/users/rols",
        },
        {
          menu_title: "sidebar.userConfig",
          new_item: false,
          path: "/app/users/userConfig",
        },
      ],
    },
    {
      menu_title: "sidebar.sales",
      menu_icon: "zmdi zmdi-shopping-cart",
      type_multi: null,
      new_item: false,
      child_routes: [
        {
          menu_title: "sidebar.clients",
          new_item: false,
          path: "/app/sales/clients",
        },
      ],
    },
  ],
};
