import {value} from "lodash/seq";

export default class FormHandler {
    #formElement
    #inputElements

    constructor(idForm, checkboxPlace, checkboxList) {
        this.#formElement = document.getElementById(idForm);
        if(!this.#formElement) {
            throw 'Wrong form id'
        }
        if(checkboxPlace && checkboxList) {
            this.#fillCheckboxes(checkboxPlace, checkboxList);
        }
        this.#inputElements = document.querySelectorAll(`#${idForm} [name]`);
        if(!this.#inputElements || this.#inputElements.getElementById === 0) {
            throw 'Wrong form content'
        }
        this.#inputElements = Array.from(this.#inputElements);
    }

    addHandler(handlerFn) {
        this.#formElement.addEventListener('submit', this.#onSubmit.bind(this, handlerFn));
    }

    async #onSubmit(handlerFn, event) {
        event.preventDefault();
        const obj = this.#inputElements.reduce(createObject, {});
        await handlerFn(obj);
        this.#formElement.reset();
    }

    #fillCheckboxes(placeId, values) {
        const checkboxPlace = document.getElementById(placeId);
        if(!checkboxPlace) {
            throw 'Wrong checkbox place id'
        }
        checkboxPlace.innerHTML = getCheckboxes(values).join('');
    }

    static fillOptions(idSelect, options) {
        const selectElement = document.getElementById(idSelect);
        if(!selectElement) {
            throw 'Wrong id select'
        }
        selectElement.innerHTML += getOptions(options);
    }
}

function createObject(obj, element) {
    switch (element.type) {
        case 'radio':
            if(element.checked) {
                obj[element.name] = element.value;
            } break;
        case 'checkbox':
            if(!obj[element.name]) {
                obj[element.name] = [];
            }
            if(!element.checked) {
                obj[element.name].push(element.value);
            } break;
        default: obj[element.name] = element.value;
    }
    return obj;
}

function getOptions(options) {
    return options.map(e => `<option value="${e}">${e}</option>`);
}

function getCheckboxes(values) {
    return values.map(c => `<div class="form-check">
    <label class="form-check-label" for="${c}">${c}</label>
    <input type="checkbox" class="form-check-input" id="${c}" name="countries" value="${c}"></div>`);
}


























