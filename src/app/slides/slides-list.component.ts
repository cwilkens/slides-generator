import { Component, OnInit } from '@angular/core';
import { ISlide } from './slides';
import { SlideService } from './slide.service';

@Component({
  selector: 'slides-list',
  templateUrl: './slides-list.component.html',
  styleUrls: ['./slides-list.component.css']
})
export class SlidesListComponent implements OnInit {
  slides: ISlide[] = [];
  currentSlideId: symbol;

  constructor(private slideService: SlideService) { }

  _slidesText: string;
  get slidesText(): string {
    return this.slideService.getSlides()
      .map(value => value.slideText)
      .join('\n');
  }
  set slidesText(value: string) {
    // split and separate and set all slides
    var textArray: string[] = value.split('\n');
    var symbolArray: symbol[] = this.slideService.getSlides().map(slide => slide.id);

    for (let index = 0; index < textArray.length; index++) {
      var id;
      if (index < symbolArray.length) {
        id = symbolArray[index];
      } else {
        id = this.slideService.addSlide().id;
      }
      this.slideService.setSlideText(id, textArray[index]);
    }
  }

  ngOnInit() {
    this.updateSlides();
    // get current slide Subject from service
    this.slideService.getCurrentSlideIdSubject().subscribe(id => {
      this.currentSlideId = id;
    });
  }

  updateSlides(): void {
    this.slides = this.slideService.getSlides();
  }

  addSlide(): void {
    var newSlide = this.slideService.addSlide();
    this.slideService.setCurrentSlide(newSlide.id);
    this.updateSlides();
  }

  selectSlide(slide: ISlide): void {
    this.slideService.setCurrentSlide(slide.id);
  }
}
