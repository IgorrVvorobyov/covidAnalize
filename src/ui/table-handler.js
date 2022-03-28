import _ from "lodash";

function fillTableHeader(headerElement, keys) {
    headerElement.innerHTML = '<th>#</th>';
    headerElement.innerHTML += getColumns(keys);
}
function getColumns(keys) {
    const ths = _.map(keys, v => `<th>${v}</th>`);
    return ths.join("");
}
export default class TableHandler {
    #keys;
    #bodyElement;
    #numRow = 1;
    constructor(idHeader, idBody, keys) {
        this.#keys = keys;
        const headerElement = document.getElementById(idHeader);
        if (!headerElement) {
            throw "Wrong table header";
        }
        this.#bodyElement = document.getElementById(idBody);
        if (!this.#bodyElement) {
            throw "Wrong table body placeholder";
        }
        fillTableHeader(headerElement, keys);
    }
    clear() {
        this.#bodyElement.innerHTML = '';
        this.#numRow = 1;
    }
    addRow(obj) {
        this.#bodyElement.innerHTML += `<tr><td>${this.#numRow++}</td>${this.#getRecordData(obj)}</tr>`;
    }
    #getRecordData(obj) {
        const tds = _.map(this.#keys, (v, k) => `<td>${obj[k]}</td>`);
        return tds.join("");
    }
}