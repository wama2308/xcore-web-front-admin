// routes
import Dashboard from "Routes/dashboard";
import PaginaInicial from "Routes/pagina-inicial";
import Configuracion from "Routes/configuracion";
//import Ecommerce from "Routes/sales";
import Categories from "Routes/configuracion/Categories";


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
  // {
  //   path: "users",
  //   component: Users,
  // },  
  {
    path: "dashboard",
    component: PaginaInicial,
  },
  {
    path: "dash",
    component: Dashboard,
  },
  {
    path: "categories",
    component: Categories,
  },
  // {
  //   path: "sales",
  //   component: Ecommerce,
  // },    
];
