import { Component, OnInit, Input, ApplicationRef, ViewChild } from '@angular/core';
import { ISlide } from '../slides/slides';
import { SlideService } from '../slides/slide.service';
import { NgxDropzoneComponent } from 'ngx-dropzone';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.css']
})
export class SlideComponent implements OnInit {
  @Input() slide: ISlide;
  @ViewChild(NgxDropzoneComponent) dropzone: NgxDropzoneComponent;

  constructor(private slideService: SlideService, private application: ApplicationRef) { }

  ngOnInit(): void {
  }

  showFileSelector() {
    this.dropzone.showFileSelector();
  }

  onDrop(event: any, currentSlideId: symbol) {
    if (event.dataTransfer.items && event.dataTransfer.items[0].kind == "string") {
      event.dataTransfer.items[0].getAsString((url: string) => {
        const xhr = new XMLHttpRequest();
        xhr.open('get', "https://instant-slides.herokuapp.com/proxy/"+url, true);

        xhr.responseType = 'blob';
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        const slide = this;
        xhr.onload = function() {
          slide.readFile(this.response).then(fileContents => {
            slide.slideService.setSlideImage(currentSlideId, fileContents.toString());
            slide.application.tick();
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
