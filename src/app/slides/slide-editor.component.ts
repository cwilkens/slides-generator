import { Component, OnInit, ApplicationRef } from '@angular/core';
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

  constructor(private slideService: SlideService, private application: ApplicationRef) { }

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
      
      xhr.responseType = 'text';
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      const editor = this;
      xhr.onload = function() {
        const data: string = this.response.toString();
        const images = data.split('\n');
        editor.thumbnails = images;
      };
      xhr.send();
    });
  }

  onClickThumbnail(index: number) {
    const slideId = this.currentSlide.id;
    const searchText = encodeURIComponent(this.currentSlide.slideText);
    const xhr = new XMLHttpRequest();
    xhr.open('get', "https://instant-slides.herokuapp.com/search/?search="+searchText+"&i="+index, true);
    
    xhr.responseType = 'blob';
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    const editor = this;
    xhr.onload = function() {
      editor.readFile(this.response).then(fileContents => {
        editor.slideService.setSlideImage(slideId, fileContents.toString());
        editor.application.tick();
      });
    };
    xhr.send();
  }

  // todo: dedup this (also in slide component)
  private async readFile(file: File | Blob): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };
  
      reader.onerror = e => {
        console.error(`FileReader failed on file ${file}.`);
        return reject(null);
      };
  
      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }
  
      reader.readAsDataURL(file);
    });
  }
}
