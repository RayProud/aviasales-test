import { put, take } from 'redux-saga/effects';
import actions from './actionsCombine';
import { SearchResponse, TicketsResponse, StartSearching } from './tickets/types';

const { ticketsResponseSuccess } = actions;

const SEARCH_URL = 'https://front-test.beta.aviasales.ru/search';
const TICKETS_URL = 'https://front-test.beta.aviasales.ru/tickets';

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

function* rootSaga() {
  while (true) {
    yield take<StartSearching>('START_SEARCHING');

    try {
        // Как бы сюда типы просунуть? 🤔
        const searchResponse: SearchResponse = yield request<SearchResponse>(SEARCH_URL);
        const { searchId } = searchResponse;

        let haveTickets = true;
        let count = 0;

        // начать крутить прелоадер над билетами
        while (haveTickets) {
            const ticketsResponse: TicketsResponse = yield request(`${TICKETS_URL}?searchId=${searchId}`);
            const { tickets, stop } = ticketsResponse;
            if (count === 0) {
                // можно положить сперва первую партию сразу в стор, чтобы отрендерить что-нибудь,
                // при этом каждую партию отправлять в webworker
                // каждые N секунд получать сообщение (или запрашивать) от webworker'а и подпушивать результаты
                // всё это время, пока нет stop: true, крутить предлоадер
                console.log('tickets', tickets);
                yield put(ticketsResponseSuccess(tickets));
            }
            count++;
            // console.log(tickets, stop);

            if (stop) {
                // выключить прелоадер
                haveTickets = false;
            }
        }

    } catch(e) {
        console.log('try error', e);
    }
  }
}

export default rootSaga;