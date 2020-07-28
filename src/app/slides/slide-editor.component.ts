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
  thumbnails: string[] = ["", "", ""];

  constructor(private slideService: SlideService) { 
  }

  ngOnInit() {
    // get current slide Subject from service
    this.slideService.getCurrentSlideSubject().subscribe(slide => {
      let oldId: symbol = this.currentSlide?.id || Symbol();
      this.currentSlide = slide;

      // throttle for now by only searching when the slide changes
      // ideally a delayed "edited" timer, roughly 1 sec after the last edit (edits reset it)
      let searchText = encodeURIComponent(slide.slideText);
      if (oldId == slide.id || !searchText || !(/\S/.test(searchText))) {
        return;
      }
      // clear out existing images
      this.thumbnails = [];
      const xhr = new XMLHttpRequest();
      xhr.open('get', "https://instant-slides.herokuapp.com/search/?search="+searchText, true);
      
      console.log("searching: "+searchText);
      xhr.responseType = 'text';
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      const editor = this;
      xhr.onload = function() {
        console.log("receiving: "+searchText);
        const data: string = this.response.toString();
        const images = data.split('\n');
        editor.thumbnails = images;
      };
      xhr.send();
    });
  }
}
