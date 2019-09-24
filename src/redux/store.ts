import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension';
import { systemReducer } from './system/reducers';
import { filtersReducer } from './filters/reducers';
import { ticketsReducer } from './tickets/reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
    system: systemReducer,
    filters: filtersReducer,
    tickets: ticketsReducer
});

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
);

export type AppState = ReturnType<typeof rootReducer>

sagaMiddleware.run(rootSaga as any);

export default store;
