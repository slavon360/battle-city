export default class Sprite {
    src: string;
    image: HTMLImageElement;

    constructor(src: string) {
        this.src = src;
        this.image = new Image();
    }

    load() {
        return new Promise((resolve, reject) => {
            this.image.src = this.src;
            this.image.addEventListener('load', () => {
                resolve(this);
            });
            this.image.addEventListener('error', (err) => {
                reject(err);
            })
        });
    }
}