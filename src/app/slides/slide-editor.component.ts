import { Component, OnInit } from '@angular/core';
import { ISlide } from './slides';
import { SlideService } from './slide.service';

@Component({
  selector: 'slide-editor',
  templateUrl: './slide-editor.component.html',
  styleUrls: ['./slide-editor.component.css']
})
export class SlideEditorComponent implements OnInit {
  currentSlideId: symbol;
  
  _slideText: string;
  get slideText(): string {
      return this._slideText;
  }
  set slideText(value: string) {
      this._slideText = value;
      this.slideService.setSlideText(this.currentSlideId, value);
      // handle that slide not existing
  }

  constructor(private slideService: SlideService) { 
  }

  ngOnInit() {
    // get current slide Subject from service
    this.slideService.getCurrentSlideIdSubject().subscribe(id => {
      this.currentSlideId = id;
      this._slideText = this.slideService.getSlide(id).slideText;
    });
    this.slideText = "demo text";
  }
}
