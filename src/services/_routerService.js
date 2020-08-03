// routes
import Dashboard from "Routes/dashboard";
import PaginaInicial from "Routes/pagina-inicial";
import Configuracion from "Routes/configuracion";
import Ecommerce from "Routes/sales";
import Users from "Routes/users";
import Management from "Routes/management";
import Empresa from "Routes/configuracion/empresa";
import Sucursal from "Routes/configuracion/sucursal";
import Area from "Routes/configuracion/area";
import Planes from "Routes/configuracion/planes";
import Lessons from "Routes/configuracion/lessons";
import Services from "Routes/configuracion/services";
import Schedules from "Routes/configuracion/schedules";
import Screens from "Routes/configuracion/screens";
import Departaments from "Routes/configuracion/departaments";
import Positions from "Routes/configuracion/cargos";
import Store from "Routes/configuracion/store";
import Packages from "Routes/configuracion/packages";
import Discounts from "Routes/configuracion/discounts";
import Typeclient from "Routes/configuracion/typeclient";
import Rewards from "Routes/configuracion/rewards";
import Provider from "Routes/configuracion/provider";
import Rols from "Routes/users/rols";
import UserConfig from "Routes/users/users";
import Purchases from "Routes/management/purchases";

//import Sales from "Routes/sales";

// async component
import {
  AsyncAboutUsComponent,
  AsyncChatComponent,
  AsyncMailComponent,
  AsyncTodoComponent,
} from "Components/AsyncComponent/AsyncComponent";

export default [
  {
    path: "setting",
    component: Configuracion,
  },
  {
    path: "users",
    component: Users,
  },
  {
    path: "management",
    component: Management,
  },
  {
    path: "business",
    component: Empresa,
  },
  {
    path: "branchoffices",
    component: Sucursal,
  },
  {
    path: "areas",
    component: Area,
  },
  {
    path: "planes",
    component: Planes,
  },
  {
    path: "lessons",
    component: Lessons,
  },
  {
    path: "services",
    component: Services,
  },
  {
    path: "schedules",
    component: Schedules,
  },
  {
    path: "screens",
    component: Screens,
  },
  {
    path: "departaments",
    component: Departaments,
  },
  {
    path: "positions",
    component: Positions,
  },
  {
    path: "store",
    component: Store,
  },
  {
    path: "packages",
    component: Packages,
  },
  {
    path: "discounts",
    component: Discounts,
  },
  {
    path: "typeclient",
    component: Typeclient,
  },
  {
    path: "rewards",
    component: Rewards,
  },
  {
    path: "provider",
    component: Provider,
  },
  {
    path: "rols",
    component: Rols,
  },
  {
    path: "userConfig",
    component: UserConfig,
  },
  {
    path: "dashboard",
    component: PaginaInicial,
  },
  {
    path: "dash",
    component: Dashboard,
  },
  {
    path: "sales",
    component: Ecommerce,
  },
  {
    path: "purchases",
    component: Purchases,
  },
  // {
  //   path: "ecommerce",
  //   component: Ecommerce,
  // },
];
