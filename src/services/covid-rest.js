const MSG_SERVER_LOST = 'please try later';

export default class CovidRest {
    #url

    constructor(url) {
        this.#url = url;
    }

    async getLiveCasesData() {
        try {
            const url = this.#url + 'cases';
            const response = await fetch(url);
            return await response.json();
        } catch (err) {
            throw MSG_SERVER_LOST;
        }
    }

    async getVaccinesData() {
        try {
            const url = this.#url + 'vaccines';
            const response = await fetch(url);
            return await response.json();
        } catch (err) {
            throw MSG_SERVER_LOST;
        }
    }

    async getHistoryByDeath() {
        try {
            const url = this.#url + 'history?status=deaths';
            const response = await fetch(url);
            return await response.json();
        } catch (err) {
            throw MSG_SERVER_LOST;
        }
    }

    async getHistoryByConfirm() {
        try {
            const url = this.#url + 'history?status=confirmed';
            const response = await fetch(url);
            return await response.json();
        } catch (err) {
            throw MSG_SERVER_LOST;
        }
    }
}