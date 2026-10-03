import { AfterViewInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowTab } from '../window/window';
import { WindowTitle } from '../window/window_tile';
import { WindowContent } from '../window/window_content';
import { CommentWidgetComponent, CommentWidgetConfig } from "./commentwidget.component";


@Component({
  selector: 'guestbook',
  styleUrl: './guestbook.scss',
  templateUrl: './guestbook.html',
  imports: [CommonModule, WindowTab, WindowTitle, WindowContent, CommentWidgetComponent, ],
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

    minConfig: Partial<CommentWidgetConfig> = {
            formId: '1FAIpQLScy0Pp9cZv6x5DQaH-sZh76AWOajdgk22TyE6m3_AvAfyC-ag',
            sheetId: '1PU7580P91oUyughufPFgcuYedeeCL5AdGOQBGMK1X1U',
            nameId: '1546618181', websiteId: '1598013439',
            textId: '1473080029', pageId: '1788050132', replyId: '501602633',
        };




}
