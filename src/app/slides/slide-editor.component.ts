import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'slide-editor',
  templateUrl: './slide-editor.component.html',
  styleUrls: ['./slide-editor.component.css']
})
export class SlideEditorComponent implements OnInit {

  _slideText: string;
  get slideText(): string {
      return this._slideText;
  }
  set slideText(value: string) {
      this._slideText = value;
      // update future data structure here
  }

  constructor() { 
    this.slideText = "demo text";
  }

  ngOnInit() {
  }

}
