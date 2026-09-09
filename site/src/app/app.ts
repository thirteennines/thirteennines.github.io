import { Component, OnInit } from '@angular/core'; // 1. Added OnInit import
import { CommonModule } from '@angular/common';
import { WindowTab } from './window/window';
import { WindowTitle } from './window/window_tile';
import { WindowContent } from './window/window_content';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    WindowTab,
    WindowTitle,
    WindowContent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit { // 2. Implement OnInit

  isWindowVisible = true;
  isClosing = false;
  activeTab: 'home' | 'next' = 'home';
  closeable = false;

  // Configuration settings tracking state
  accessibility = {
    highContrast: false,
    disableAnimations: false,
    dyslexicFont: false,
    largeText: false,
    grayscale: false
  };

  // 3. Load preferences from the browser storage on boot
  ngOnInit() {
    const savedSettings = localStorage.getItem('9x13_accessibility');
    if (savedSettings) {
      try {
        this.accessibility = JSON.parse(savedSettings);
        
        // Apply the saved state directly to the <body> tags for rendering
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

  // 4. Update the toggle method to persist data changes instantly
  toggleSetting(setting: keyof typeof this.accessibility, isChecked: boolean) {
    this.accessibility[setting] = isChecked;
    
    // Manage DOM attribute layer
    if (isChecked) {
      document.body.setAttribute(`data-${setting}`, 'true');
    } else {
      document.body.removeAttribute(`data-${setting}`);
    }

    // Save the entire settings configuration tree as a string block
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