import { Map, List } from "immutable";

const setState = (state, newState) => state.mergeDeep(Map(newState));

const setData = (state, node, payload) => state.set(node, payload);

const setObject = (state, payload) => {
  const result = state.toJS();
  return Map({ ...result, ...payload });
};

const sessionOff = (state, payload) => {
  let estado = state.toJS();
  estado.logged = false;
  return Map(estado);
}

const loadingChangeBranchOffice = (state, payload) => {
  let estado = state.toJS();
  estado.branch_office_default = payload.data;
  return Map(estado);
}

const authUserReducer = (state = Map(), action) => {
  switch (action.type) {
    case "SESION_OFF": {
      return sessionOff(state, action.payload)
    }
    case "GET_DATA_USER": {
      return setState(state, action.payload);
    }

    case "USER_VERIFY": {
      return setData(state, 'verify', action.payload)
    }

    // case "NEW_STEP": {
    //   return setData(state, "authStep", action.payload);
    // }
    // case "VERIFYING": {
    //   return setData(state, "user", action.payload);
    // }

    case "LOAD_SECRECT_QUESTIONS": {
      return setData(state, "secretQuestion", action.payload);
    }

    // case "SET_TYPE_USER": {
    //   return setData(state, "typeUser", action.payload);
    // }

    case "USERS_PERMISS": {
      return setObject(state, action.payload);
    }

    case 'LOADING_CHANGE_BRANCH_OFFICES': {
      return loadingChangeBranchOffice(state, action.payload)
    }

    default:
      return state;
  }
};

export default authUserReducer;
