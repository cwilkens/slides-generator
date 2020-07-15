import { Component, OnInit } from '@angular/core';
import { ISlide } from './slides';
import { SlideService } from './slide.service';

@Component({
  selector: 'slide-editor',
  templateUrl: './slide-editor.component.html',
  styleUrls: ['./slide-editor.component.css']
})
export class SlideEditorComponent implements OnInit {
  currentSlide: ISlide;

  constructor(private slideService: SlideService) { 
  }

  ngOnInit() {
    // get current slide Subject from service
    this.slideService.getCurrentSlideSubject().subscribe(slide => {
      this.currentSlide = slide;
    });
  }
}
