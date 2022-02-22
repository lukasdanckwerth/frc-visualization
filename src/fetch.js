import { Corpus } from ".";

export function fetchCorpus(progress, url) {
    return new Promise(function (resolve, reject) {
        if (typeof progress !== "function") progress = function () {};

        let xhr = new XMLHttpRequest();
        xhr.open("GET", url || "./assets/corpus.json");

        xhr.onprogress = function (event) {
            progress(event.loaded, event.total);
        };

        xhr.onload = function (event) {
            progress(event.total, event.total);

            if (xhr.status != 200) {
                reject(`Error ${xhr.status}: ${xhr.statusText}`);
            } else {
                resolve(new Corpus(JSON.parse(xhr.response)));
            }
        };

        xhr.send();
    });
}
