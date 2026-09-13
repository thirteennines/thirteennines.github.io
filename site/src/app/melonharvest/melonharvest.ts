import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowTab } from "../window/window";
import { WindowTitle } from "../window/window_tile";
import { WindowContent } from "../window/window_content";

@Component({
  selector: 'melonharvest',
  standalone: true,
  imports: [CommonModule, WindowTab, WindowTitle, WindowContent],
  styleUrl: './melonharvest.scss',
  templateUrl: './melonharvest.html'
})
export class Melonharvest {
  @Input() isClosing: boolean = false;

  @Output() onCloseWindow = new EventEmitter<void>();
  @Output() onAnimationFinished = new EventEmitter<void>();

  closeable = true;

  selectedImage: number | null = null;
  imageViewerClosing = false;

  imageFiles = [
    'dds.jpg',
    'hussie.png',
    'immortalitycat.png',
    'meattreat35.png',
    'punchbox.png',
    'tiredmage.jpg',
    'wezie.gif',
    'wuttie.gif',
    'errorsorry3.jpg'
  ];

  imageCreator = [
    'digitaldevilsaga on instagram',
    'Andrew Hussie of MS Paint Adventures',
    'immortalitycat on twitter',
    'MeatTreat35 of Artfight',
    'punchb0x on twitter',
    'my friend flynn',
    'Weszie of Artfight',
    'Wuttie of Artfight',
    'errorsorry on Bluesky'
  ];

  imageSource = [
    'https://instagram.com/digitaldevilsaga',
    'https://homestuck.com',
    'https://x.com/immortalitycat',
    'https://artfight.net/~MeatTreat35',
    'https://x.com/punchb0x',
    '',
    'https://artfight.net/~weszie',
    'https://artfight.net/~Wuttie',
    'https://bsky.app/profile/errorsorry.bsky.social'
  ];

  getImagePath(filename: string): string {
    return `melon_harvest/${filename}`;
  }

  openImage(index: number) {
    this.selectedImage = index;
    this.imageViewerClosing = false;
  }

  closeImage() {
    this.imageViewerClosing = true;
  }

  imageViewerAnimationDone() {
    if (this.imageViewerClosing) {
      this.selectedImage = null;
      this.imageViewerClosing = false;
    }
  }

  close() {
    this.onCloseWindow.emit();
  }

  animationDone() {
    this.onAnimationFinished.emit();
  }
}