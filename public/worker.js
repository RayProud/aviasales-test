"use strict";

const TICKETS_URL = 'https://front-test.beta.aviasales.ru/tickets';
const SEARCH_URL = 'https://front-test.beta.aviasales.ru/search';
const allSortedTickets = [];

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const { url = '', status = '', statusText = '' } = response;
    const error = new Error(`url: ${url}, status: ${status}, statusText: ${statusText}`);
    throw error;
}
function parseJSON(response) {
    return response.json();
}
/**
 * В стандарте fetch не предусмотрен таймаут запроса, эмулируем его через race-condition
 * @param request исполняемый запрос
 * @param timeout количество мс отведенное на исполнение запроса
 * @throws Выбрасывает исключение если запрос не былвыполнен за timeout
 */
function fetchTimeout(request, timeout = 2000) {
    return Promise.race([
        request,
        new Promise((_, reject) => setTimeout(() => {
            reject(new Error("Request timeout"));
        }, timeout))
    ]);
}
// добавить таймаут и добавить в проверке статуса await response.text() для бажного хрома
const request = (url) => {
    function fetchWithErrors(url, repeats = 5) {
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
        });
    }
    return fetchWithErrors(url);
};

function filterLength(ticket, stops) {
    return ticket.segments[0].stops.length === stops || ticket.segments[1].stops.length === stops;
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
    if (allFiltersTrue) {
        return array;
    }

    // если есть конкретные пересадки, то здесь отфильтровать отсортированный массив
    return array;
}

function generateLayovers(layovers, sorted) {
    return Array(3).fill().reduce((prevState, _, index) => {
        if (prevState[`stops${index}`]) return layovers;

        return {
            ...prevState,
            [`stops${index}`]: sorted.some(ticket => filterLength(ticket, index)),
        };
    }, layovers);
}

async function startSearch(filters) {
    let haveTickets = true;
    let count = 0;
    // обложиться try-catch
    const searchResponse = await request(SEARCH_URL);
    const { searchId } = searchResponse;

    // нет, в самом начале нет никакх фильтров, ключи должны появляться от индекса, но до 2
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
                tickets: sorted.slice(0, 10),
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
        tickets: allSortedTickets.slice(0, 10),
        layovers,
        stopSearch: true
    });
}

onmessage = async function(e) {
    const { action, filters } = e.data;

    if (action === 'getTickets') {
        await startSearch(filters);
    }

    if (action === 'sort' && allSortedTickets.length) {
        this.console.log('sort');
        const sortedTickets = filterSort(allSortedTickets, filters);
        postMessage({
            tickets: sortedTickets.slice(0, 10)
        });
    }
}
