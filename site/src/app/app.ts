// app.ts
import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Intro } from "./intro/intro";
import { Melonharvest } from './melonharvest/melonharvest';
import { Icons } from "./icons/icons";
import { Musicplayer } from './musicplayer/musicplayer';
import { Settings } from "./settings/settings";
import { About } from './about/about';

type AccessibilitySetting = 'highContrast' | 'disableAnimations' | 'dyslexicFont' | 'largeText' | 'grayscale';

@Component({
  selector: 'app',
  standalone: true,
  imports: [
    CommonModule,
    Melonharvest,
    Intro,
    Icons,
    Settings,
    About
],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {

  openWindows: { [key: string]: boolean } = {
    melon: false,
    intro: true,
    settings:false,
    music:false,
    about:false
  };

  closingWindows: { [key: string]: boolean } = {
    melon: false,
    intro: false,
    settings:false,
    music:false,
    about:false
  };

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
          const settingName = key as AccessibilitySetting;
          if (this.accessibility[settingName]) {
            document.body.setAttribute(`data-${settingName}`, 'true');
          }
        });
      } catch (e) {
        console.error('Could not parse accessibility choices from storage:', e);
      }
    }
  }

  toggleSetting(payload: { setting: AccessibilitySetting; isChecked: boolean }) {
    this.accessibility[payload.setting] = payload.isChecked;
    
    if (payload.isChecked) {
      document.body.setAttribute(`data-${payload.setting}`, 'true');
    } else {
      document.body.removeAttribute(`data-${payload.setting}`);
    }
    
    localStorage.setItem('9x13_accessibility', JSON.stringify(this.accessibility));
  }

  openWindow(windowName: string) {
    this.openWindows[windowName] = true;
    this.closingWindows[windowName] = false;
  }

  startCloseWindow(windowName: string) {
    this.closingWindows[windowName] = true;
  }

  destroyWindow(windowName: string) {
    this.openWindows[windowName] = false;
    this.closingWindows[windowName] = false;
  }
}