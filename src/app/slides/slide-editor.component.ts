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
  
  _slideText: string;
  get slideText(): string {
      return this._slideText;
  }
  set slideText(value: string) {
      this._slideText = value;
      this.slideService.setSlideText(this.currentSlide.id, value);
      // handle that slide not existing
  }

  constructor(private slideService: SlideService) { 
  }

  ngOnInit() {
    // add a slide because there's currently none
    this.slideService.addSlide();
    this.currentSlide = this.slideService.getSlide(0);
    // switch to some sort of service observable for when the selected slide to edit changes?
    this.slideText = "demo text";
  }

}
