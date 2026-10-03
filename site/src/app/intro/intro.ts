import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowTab } from '../window/window'; 
import { WindowContent } from '../window/window_content';
import { WindowTitle } from '../window/window_tile';

type AccessibilitySetting = 'highContrast' | 'disableAnimations' | 'dyslexicFont' | 'largeText' | 'grayscale';

@Component({
  selector: 'intro',
  standalone: true,
  imports: [CommonModule, WindowTab, WindowContent, WindowTitle], 
  templateUrl: './intro.html',
  styleUrls: ['./intro.scss']
})
export class Intro {
  @Input() isClosing = false;
  @Input() accessibility: any;
  
  @Output() wizardComplete = new EventEmitter<void>();
  @Output() toggleSetting = new EventEmitter<{ setting: AccessibilitySetting; isChecked: boolean }>();
  @Output() animationFinished = new EventEmitter<void>();

  activeTab: 'home' | 'next' = 'home';

  setActiveTab(tab: 'home' | 'next') {
    this.activeTab = tab;
  }

  emitToggle(setting: AccessibilitySetting, isChecked: boolean) {
    this.toggleSetting.emit({ setting, isChecked });
  }

  close() {
    this.wizardComplete.emit();
  }

  animationDone() {
    this.animationFinished.emit();
  }
}