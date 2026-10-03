import { AfterViewInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowTab } from '../window/window';
import { WindowTitle } from '../window/window_tile';
import { WindowContent } from '../window/window_content';
@Component({
  imports: [CommonModule, WindowTab, WindowTitle, WindowContent],
  selector: 'app-template',
  styleUrl: './template.scss',
  templateUrl: './template.html',
})
export class Template {

  @Input() isClosing: boolean = false;

  @Output() onCloseWindow = new EventEmitter<void>();
  @Output() onAnimationFinished = new EventEmitter<void>();


  close() {
    this.onCloseWindow.emit();
  }

  animationDone() {
    this.onAnimationFinished.emit();
  }


}
