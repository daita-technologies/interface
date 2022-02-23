import { applyMiddleware, createStore, compose } from "redux";
import createSagaMiddleware from "redux-saga";

import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer from "reduxes";
import rootSaga from "sagas";

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

let composedEnhancers: any;
if (process.env.NODE_ENV === "development") {
  composedEnhancers = composeWithDevTools(applyMiddleware(...middlewares));
}

if (process.env.NODE_ENV === "production") {
  composedEnhancers = compose(applyMiddleware(...middlewares));
}

export default createStore(rootReducer, undefined, composedEnhancers);

sagaMiddleware.run(rootSaga);
