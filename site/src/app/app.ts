import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements AfterViewInit {
  // Track active page tab state natively
  activeTab: 'home' | 'next' = 'home';

  // Get safe DOM hooks to avoid absolute document searching
  @ViewChild('setupWindow') setupWindow!: ElementRef<HTMLDivElement>;
  @ViewChild('windowHeader') windowHeader!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.makeElementDraggable(this.setupWindow.nativeElement, this.windowHeader.nativeElement);
  }

  setActiveTab(tabName: 'home' | 'next') {
    this.activeTab = tabName;
  }

  closeWindow() {
    this.setupWindow.nativeElement.style.display = 'none';
  }

  private makeElementDraggable(elmnt: HTMLDivElement, header: HTMLDivElement) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    header.onmousedown = (e: MouseEvent) => {
      e = e || window.event;
      e.preventDefault();
      // Cursor startup positions
      pos3 = e.clientX;
      pos4 = e.clientY;
      
      document.onmouseup = () => {
        document.onmouseup = null;
        document.onmousemove = null;
      };

      document.onmousemove = (moveEvent: MouseEvent) => {
        moveEvent = moveEvent || window.event;
        moveEvent.preventDefault();
        // Shift calculations
        pos1 = pos3 - moveEvent.clientX;
        pos2 = pos4 - moveEvent.clientY;
        pos3 = moveEvent.clientX;
        pos4 = moveEvent.clientY;
        
        // Render updated coordinates
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      };
    };
  }
}