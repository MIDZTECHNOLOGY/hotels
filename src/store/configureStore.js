import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk" ;
import {persistStore, persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducers from "./reducers";
import localforage from 'localforage';

const persistConfig = {
    key: 'root',
    storage: localforage,
}

const persistedReducer = persistReducer(persistConfig, rootReducers);

export default () => {
    let store = createStore(persistedReducer,  applyMiddleware(thunk));
    let persistor = persistStore(store);

    return {
        store,
        persistor
    }
}