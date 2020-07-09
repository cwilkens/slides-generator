import { Component, OnInit } from '@angular/core';
import { SlideService } from './slide.service';
import * as Diff from 'diff';

@Component({
  selector: 'slides-text',
  templateUrl: './slides-text.component.html',
  styleUrls: ['./slides-text.component.css']
})
export class SlidesTextComponent implements OnInit {
  placeholder: string = "Type slide titles on each line";

  constructor(private slideService: SlideService) { }

  _slidesText: string;
  get slidesText(): string {
    return this.slideService.getSlides()
      .map(value => value.slideText)
      .join('\n');
  }
  set slidesText(value: string) {
    // split and separate and set all slides
    var changes: Diff.Change[] = Diff.diffChars(this.slidesText, value);
    var slideIndex: number = 0;
    changes.forEach(change => {
      if (change.added) {
        // if you have an enter in an added section, insert slide
        var newSlides = change.value.split('\n').length-1;
        for (let i = 0; i < newSlides; i++) {
          this.slideService.insertSlide(slideIndex);
        }
        slideIndex += change.value.split('\n').length-1;
      } 
      else if (change.removed) {
        // if you have an enter in a removed section, remove slide
        var removedSlides = change.value.split('\n').length-1;
        for (let i = 0; i < removedSlides; i++) {
          this.slideService.deleteSlide(slideIndex);
        }
      }
      else {
        slideIndex += change.value.split('\n').length-1;
      }
    });
    // only manipulate the slides, then overwrite all text
    var textArray: string[] = value.split('\n');
    var symbolArray: symbol[] = this.slideService.getSlides().map(slide => slide.id);

    for (let index = 0; index < textArray.length; index++) {
      var id;
      if (index < symbolArray.length) {
        id = symbolArray[index];
      } else {
        console.log("warning: had to add extra slide in slides-list.slidesText setter");
        id = this.slideService.addSlide().id;
      }
      this.slideService.setSlideText(id, textArray[index]);
    }
  }
  
  ngOnInit() {
  }

}
