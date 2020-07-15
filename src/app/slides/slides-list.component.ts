import { Component, OnInit } from '@angular/core';
import { ISlide } from './slides';
import { SlideService } from './slide.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'slides-list',
  templateUrl: './slides-list.component.html',
  styleUrls: ['./slides-list.component.css']
})
export class SlidesListComponent implements OnInit {
  slides: ISlide[] = [];
  currentSlideId: symbol;

  constructor(private slideService: SlideService) { }

  ngOnInit() {
    this.updateSlides();
    // get current slide Subject from service
    this.slideService.getCurrentSlideSubject().subscribe(slide => {
      this.currentSlideId = slide.id;
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

  // type is the actual html content, or cdkDropListData if set 
  onDropListDropped(event: CdkDragDrop<HTMLElement>) {
    this.slideService.moveSlide(event.previousIndex, event.currentIndex);
  }
}
