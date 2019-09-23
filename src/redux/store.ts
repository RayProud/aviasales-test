import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension';
import defaultReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
export default createStore(
    defaultReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);
