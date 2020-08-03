/**
 * App Reducers
 */
import { combineReducers } from "redux";
import settings from "./settings";
import chatAppReducer from "./ChatAppReducer";
import sidebarReducer from "./SidebarReducer";
import todoAppReducer from "./TodoAppReducer";
import authUserReducer from "./AuthUserReducer";
import feedbacksReducer from "./FeedbacksReducer";
import ecommerceReducer from "./EcommerceReducer";
import empresaReducer from "./EmpresaReducer";
import sucursalReducer from "./SucursalReducer";
import areaReducer from "./AreasReducer";
import planesReducer from "./PlanesReducer";
import lessonsReducer from "./LessonsReducer";
import servicesReducer from "./ServicesReducer";
import scheduleReducer from "./ScheduleReducer";
import screenReducer from "./ScreensReducer";
import departamentsReducer from "./DepartamentsReducer";
import cargosReducer from "./CargosReducer";
import storeReducer from "./StoreReducer";
import packagesReducer from "./PackagesReducer";
import discountsReducer from "./DiscountsReducer";
import typeClientReducer from "./TypeClientReducer";
import rewardsReducer from "./RewardsReducer";
import rolsReducer from "./RolsReducer";
import usersReducer from "./UsersReducer";
import wayToPaySaleReducer from "./WayToPaySaleReducer";
import aplicationReducers from "./aplicationReducer";
import ClientsReducer from "./ClientsReducer";
import SettingBillsReducer from "./SettingBillsReducer";
import providerReducer from "./ProviderReducer";
import purchaseReducer from "./PurchasesReducer";

const reducers = combineReducers({
  settings,
  chatAppReducer,
  sidebar: sidebarReducer,
  todoApp: todoAppReducer,
  authUser: authUserReducer,
  feedback: feedbacksReducer,
  ecommerce: ecommerceReducer,
  empresa: empresaReducer,
  sucursal: sucursalReducer,
  area: areaReducer,
  plan: planesReducer,
  lessons: lessonsReducer,
  services: servicesReducer,
  schedules: scheduleReducer,
  screens: screenReducer,
  departaments: departamentsReducer,
  cargos: cargosReducer,
  store: storeReducer,
  packages: packagesReducer,
  discounts: discountsReducer,
  typeClients: typeClientReducer,
  rewards: rewardsReducer,
  general: aplicationReducers,
  rols: rolsReducer,
  users: usersReducer,
  wayToPaySale: wayToPaySaleReducer,
  clients: ClientsReducer,
  settingBills: SettingBillsReducer,
  provider: providerReducer,
  purchase: purchaseReducer,
});

export default reducers;
