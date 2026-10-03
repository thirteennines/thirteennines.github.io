import { AfterViewInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowTab } from '../window/window';
import { WindowTitle } from '../window/window_tile';
import { WindowContent } from '../window/window_content';


@Component({
  selector: 'app-guestbook',
  styleUrl: './guestbook.scss',
  templateUrl: './guestbook.html',
  imports: [CommonModule, WindowTab, WindowTitle, WindowContent],
})

export class Guestbook{


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
