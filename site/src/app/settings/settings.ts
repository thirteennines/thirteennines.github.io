import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowTab } from '../window/window';
import { WindowTitle } from '../window/window_tile';
import { WindowContent } from '../window/window_content';

type AccessibilitySetting = 'highContrast' | 'disableAnimations' | 'dyslexicFont' | 'largeText' | 'grayscale';

interface AccessibilityConfig {
  highContrast: boolean;
  disableAnimations: boolean;
  dyslexicFont: boolean;
  largeText: boolean;
  grayscale: boolean;
}

@Component({
  selector: 'settings',
  standalone: true,
  imports: [CommonModule, WindowTab, WindowTitle, WindowContent],
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss']
})
export class Settings {
  @Input() accessibility!: AccessibilityConfig;
  @Input() isClosing: boolean = false;


  @Output() onToggleSetting = new EventEmitter<{ setting: AccessibilitySetting; isChecked: boolean }>();
  @Output() onCloseWindow = new EventEmitter<void>();
  @Output() onAnimationFinished = new EventEmitter<void>();

  emitToggle(settingName: AccessibilitySetting, isChecked: boolean) {
    this.onToggleSetting.emit({ setting: settingName, isChecked });
  }

  close() {
    this.onCloseWindow.emit();
  }

  animationDone() {
    this.onAnimationFinished.emit();
  }
}