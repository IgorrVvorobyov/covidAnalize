export default class Navigator {
    #navigatorElement;
    constructor(idNavigator) {
        this.#navigatorElement = document.getElementById(idNavigator);
        if (!this.#navigatorElement) {
            throw "Wrong id of navigator element";
        }
    }
    getActiveTab() {
        return this.#navigatorElement.querySelector(".active")?.id;
    }
    isTabActive(id) {
        const tab = document.getElementById(id);
        return tab?.classList.contains('active');
    }
}