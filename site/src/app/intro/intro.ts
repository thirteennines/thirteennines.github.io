import { Component, OnInit } from '@angular/core'; // 1. Added OnInit import
import { CommonModule } from '@angular/common';
import { WindowTab } from '../window/window';
import { WindowTitle } from '../window/window_tile';
import { WindowContent } from '../window/window_content';

@Component({
  selector: 'intro',
  standalone: true,
  imports: [
    CommonModule,
    WindowTab,
    WindowTitle,
    WindowContent,
],
  templateUrl: './intro.html',
  styleUrls: ['./intro.scss']
})
export class Intro implements OnInit {

  isWindowVisible = true;
  isClosing = false;
  activeTab: 'home' | 'next' = 'home';
  closeable = false;

  accessibility = {
    highContrast: false,
    disableAnimations: false,
    dyslexicFont: false,
    largeText: false,
    grayscale: false
  };

  ngOnInit() {
    const savedSettings = localStorage.getItem('9x13_accessibility');
    if (savedSettings) {
      try {
        this.accessibility = JSON.parse(savedSettings);
        
        Object.keys(this.accessibility).forEach((key) => {
          const settingName = key as keyof typeof this.accessibility;
          if (this.accessibility[settingName]) {
            document.body.setAttribute(`data-${settingName}`, 'true');
          }
        });
      } catch (e) {
        console.error('Could not parse accessibility choices from storage:', e);
      }
    }
  }

  toggleSetting(setting: keyof typeof this.accessibility, isChecked: boolean) {
    this.accessibility[setting] = isChecked;
    
    if (isChecked) {
      document.body.setAttribute(`data-${setting}`, 'true');
    } else {
      document.body.removeAttribute(`data-${setting}`);
    }

    localStorage.setItem('9x13_accessibility', JSON.stringify(this.accessibility));
  }

  closeWindow() {
    this.isClosing = true;
  }

  destroyWindow() {
    this.isWindowVisible = false;
    this.isClosing = false; 
  }

  setActiveTab(tabName: 'home' | 'next') {
    this.activeTab = tabName;
  }
}