import { Component } from '@angular/core';

@Component({
  selector: 'windowcontent',
  standalone: true,
  template: `<ng-content></ng-content>`
})
export class WindowContent {}