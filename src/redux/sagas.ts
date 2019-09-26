import { put, take, select, all, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import actions from './actionsCombine';
import { StartSearching } from './tickets/types';
import { AppState } from './store';

const { ticketsResponseSuccess, changeLayoverFilter, endSearch, hasError } = actions;

const getFilters = (state: AppState) => state.filters;
const getSystem = (state: AppState) => state.system;

const myWorker = new Worker("worker.js");

function createWorkerChannel() {
    return eventChannel(emit => {
        const pingHandler = (event: MessageEvent) => {
          const result = event.data;
          emit(result);
        }

        myWorker.onmessage = pingHandler;

        const unsubscribe = () => {
          myWorker.terminate();
        };

        return unsubscribe
      })
}

function* getTickets() {
    const workerChannel = yield call(createWorkerChannel);

    while (true) {
        const payload = yield take(workerChannel);

        const { tickets, layovers, stopSearch, error } = payload;

        if (tickets) yield put(ticketsResponseSuccess(tickets));
        if (layovers) yield put(changeLayoverFilter(layovers));
        if (stopSearch) yield put(endSearch());
        if (error) yield put(hasError());
    }
}

function* listenFiltersChange() {
    while (true) {
        yield take(['CHANGE_MOST_FILTER', 'CHANGE_LAYOVER_FILTER', 'TURN_ALL_LAYOVER_FILTERS_ON', 'TURN_ALL_LAYOVER_FILTERS_OFF']);

        const {endSearch} = yield select(getSystem);
        const filters = yield select(getFilters)

        // если поиск ещё не закончился, то пока ничего не шлём
        endSearch && myWorker.postMessage({
            action: 'sort',
            filters
        });
    }
}

function* start() {
  while (true) {
    yield take<StartSearching>('START_SEARCHING');
    const filters = yield select(getFilters)

    myWorker.postMessage({
        action: 'getTickets',
        filters
    });
  }
}

export default function *rootSaga() {
    yield all([
        start(),
        getTickets(),
        listenFiltersChange()
    ]);
}