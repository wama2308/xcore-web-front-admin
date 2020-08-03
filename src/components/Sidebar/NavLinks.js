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
          menu_title: "sidebar.categories",
          new_item: false,
          path: "/app/setting/categories",
        },        
        {
          menu_title: "sidebar.business",
          new_item: false,
          path: "/app/setting/business",
        },        
      ],
    },
    // {
    //   menu_title: "sidebar.users",
    //   menu_icon: "zmdi zmdi-account",
    //   type_multi: null,
    //   new_item: false,
    //   child_routes: [
    //     {
    //       menu_title: "sidebar.rols",
    //       new_item: false,
    //       path: "/app/users/rols",
    //     },
    //     {
    //       menu_title: "sidebar.userConfig",
    //       new_item: false,
    //       path: "/app/users/userConfig",
    //     },
    //   ],
    // },
    
  ],
};
