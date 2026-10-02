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
    'robbie.png',
    'hussie.png',
    'immortalitycat.png',
    'alma.png',
    'miles.jpg',
    'SOFIE_CITADRILL.png',
    'meattreat35.png',
    'punchbox.png',
    'wezie.gif',
    'wuttie.gif',
    'errorsorry4_1.jpg',
    'spiderbot.png',
    'crab.png',
    'moonsettler.webp',
    'jerry.png',
    'dds.jpg',
    'errorsorry3.jpg',
    'camila.jpg',
    'tiredmage.jpg',
    'mui.webp'
  ];

  imageCreator = [
    'Flareware on bluesky',
    'Andrew Hussie of MS Paint Adventures',
    'immortalitycat on twitter',
    'almadev on bluesky',
    'mimi on bluesky',
    "Sofialoreart",
    'MeatTreat35 on artfight',
    'punchb0x on twitter',
    'Weszie on artfight',
    'Wuttie on artfight',
    'errorsorry on bluesky',
    'My friend spiderbot',
    'Conrab on bluesky',
    'moonsettler on bluesky',
    'Jeppster on bluesky',
    'digitaldevilsaga on instagram',
    'errorsorry on bluesky',
    'the SEEKER of POWER on bluesky',
    'my friend flynn',
    'lamespectre on bluesky',
  ];

  imageSource = [
    'https://bsky.app/profile/flareware.bsky.social',
    'https://homestuck.com',
    'https://x.com/immortalitycat',
    'https://bsky.app/profile/almadev.bsky.social',
    'https://bsky.app/profile/m1mim1mi.bsky.social',
    'https://sophialoreart.wixsite.com/artwork',
    'https://artfight.net/~MeatTreat35',
    'https://x.com/punchb0x',
    'https://artfight.net/~weszie',
    'https://artfight.net/~Wuttie',
    'https://bsky.app/profile/errorsorry.bsky.social',
    '',
    'https://bsky.app/profile/conrab.xyz',
    'https://bsky.app/profile/sunshambler.bsky.social',
    'https://bsky.app/profile/jeppster.bsky.social',
    'https://instagram.com/digitaldevilsaga',
    'https://bsky.app/profile/errorsorry.bsky.social',
    'https://bsky.app/profile/1000thsummer.bsky.social',
    '',
    'https://bsky.app/profile/lamespectre.bsky.social'
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