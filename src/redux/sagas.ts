import { put, take, select, all, call } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import actions from './actionsCombine';
import { StartSearching } from './tickets/types';
import { AppState } from './store';

const { ticketsResponseSuccess } = actions;

const getFilters = (state: AppState) => state.filters;

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
        console.log('payload', payload);
        // payload.type === 'filters' - возможно, нужно сделать в редюсере ещё одну ветку, чтобы не перезатирать имеющиеся фильтры
        // payload.type === 'tickets'
        yield put(ticketsResponseSuccess(payload));
    }
}

function* listenFiltersChange() {
    while (true) {
        yield take(['CHANGE_MOST_FILTER', 'CHANGE_LAYOVER_FILTER']);
        const filters = yield select(getFilters)

        myWorker.postMessage({
            action: 'sort',
            filters
        });
    }
}


function* start() {
  while (true) {
    yield take<StartSearching>('START_SEARCHING');

    try {
        const filters = yield select(getFilters)

        myWorker.postMessage({
            action: 'getTickets',
            filters
        });
    } catch(e) {
        console.log('try error', e);
    }
  }
}

export default function *rootSaga() {
    yield all([
        start(),
        getTickets(),
        listenFiltersChange()
    ]);
}