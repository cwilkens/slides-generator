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

  constructor(private slideService: SlideService) { }

  ngOnInit() {
    this.updateSlides();
  }

  updateSlides(): void {
    this.slides = this.slideService.getSlides();
  }

  addSlide(): void {
    this.slideService.addSlide();
    this.updateSlides();
  }
}
