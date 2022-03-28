export default class Spinner{
    #spinnerArea;
    constructor(idArea){
        if (!idArea){
            throw "Not correct id for spinner area";
        }
        this.#spinnerArea = document.getElementById(idArea);
        if (!this.#spinnerArea){
            throw `Spinner area not found with id ${idArea}`;
        }
    }
    start() {
        this.stop();
        this.#spinnerArea.innerHTML = `
        <div id="spinner-place" class="spinner-border text-primary m-1" role="status">
             <span class="visually-hidden">Loading...</span>
        </div>`;
    }
    stop(){
        const spinnerElement = document.getElementById("spinner-place");
        if (spinnerElement){
            spinnerElement.remove();
        }
    }
}