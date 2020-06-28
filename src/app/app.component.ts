import { Component } from '@angular/core';
import pptxgen from "pptxgenjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pageTitle = 'slides-generator';

  onClick(){
    var pptx = new pptxgen();
    var slide = pptx.addSlide();
    slide.addText('Hello World!', { x: 1.5, y: 1.5, fontSize: 18, color: '363636' });
    pptx.writeFile('Sample Presentation');
  }
}
