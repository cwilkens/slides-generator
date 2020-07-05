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

  constructor(private slideService: SlideService) { 
  }

  ngOnInit() {
    // get current slide Subject from service
    this.slideService.getCurrentSlideSubject().subscribe(slide => {
      this.currentSlideId = slide.id;
      this._slideText = slide.slideText;
      this.slideImage = slide.slideImage;
    });
    this.slideText = "demo text";
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
        if (this.currentSlideId == currentSlideId) {
          this.slideImage = fileContents.toString();
        }
      });
    }
  }


  onFileAdded(event: any, currentSlideId: symbol) {
    this.readFile(event.addedFiles[0]).then(fileContents => {
      this.slideService.setSlideImage(currentSlideId, fileContents.toString());
      if (this.currentSlideId == currentSlideId) {
        this.slideImage = fileContents.toString();
      }
    });
  }
  
  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };
  
      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
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
