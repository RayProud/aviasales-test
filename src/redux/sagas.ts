import { put, take, select, all, call, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import actions from './actionsCombine';
import { SearchResponse, TicketsResponse, StartSearching } from './tickets/types';
import { AppState } from './store';

const { ticketsResponseSuccess } = actions;

const getFilters = (state: AppState) => state.filters;

const SEARCH_URL = 'https://front-test.beta.aviasales.ru/search';
const TICKETS_URL = 'https://front-test.beta.aviasales.ru/tickets';

const myWorker = new Worker("worker.js");

// дело в том, что для fetch'а любой состоявшийся запрос считается успешным
// ошибки для него — это CORS и отсуствие сети — они будут обработаны уже в .catch
function checkStatus(response: Response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const { url = '', status = '', statusText = '' } = response;

    const error = new Error(`url: ${url}, status: ${status}, statusText: ${statusText}`);
    throw error;
}

function parseJSON(response: Response) {
    return response.json();
}

/**
 * В стандарте fetch не предусмотрен таймаут запроса, эмулируем его через race-condition
 * @param request исполняемый запрос
 * @param timeout количество мс отведенное на исполнение запроса
 * @throws Выбрасывает исключение если запрос не былвыполнен за timeout
 */
function fetchTimeout(request: ReturnType<typeof fetch>, timeout = 2000) {
    return Promise.race([
        request,
        new Promise<never>((_, reject) =>
        setTimeout(() => {
            reject(new Error("Request timeout"));
        }, timeout)
        )
    ]);
}

// добавить таймаут и добавить в проверке статуса await response.text() для бажного хрома
const request = <T>(url: string): Promise<T> => {
    function fetchWithErrors(url: string, repeats: number = 5): Promise<T> {
        let retries = repeats;

        return fetch(url)
            .then(checkStatus)
            .then(parseJSON)
            .then(body => body)
            .catch(error => {
                console.log('error in catch, retries', retries, error);
                if (retries > 0) {
                    return fetchWithErrors(url, retries - 1);
                }

                throw error;
            })
    }

    return fetchWithErrors(url);
}

function createWorkerChannel() {
    return eventChannel(emit => {
        const pingHandler = (event: MessageEvent) => {
          // puts event payload into the channel
          // this allows a Saga to take this payload from the returned channel
          const result = event.data;
          emit(result);
        }

        myWorker.onmessage = pingHandler;

        // the subscriber must return an unsubscribe function
        // this will be invoked when the saga calls `channel.close` method
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
        yield put(ticketsResponseSuccess(payload));
    }
}

// сана на прослушки изменений фильтров, чтобы делать postMessage с другими параметрами

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