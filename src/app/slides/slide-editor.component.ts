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
    this.slideService.getCurrentSlideIdSubject().subscribe(id => {
      this.currentSlideId = id;
      this._slideText = this.slideService.getSlide(id).slideText;
      this.slideImage = this.slideService.getSlide(id).slideImage;
    });
    this.slideText = "demo text";
  }

  onFileAdded(event, currentSlideId) {
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
