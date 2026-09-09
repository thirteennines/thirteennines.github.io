import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'window',
  standalone: true,
  templateUrl: './window.html',
  styleUrls: ['./window.scss'],
})
export class WindowTab implements AfterViewInit {
  @Input() windowId: string = 'setupWindow';
  @Input() closeable: boolean = false; 
  @Output() close = new EventEmitter<void>();
  
  @Input() isClosing: boolean = false; 
  @Output() animationFinished = new EventEmitter<void>();

  @ViewChild('setupWindow') setupWindow!: ElementRef<HTMLDivElement>;
  @ViewChild('windowHeader') windowHeader!: ElementRef<HTMLDivElement>;
  onAnimationEnd() {
    if (this.isClosing) {
      this.animationFinished.emit();
    }
  }

  ngAfterViewInit() {
    this.makeElementDraggable(this.setupWindow.nativeElement, this.windowHeader.nativeElement);
  }

  private makeElementDraggable(elmnt: HTMLDivElement, header: HTMLDivElement) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    header.onmousedown = (e: MouseEvent) => {
      e = e || window.event;
      e.preventDefault();

      pos3 = e.clientX;
      pos4 = e.clientY;

      document.onmouseup = () => {
        document.onmouseup = null;
        document.onmousemove = null;
      };

      document.onmousemove = (moveEvent: MouseEvent) => {
        moveEvent = moveEvent || window.event;
        moveEvent.preventDefault();

        pos1 = pos3 - moveEvent.clientX;
        pos2 = pos4 - moveEvent.clientY;
        pos3 = moveEvent.clientX;
        pos4 = moveEvent.clientY;

        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      };
    };
  }
}