import { Injectable } from '@angular/core';
import { ArgumentOutOfRangeError, BehaviorSubject } from 'rxjs';

import { ISlide } from './slides';

@Injectable({
    providedIn: 'root'
})
export class SlideService {
    private slides: ISlide[];

    private currentSlideIdSubject: BehaviorSubject<symbol>;
    private _currentSlideId: symbol;
    get currentSlideId(): symbol {
        return this._currentSlideId;
    }
    set currentSlideId(value: symbol) {
        this._currentSlideId = value;
        if (typeof this.currentSlideIdSubject === 'undefined') {
            this.currentSlideIdSubject = new BehaviorSubject(this.currentSlideId);
        } else {
            this.currentSlideIdSubject.next(this._currentSlideId);
        }
    }

    constructor() {
        this.slides = [];
        this.currentSlideId = this.addSlide().id;
        this.currentSlideIdSubject = new BehaviorSubject(this.currentSlideId);
    }

    getSlides(): ISlide[] {
        return this.slides;
    }

    getSlide(id: symbol): ISlide {
        var index = this.slides.findIndex((value, index, obj) => value.id == id);
        if (index == -1) {
            // deal with slide being deleted while open in editor (i.e. set on missing slide)
        }
        return this.slides[index];
    }

    getCurrentSlideIdSubject(): BehaviorSubject<symbol> {
        return this.currentSlideIdSubject;
    }

    setCurrentSlide(id: symbol) {
        // bounds check that the slide exists
        if (this.slides.find((value) => value.id == id) !== undefined) {
            this.currentSlideId = id;
        }
    }

    setSlideText(id: symbol, text: string) {
        var index = this.slides.findIndex((value) => value.id == id);
        if (index == -1) {
            // deal with slide being deleted while open in editor (i.e. set on missing slide)
        }
        this.slides[index].slideText = text;
    }

    setSlideImage(id: symbol, base64image: string) {
        var index = this.slides.findIndex((value) => value.id == id);
        if (index == -1) {
            // deal with slide being deleted while open in editor (i.e. set on missing slide)
        }
        this.slides[index].slideImage = base64image;
    }

    addSlide(): ISlide {
        this.slides.push({
            id: Symbol()
        } as ISlide);
        return this.slides[this.slides.length-1];
    }

    insertSlide(index: number) {
        this.slides.splice(index, 0, {
            id: Symbol()
        } as ISlide);
    }

    deleteSlide(index: number) {
        this.slides.splice(index, 1);
    }
}