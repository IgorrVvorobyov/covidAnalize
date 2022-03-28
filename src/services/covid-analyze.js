import _ from "lodash";
import covidData from "../config/covidData.json"

const TIME_TO_UPDATE_MILLIS = 60 * 60 * 1000;

export default class CovidAnalyze {
    #covidDataProvider;
    #cases = {'timestamp': 0, 'json': {}};
    #vaccines = {'timestamp': 0, 'json': {}};
    #deathHistory = {'timestamp': 0, 'json': {}};
    #confirmHistory = {'timestamp': 0, 'json': {}};

    constructor(covidDataProvider) {
        this.#covidDataProvider = covidDataProvider;
    }

    async getContinentData() {
        let continentCasesJson = await this.#getCases();
        continentCasesJson = _.map(continentCasesJson, v => v.All);
        continentCasesJson = _.groupBy(continentCasesJson, 'continent');
        delete continentCasesJson['undefined'];

        let continentVaccinesJson = await this.#getVaccines();
        continentVaccinesJson = _.map(continentVaccinesJson, v => v.All);
        continentVaccinesJson = _.groupBy(continentVaccinesJson, 'continent');
        delete continentVaccinesJson['undefined'];

        let continentData;

        continentData = _.map(continentCasesJson, (v, k) => ({
            'namePlace': k,
            'confirmed': _.sumBy(v, 'confirmed'),
            'deaths': _.sumBy(v, 'deaths'),
            'population': _.sumBy(v, 'population'),
            'vaccinated': _.sumBy(v, 'people_vaccinated')
        }));
        return this.#getRateObj(continentData);
    }

    async getWorstBestCountries(objData) {
        this.#validateNum(objData.numCountries, 'countries');

        let countries = await this.#getCountriesByHistory(objData);
        countries = this.#getRateObj(countries);
        countries = _.sortBy(countries, 'rateDeaths');
        if (objData.worstBest === 'worst') {
            countries = _.reverse(countries);
        }
        return countries.splice(0, objData.numCountries);
    }

    async getDataByCountries(objData) {
        if (objData.countries.length === 0 && objData.countryName.length === 0) {
            throw 'You must select or enter a country';
        }
        let countries = await this.#getCountriesByHistory(objData);
        const countryByNameExist = !!countries[objData.countryName];
        if (objData.countries.length === 0 && !countryByNameExist) {
            throw 'The entered country does not exist';
        }

        if (countryByNameExist) {
            objData.countries.push(objData.countryName);
        }

        countries = objData.countries.map(c => countries[c]);

        return this.#getRateObj(countries);
    }

    needUpdateDashboard() {
        return this.#needUpdate(this.#cases.timestamp);
    }

    async #getCountriesByHistory(objData) {
        let historyByDeath = await this.#getDeathHistory();
        const historyByConfirm = await this.#getConfirmHistory();
        const vaccineData = await this.#getVaccines();

        this.#validateDate(objData, historyByDeath);

        const dateFrom = objData.dateFrom;
        const dateTo = objData.dateTo;

        _.forEach(historyByDeath, (v, k) => {
            const deathsDates = v.All.dates;
            const confirmDates = historyByConfirm[k].All.dates;
            let vaccinated = 0;
            if (vaccineData[k]) {
                vaccinated = vaccineData[k].All.people_vaccinated;
            }
            historyByDeath[k] = {
                'namePlace': k,
                'deaths': deathsDates[dateTo] - deathsDates[dateFrom],
                'population': v.All.population,
                'confirmed': confirmDates[dateTo] - confirmDates[dateFrom],
                'vaccinated': vaccinated
            }
        });
        return historyByDeath;
    }

    #getRateObj(obj) {
        return _.map(obj, (v, k) => {
            let rateConfirmed = 0;
            let rateDeaths = 0;
            let rateVaccine = 0;
            if (v.population) {
                rateConfirmed = v.confirmed ? v.confirmed / v.population : 0;
                rateDeaths = v.deaths ? v.deaths / v.population : 0;
                rateVaccine = v.vaccinated ? v.vaccinated / v.population : 0;
            }
            return {
                'namePlace': v.namePlace,
                'rateConfirmed': (rateConfirmed * 100).toFixed(2),
                'rateDeaths': (rateDeaths * 100).toFixed(2),
                'rateVaccine': (rateVaccine * 100).toFixed(2)
            }
        });
    }

    async #getCases() {
        let cases = this.#cases;
        if (this.#needUpdate(cases.timestamp)) {
            cases.json = await this.#covidDataProvider.getLiveCasesData();
            cases.timestamp = new Date().getTime();
            delete cases.json['Global'];
        }
        let res = {};
        Object.assign(res, {...cases.json});
        return res;
    }

    async #getVaccines() {
        let vaccines = this.#vaccines;
        if (this.#needUpdate(vaccines.timestamp)) {
            vaccines.json = await this.#covidDataProvider.getVaccinesData();
            vaccines.timestamp = new Date().getTime();
            delete vaccines.json['Global'];
        }
        let res = {};
        Object.assign(res, {...vaccines.json});
        return res;
    }

    async #getDeathHistory() {
        let deathHistory = this.#deathHistory;
        if (this.#needUpdate(deathHistory.timestamp)) {
            deathHistory.json = await this.#covidDataProvider.getHistoryByDeath();
            deathHistory.timestamp = new Date().getTime();
            delete deathHistory.json['Global'];
        }
        let res = {};
        Object.assign(res, {...deathHistory.json});
        return res;
    }

    async #getConfirmHistory() {
        let confirmHistory = this.#confirmHistory;
        if (this.#needUpdate(confirmHistory.timestamp)) {
            confirmHistory.json = await this.#covidDataProvider.getHistoryByConfirm();
            confirmHistory.timestamp = new Date().getTime();
            delete confirmHistory.json['Global'];
        }
        let res = {};
        Object.assign(res, {...confirmHistory.json});
        return res;
    }

    #needUpdate(timestamp) {
        const curTime = new Date().getTime();
        if ((timestamp + TIME_TO_UPDATE_MILLIS) < curTime) {
            return true;
        }
        return false;
    }

    #validateNum(num, numName) {
        if (!num) {
            throw `Need to enter the number of ${numName}`;
        }
        if (num < 1) {
            throw `Number of ${numName} cannot be less than 1`;
        }
    }

    #validateDate(objData, historyObj) {
        let dates = historyObj[Object.keys(historyObj)[0]].All.dates;
        dates = Object.keys(dates);

        const maxDate = dates[0];
        const minDate = dates[dates.length - 1];

        if (!objData.dateFrom || objData.dateFrom < minDate) {
            objData.dateFrom = minDate;
        }
        if (!objData.dateFrom || objData.dateFrom > maxDate) {
            objData.dateTo = maxDate;
        }
    }
}



































