import CovidRest from "../services/covid-rest";

const URL = 'https://covid-api.mmediagroup.fr/v1/';
export const covidDataProvider = new CovidRest(URL);