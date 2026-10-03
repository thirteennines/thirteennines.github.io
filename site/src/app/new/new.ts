import { AfterViewInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowTab } from '../window/window';
import { WindowTitle } from '../window/window_tile';
import { WindowContent } from '../window/window_content';
@Component({
  imports: [CommonModule, WindowTab, WindowTitle, WindowContent],
  selector: 'new',
  styleUrl: './new.scss',
  templateUrl: './new.html',
})
export class New {
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
