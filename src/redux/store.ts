import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension';
import defaultReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    defaultReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
);

export type AppState = ReturnType<typeof defaultReducer>

sagaMiddleware.run(rootSaga as any);

export default store;
