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
    // кажется, надо поменять как-то более явно держать это в сторе
    const fastest = !cheapest;

    const array = tickets.slice();

    // если layovers['stops-all'], то фильтруем по most
    // иначе сперва фильтруем по остановкам, потом уже по most (чтобы дофильтровать остатки предыдущей фильтрации)
    if (layovers['stops-all']) {
        if (cheapest) array.sort((a, b) => a.price - b.price);
        if (fastest) array.sort((a, b) => (a.segments[0].duration + a.segments[1].duration) - (b.segments[0].duration + b.segments[1].duration));

        return array;
    }

    if (layovers['stops-all']) return array;
    // не больше трёх пересадок в фильтрах согласно дизайну и сайту (и здравому смыслу?)
    // как-то фильтровать по пришедшим пересадкам
}

async function startSearch(filters) {
    let haveTickets = true;
    let count = 0;
    // обложиться try-catch
    const searchResponse = await request(SEARCH_URL);
    const { searchId } = searchResponse;

    while (haveTickets) {
        const ticketsResponse = await request(`${TICKETS_URL}?searchId=${searchId}`);
        const { tickets, stop } = ticketsResponse;

        allSortedTickets.push(...tickets);

        // точно нужно показать данные как можно раньше, поэтому пушим первую сортированную партию
        // на каждый 10й запрос допушиваем накопленные сортированные билеты, чтобы показать, что мы действительно делом заняты
        // (правда, количество при этом растёт и каждая следующая сортировка будет занимать больше времени)
        if (count === 0 || count % 10 === 0) {
            const sorted = filterSort(allSortedTickets, filters);
            postMessage(sorted.slice(0, 10));
        }
        count++;

        if (stop) {
            haveTickets = false;
        }
    }

    // sort() мутирует
    const sortedTickets = allSortedTickets.sort((a, b) => a.price - b.price);
    postMessage(sortedTickets.slice(0, 10));

    // вот тут бы ещё высылать данные о том, какие пересадки вообще доступны
    // исползовать [].some()?
}

onmessage = async function(e) {
    const { action, filters } = e.data;

    if (action === 'getTickets') {
        await startSearch(filters);
    }

    if (action === 'sort') {
        const sortedTickets = filterSort(allSortedTickets, filters);
        postMessage(sortedTickets.slice(0, 10));
    }

}