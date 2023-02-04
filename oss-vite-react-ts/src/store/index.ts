import {legacy_createStore, combineReducers, compose, applyMiddleware} from "redux";
import reducer from "./reducer";
import thunk from 'redux-thunk'
const store = legacy_createStore(reducer, compose(applyMiddleware(thunk)));

export default store