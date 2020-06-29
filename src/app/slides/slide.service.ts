import { Injectable } from '@angular/core';
import { ArgumentOutOfRangeError } from 'rxjs';

import { ISlide } from './slides';

@Injectable({
    providedIn: 'root'
})
export class SlideService {
    private slides: ISlide[];

    constructor() {
        this.slides = [];
    }

    getSlides(): ISlide[] {
        return this.slides;
    }

    getSlide(index: number): ISlide {
        if (index < 0 || index >= this.slides.length) {
            throw ArgumentOutOfRangeError;
        }
        return this.slides[index];
    }

    setSlideText(id: symbol, text: string) {
        var index = this.slides.findIndex((value, index, obj) => value.id == id);
        if (index == -1) {
            // deal with slide being deleted while open in editor (i.e. set on missing slide)
        }
        this.slides[index].slideText = text;
    }

    addSlide(): ISlide {
        this.slides.push({
            id: Symbol()
        } as ISlide);
        return this.slides[length-1];
    }
}