import { Component } from '@angular/core';
import { WindowTab } from "../window/window";
import { WindowTitle } from "../window/window_tile";
import { WindowContent } from "../window/window_content";

@Component({
  imports: [WindowTab, WindowTitle, WindowContent],
  selector: 'melonharvest',
  styleUrl: './melonharvest.scss',
  templateUrl: './melonharvest.html',
})
export class Melonharvest  {
  closeable = true;

   imageFiles = [
    'dds.jpg',
    'hussie.png',
    'immortalitycat.png',
    "meattreat35.png",
    "punchbox.png",
    "tiredmage.jpg",
    "wezie.gif",
    "wuttie.gif"
  ];
  imageCreator= [
    'digitaldevilsaga on instagram',
    'Andrew Hussie of MS Paint Adventures',
    'Immortalitycat of Artfight',
    'Meattreat35 of Artfight',
    'Punchbox of Artfight',
    'My friend flynn',
    'Wezie of Artfight',
    'Wuttie of Artfight'
  ]
  imageSource = [
    'https://www.instagram.com/digitaldevilsaga/',
    'https://homestuck.com/',

  ]
    isWindowVisible = false;
  isClosing = false;

  // Get the full path for each image
  getImagePath(filename: string): string {
    return `melon_harvest/${filename}`;
  }

  
  closeWindow() {
    this.isClosing = true;
  }

  destroyWindow() {
    this.isWindowVisible = false;
    this.isClosing = false; 
  }
}
