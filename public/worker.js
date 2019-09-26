"use strict";

const LAYOVERS_FILTERS_COUNT = 3;
const TICKETS_URL = 'https://front-test.beta.aviasales.ru/tickets';
const SEARCH_URL = 'https://front-test.beta.aviasales.ru/search';
const allSortedTickets = [];

async function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    // перед тем как кинуть ошибку дожидаемся text()
    // иначе ловим багу в Chrome devtools network: не отображается ответ от сервера при кодах
    // больше 400 (непустое тело ответа, такое вполне может быть)
    await response.text();

    const { url = '', status = '', statusText = '' } = response;
    const error = new Error(`url: ${url}, status: ${status}, statusText: ${statusText}`);
    throw error;
}

/**
 * Fetch принимает ответ в формате Response — https://developer.mozilla.org/en-US/docs/Web/API/Response
 * Поэтому для дальнейшего использования нужно тело перевести в формат объекта
 * @param response Response
 */
function parseJSON(response) {
    return response.json();
}

/**
 * В стандарте fetch не предусмотрен таймаут запроса, эмулируем его через race-condition
 * @param request исполняемый запрос
 * @param timeout количество мс отведенное на исполнение запроса
 * @throws Выбрасывает исключение если запрос не былвыполнен за timeout
 */
function fetchTimeout(url, request, timeout = 1000) {
    return Promise.race([
        request,
        new Promise((_, reject) => setTimeout(() => {
            reject(new Error(`url: ${url}, error: request timeout exceeded ${timeout}ms`));
        }, timeout))
    ]);
}

/**
 * Fetch не умеет сам перезапрашивать перезапрашивать, поэтому пишем обёртку, где сами смотрим
 * что для нас ошибка и сколько раз перезапрашивать
 * @param url
 */
const request = (url) => {
    function fetchWithErrors(url, repeats = 5) {
        let retries = repeats;

        return fetchTimeout(url, fetch(url))
            .then(checkStatus)
            .then(parseJSON)
            .then(body => body)
            .catch(error => {
                if (retries > 0) {
                    return fetchWithErrors(url, retries - 1);
                }

                // вот тут ошибку обернуть бы в Sentry.captureException
                // или любой другой способ, чтобы можно было ошибку найти в логах
                // но если важно понимать, как часто сервер
                // отдаёт ошибку/не успевает в таймаут, то поставить внутри if'а
                throw error;
        });
    }
    return fetchWithErrors(url);
};

function filterLength(ticket, stops, both) {
    const firstSegmentStopsEqual = ticket.segments[0].stops.length === stops;
    const secondSegmentStopsEqual = ticket.segments[1].stops.length === stops;

    if (both) {
        return firstSegmentStopsEqual && secondSegmentStopsEqual;
    }

    return firstSegmentStopsEqual || secondSegmentStopsEqual;
}

function filterSort(tickets, filters) {
    const { cheapest, layovers } = filters;
    const layoversValues = Object.values(layovers);
    const hasLayoversFilters = Object.keys(layovers).length;

    if (hasLayoversFilters) {
        const allFiltersFalse = layoversValues.every(filter => filter === false);

        if (allFiltersFalse) {
            // когда все пересадки выключены, то таких билетов нет,
            // покажем заглушку, мол, соре, у вас специфические вкусы
            return [];
        }
    }

    // кажется, надо поменять как-то более явно держать это в сторе
    const fastest = !cheapest;

    const array = tickets.slice();

    if (cheapest) {
        array.sort((a, b) => a.price - b.price);
    } else if (fastest) {
        array.sort((a, b) => (a.segments[0].duration + a.segments[1].duration) - (b.segments[0].duration + b.segments[1].duration));
    }

    const allFiltersTrue = hasLayoversFilters && layoversValues.every(filter => filter === false);
    // если все пересадки, то больше фильтровать не надо
    // если пересадок вообще нет, то тоже отдаём
    if (allFiltersTrue || !hasLayoversFilters) {
        return array;
    }

    // если есть конкретные пересадки, то здесь отфильтровать отсортированный массив
    const filtersRules = Object.keys(layovers).reduce((prevState, key) => {
        if (layovers[key]) {
            prevState.push(+key[key.length - 1]);
        }

        return prevState;
    }, []);

    return array.filter(ticket => {
        return filtersRules.some(stops => filterLength(ticket, stops, stops === 0));
    });
}

function generateLayovers(layovers, sorted) {
    // Вот тут конечно надо количество фильтров выносить в константу на уровне приложения
    // Но времени лезть в eject CRA, чтобы собирать воркер отдельной точкой входа, поэтому вот так
    return Array(LAYOVERS_FILTERS_COUNT).fill().reduce((prevState, _, index) => {
        if (prevState[`stops${index}`]) return layovers;

        return {
            ...prevState,
            [`stops${index}`]: sorted.some(ticket => filterLength(ticket, index)),
        };
    }, layovers);
}

async function startSearch(filters) {
    try {
        let haveTickets = true;
        let count = 0;
        // обложиться try-catch
        const searchResponse = await request(SEARCH_URL);
        const { searchId } = searchResponse;

        // в самом начале нет никаких фильтров, ведь мы ещё не знаем, какие билеты придут
        let layovers = {};

        while (haveTickets) {
            const ticketsResponse = await request(`${TICKETS_URL}?searchId=${searchId}`);
            const { tickets, stop } = ticketsResponse;

            allSortedTickets.push(...tickets);

            // точно нужно показать данные как можно раньше, поэтому пушим первую сортированную партию
            // на каждый 10й запрос допушиваем накопленные сортированные билеты, чтобы показать, что мы действительно делом заняты
            // (правда, количество при этом растёт и каждая следующая сортировка будет занимать больше времени)
            if (count === 0 || count % 10 === 0) {
                const sorted = filterSort(allSortedTickets, filters);
                layovers = generateLayovers(layovers, sorted);
                postMessage({
                    tickets: sorted.slice(0, 5),
                    layovers
                });
            }

            count++;

            if (stop) {
                haveTickets = false;
            }
        }

        // sort() мутирует
        allSortedTickets.sort((a, b) => a.price - b.price);
        layovers = generateLayovers(layovers, allSortedTickets);
        postMessage({
            tickets: allSortedTickets.slice(0, 5),
            layovers,
            stopSearch: true
        });
    } catch(e) {
        postMessage({
            error: e.message
        });
    }
}

onmessage = async function(e) {
    const { action, filters } = e.data;

    if (action === 'getTickets') {
        await startSearch(filters);
    }

    if (action === 'sort' && allSortedTickets.length) {
        const sortedTickets = filterSort(allSortedTickets, filters);
        postMessage({
            tickets: sortedTickets.slice(0, 5)
        });
    }
}
