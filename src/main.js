import CovidAnalyze from "./services/covid-analyze";
import AlertHandler from "./ui/alert";
import Spinner from "./ui/spinner";
import Navigator from "./ui/navigator";
import TableHandler from "./ui/table-handler";
import FormHandler from "./ui/form-handler";
import covidData from "../src/config/covidData.json"
import {covidDataProvider} from "./config/serviceConfig";

const covidAnalyze = new CovidAnalyze(covidDataProvider);
const alert = new AlertHandler('alert-place');
const spinner = new Spinner('alert-place');
const navigator = new Navigator('nav-tab');

const rateHeaderElems = {
    'namePlace': 'Continent',
    'rateConfirmed': 'Rate of confirmed cases(%)',
    'rateDeaths': 'Rate of deaths(%)',
    'rateVaccine': 'Rate of vaccine(%)'
}

async function displayCountries(getCountriesFun, table, datePlaceId, obj) {
    spinner.start();
    try {
        console.log(getCountriesFun);
        const countries = await getCountriesFun.call(covidAnalyze, obj);
        table.clear();
        const datePlace = document.getElementById(datePlaceId);
        datePlace.querySelector('#dateFrom').innerHTML = 'Date from: ' + obj.dateFrom;
        datePlace.querySelector('#dateTo').innerHTML = 'Date to: ' + obj.dateTo;
        countries.forEach(table.addRow.bind(table));
    } catch (err) {
        alert.setAlert(err);
    }
    spinner.stop();
}

const dashboardTable = new TableHandler('dash-header', 'dash-body', rateHeaderElems);

async function fillDashboard() {
    spinner.start();
    try {
        dashboardTable.clear();
        const continentsData = await covidAnalyze.getContinentData();
        continentsData.forEach(dashboardTable.addRow.bind(dashboardTable));
    } catch (err) {
        alert.setAlert(err);
    }
    spinner.stop();
}
fillDashboard();

const worstBestTable = new TableHandler('worst-best-header', 'worst-best-body', rateHeaderElems);

const worstBestForm = new FormHandler('worstBestCountries-form');

const getWorstBestCountries = covidAnalyze.getWorstBestCountries;

const worstBestHandler = displayCountries.bind(this, getWorstBestCountries, worstBestTable, 'worst-best-date');

worstBestForm.addHandler(worstBestHandler);

const countryListTable = new TableHandler('country-list-header', 'country-list-body', rateHeaderElems);

const countryListForm = new FormHandler('country-list-form', 'checkbox-place', covidData.countries);

const getDataByCountry = covidAnalyze.getDataByCountries;

const countryListHandler = displayCountries.bind(this, getDataByCountry, countryListTable, 'country-list-date');

countryListForm.addHandler(countryListHandler);

async function poller() {
    if(isDashboardActive()) {
        if(covidAnalyze.needUpdateDashboard()) {
            fillDashboard();
        }
    }
}

function isDashboardActive() {
    return navigator.getActiveTab() === 'dashboard-tab';
}

setInterval(poller, covidData.pollerInterval);




























