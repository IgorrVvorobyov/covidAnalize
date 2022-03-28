export default class AlertHandler {
    #alertElement;
    constructor(alertId) {
        this.#alertElement = document.getElementById(alertId);
    }
    setAlert(msg){
        const alert = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error!</strong>
                <ul>
                ${msg}
                </ul>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
        this.#alertElement.innerHTML = alert;
    }
    clearAlert() {
        this.#alertElement.innerHTML = '';
    }
}