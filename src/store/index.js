import { createStore, applyMiddleware, compose } from 'redux';
import Thunk from 'redux-thunk';
import reducers from '../reducers';
import './../api/interceptors'
//import { loadState, saveState } from './persistReducer'
//const dataState = loadState() || {};
export function configureStore(initialState) {        
    const store = createStore(
        reducers,
        initialState,
        compose(applyMiddleware(Thunk))
    );
    // store.subscribe(function () {
    //     saveState(store.getState())
    // })
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers/index', () => {
            const nextRootReducer = require('../reducers/index');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
