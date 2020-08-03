import { reactLocalStorage } from 'reactjs-localstorage';
import { SET_AUTHENTICATED } from './../redux/actions/auth'
import store from './../redux/store';

const setCredentials = (dataUser, token, authenticated) => {
  const currentUser = {
    dataUser,
    token,
    authenticated
  };
  reactLocalStorage.setObject('currentUser', currentUser);

  store.dispatch({
    type: SET_AUTHENTICATED,
    authenticated: currentUser.authenticated,
    user: currentUser.dataUser,
    token: currentUser.dataUser.token,
  });
}

const updateCredentials = (dataUser, authenticated) => {
  let newCurrentUser = {
    dataUser,
    token: reactLocalStorage.getObject('currentUser').token,
    authenticated
  };
  reactLocalStorage.setObject('currentUser', newCurrentUser);

  store.dispatch({
    type: SET_AUTHENTICATED,
    authenticated: newCurrentUser.authenticated,
    user: newCurrentUser.dataUser,
    token: newCurrentUser.dataUser.token,
  });
}

const getCredentials = () => {
  return reactLocalStorage.getObject('currentUser');
}

const clearCredentials = () => {
  let currentUser = {
    dataUser: undefined,
    token: undefined,
    authenticated: false
  };
  reactLocalStorage.setObject('currentUser', currentUser);
  store.dispatch({
    type: SET_AUTHENTICATED,
    authenticated: false,
    user: {},
    token: ''
  });
}

export {
  setCredentials,
  updateCredentials,
  getCredentials,
  clearCredentials
};