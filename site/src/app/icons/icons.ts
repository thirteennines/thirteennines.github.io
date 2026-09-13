import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'icon',
  standalone: true,
  imports: [],
  templateUrl: './icons.html',
  styleUrl: './icons.scss'
})
export class Icons {
  @Input() windowId: string = ''; 
  @Output() iconClicked = new EventEmitter<string>();
  @Input() name: string = 'nya';
  @Input() picture: string = '🐈';


  showWindow(windowString : string) {
    if (windowString) {
      this.iconClicked.emit(windowString);
    }
  }
}