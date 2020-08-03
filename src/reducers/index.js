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
import aplicationReducers from "./aplicationReducer";
import ClientsReducer from "./ClientsReducer";

const reducers = combineReducers({
  settings,
  chatAppReducer,
  sidebar: sidebarReducer,
  todoApp: todoAppReducer,
  authUser: authUserReducer,
  feedback: feedbacksReducer,
  ecommerce: ecommerceReducer,
  general: aplicationReducers,  
  clients: ClientsReducer,
  
});

export default reducers;
