// intro.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowTab } from '../window/window';
import { WindowTitle } from '../window/window_tile';
import { WindowContent } from '../window/window_content';

// Explicitly define the allowed keys to match App exactly
type AccessibilitySetting = 'highContrast' | 'disableAnimations' | 'dyslexicFont' | 'largeText' | 'grayscale';

interface AccessibilityConfig {
  highContrast: boolean;
  disableAnimations: boolean;
  dyslexicFont: boolean;
  largeText: boolean;
  grayscale: boolean;
}

@Component({
  selector: 'intro',
  standalone: true,
  imports: [CommonModule, WindowTab, WindowTitle, WindowContent],
  templateUrl: './intro.html',
  styleUrls: ['./intro.scss']
})
export class Intro {
  @Input() accessibility!: AccessibilityConfig;
  @Input() isClosing: boolean = false;

  // FIXED: Tied event payload type strictly to AccessibilitySetting instead of a generic string
  @Output() onToggleSetting = new EventEmitter<{ setting: AccessibilitySetting; isChecked: boolean }>();
  @Output() onCloseWindow = new EventEmitter<void>();
  @Output() onAnimationFinished = new EventEmitter<void>();

  activeTab: 'home' | 'next' = 'home';

  setActiveTab(tabName: 'home' | 'next') {
    this.activeTab = tabName;
  }

  // FIXED: Explicitly typed the settingName parameter
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