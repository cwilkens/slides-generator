import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SlideEditorComponent } from './slides/slide-editor.component';
import { SlidesListComponent } from './slides/slides-list.component';
import { SlidesTextComponent } from './slides/slides-text.component';

@NgModule({
  declarations: [
    AppComponent,
    SlideEditorComponent,
    SlidesListComponent,
    SlidesTextComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxDropzoneModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
