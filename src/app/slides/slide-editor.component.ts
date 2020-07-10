import { Component, OnInit, ApplicationRef } from '@angular/core';
import { ISlide } from './slides';
import { SlideService } from './slide.service';

@Component({
  selector: 'slide-editor',
  templateUrl: './slide-editor.component.html',
  styleUrls: ['./slide-editor.component.css']
})
export class SlideEditorComponent implements OnInit {
  currentSlideId: symbol;
  slideImage: string;

  _slideText: string;
  get slideText(): string {
      return this._slideText;
  }
  set slideText(value: string) {
      this._slideText = value;
      this.slideService.setSlideText(this.currentSlideId, value);
      // handle that slide not existing
  }

  constructor(private slideService: SlideService, private application: ApplicationRef) { 
  }

  ngOnInit() {
    // get current slide Subject from service
    this.slideService.getCurrentSlideSubject().subscribe(slide => {
      this.currentSlideId = slide.id;
      this._slideText = slide.slideText;
      this.slideImage = slide.slideImage;
    });
  }

  onDrop(event: any, currentSlideId: symbol) {
    if (event.dataTransfer.items && event.dataTransfer.items[0].kind == "string") {
      event.dataTransfer.items[0].getAsString((url: string) => {
        const xhr = new XMLHttpRequest();
        xhr.open('get', "https://cors-anywhere.herokuapp.com/"+url, true);

        xhr.responseType = 'blob';
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        const editor = this;
        xhr.onload = function() {
          editor.readFile(this.response).then(fileContents => {
            editor.slideService.setSlideImage(currentSlideId, fileContents.toString());
            editor.application.tick();
          });
        };
        xhr.send();
      });
    }
  }

  onPaste(event: any, currentSlideId: symbol) {
    const items = event.clipboardData.items;
    var file = null;

    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        file = item.getAsFile();
      }
    }
    // load image if there is a pasted image
    if (file !== null) {
      this.readFile(file).then(fileContents => {
        this.slideService.setSlideImage(currentSlideId, fileContents.toString());
      });
    }
  }


  onFileAdded(event: any, currentSlideId: symbol) {
    if (event.addedFiles.length) {
      this.readFile(event.addedFiles[0]).then(fileContents => {
        this.slideService.setSlideImage(currentSlideId, fileContents.toString());
      });
    }
  }
  
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
