import { Component, OnInit } from '@angular/core';
import pptxgen from "pptxgenjs";
import { SlideService } from './slides/slide.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  pageTitle = 'slides-generator';

  constructor(private slideService: SlideService) { }

  ngOnInit(): void {
    window.addEventListener("dragover", e => {
      e && e.preventDefault();
    }, false);
    window.addEventListener("drop", e => {
      e && e.preventDefault();
    }, false);
  }

  async onExport() {
    const slides = this.slideService.getSlides();
    const pptx = new pptxgen();

    for (let index = 0; index < slides.length; index++) {
      const slide = slides[index];
      const pptSlide = pptx.addSlide();

      const image = new Image();
      image.src = slide.slideImage;
      await image.decode();

      pptSlide.addImage({
        data:slide.slideImage,
        x:0, y:0, w: image.naturalWidth/100, h: image.naturalHeight/100,
        sizing: {type: 'cover', w: 10, h: 5.625}
      })
      pptSlide.addShape(pptx.ShapeType.rect, { x:0, y:'74.074%', w:'100%', h:'18.518%', fill:'4D4D4D' });
      pptSlide.addShape(pptx.ShapeType.line, { x:0, y:'76.8518%', w:'100%', h:0, line:'838383', lineSize:1 });
      pptSlide.addShape(pptx.ShapeType.line, { x:'9.89583%', y:'74.074%', w:0, h:'18.518%', line:'838383', lineSize:1 });

      pptSlide.addText(slide.slideText, { x:'10.4583%', y:'75.3518%', w:'100%', h:'17.018%', fontFace: "Arial", fontSize: 36, color: "F0F0F0" });
    }
    
    pptx.writeFile('Presentation');
  }
}
