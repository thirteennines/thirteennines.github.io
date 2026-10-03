import { Inject, OnInit, PLATFORM_ID, NgZone, ChangeDetectorRef } from '@angular/core'; // 👈 Added ChangeDetectorRef
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WindowTab } from '../window/window';
import { WindowTitle } from '../window/window_tile';
import { WindowContent } from '../window/window_content';

export interface Track {
  title: string;
  artist: string;
  url: string;
}

export interface Mixtape {
  id: string;
  name: string;
  desc: string;
  tracks: Track[];
}

@Component({
  selector: 'musicplayer',
  standalone: true,
  imports: [CommonModule, WindowContent, WindowTab, WindowTitle],
  templateUrl: './musicplayer.html',
  styleUrl: './musicplayer.scss',
})
export class Musicplayer implements OnInit {
  audio!: HTMLAudioElement; 
  playpause: string = 'play.gif';
  currentTimeValue: number = 0;
  volumeValue: number = 2; 
  musicLength: string = '0:00';
  duration: number = 1;
  currentTime: string = '0:00';
  trackPointer: number = 0;

  mixtapes: Mixtape[] = [
    {
      id: '1',
      name: "alma's greatest hits",
      desc: "all of these trax",
      tracks: [
        { title: "Hanging with Kara At The Mall", artist: "Alma", url: "mixtapes/alma/HangingWithKaraAtTheMall.mp3" },
        { title: "Castle Cat", artist: "Alma", url: "mixtapes/alma/CastleCat.mp3" },
        { title: "Chinese Vase", artist: "Alma", url: "mixtapes/alma/ChineseVase.mp3" },
        { title: "End", artist: "Alma", url: "mixtapes/alma/End.mp3" },
        { title: "Fuzzy Letters", artist: "Alma", url: "mixtapes/alma/FuzzyLetters.mp3" },
        { title: "Honey with Milk", artist: "Alma", url: "mixtapes/alma/HoneyWithMilk.mp3" },
        { title: "Kim CarDashin", artist: "Alma", url: "mixtapes/alma/KimCarDashin.mp3" },
        { title: "Memento", artist: "Alma", url: "mixtapes/alma/Memento.mp3" },
        { title: "practice", artist: "Alma", url: "mixtapes/alma/practice.mp3" },
        { title: "Sleepy Cats", artist: "Alma", url: "mixtapes/alma/SleepyCats.mp3" },
        { title: "Sleepy Frustrated", artist: "Alma", url: "mixtapes/alma/SleepyFrustrated.mp3" },
      ]
    },
  ];
  
  currentMixtape!: Mixtape;
  currentMusic!: Track;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef // 👈 1. Inject ChangeDetectorRef here
  ) {
    this.currentMixtape = this.mixtapes[0];
    this.currentMusic = this.currentMixtape.tracks[0];
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.audio = new Audio();
      this.audio.volume = this.volumeValue / 16; 
      this.loadTrack(this.trackPointer, false);
      
      this.audio.addEventListener('timeupdate', () => {
        this.ngZone.run(() => {
          this.currentTimeValue = this.audio.currentTime;
          this.currentTime = this.formatTime(this.audio.currentTime);
          this.cdr.detectChanges(); // 👈 2. Force an immediate UI redraw even if another window is focused
        });
      });

      this.audio.addEventListener('loadedmetadata', () => {
        this.ngZone.run(() => {
          this.duration = this.audio.duration;
          this.musicLength = this.formatTime(this.audio.duration);
          this.cdr.detectChanges(); // 👈 3. Force UI sync on track load
        });
      });

      this.audio.addEventListener('ended', () => {
        this.ngZone.run(() => {
          this.next();
          this.cdr.detectChanges(); // 👈 4. Force UI sync on automated track change
        });
      });
    }
  }

  selectMixtape(event: Event): void {
    const selectEl = event.target as HTMLSelectElement;
    const selected = this.mixtapes.find(m => m.id === selectEl.value);
    
    if (selected) {
      this.currentMixtape = selected;
      this.loadTrack(0, true);
      this.cdr.detectChanges();
    }
  }

  private loadTrack(index: number, shouldPlay: boolean = true): void {
    this.trackPointer = index;
    this.currentTime = "0:00";
    this.currentTimeValue = 0;
    this.currentMusic = this.currentMixtape.tracks[index];
    if (this.audio) {
      this.audio.src = this.currentMusic.url;
      if (shouldPlay) {
        this.audio.play();
        this.playpause = 'pause.gif';
      } else {
        this.playpause = 'play.gif';
      }
      this.cdr.detectChanges();
    }
  }

  play(index?: number): void {
    if (!this.audio) return;
    if (index !== undefined) {
      this.loadTrack(index, true);
      return;
    }
    if (this.audio.paused) {
      this.audio.play();
      this.playpause = "pause.gif";
    } else {
      this.audio.pause();
      this.playpause = "play.gif";
    }
    this.cdr.detectChanges();
  }

  prev(): void {
    let index = this.trackPointer === 0 ? this.currentMixtape.tracks.length - 1 : this.trackPointer - 1;
    this.loadTrack(index, true);
    this.cdr.detectChanges();
  }

  next(): void {
    let index = this.trackPointer >= this.currentMixtape.tracks.length - 1 ? 0 : this.trackPointer + 1;
    this.loadTrack(index, true);
    this.cdr.detectChanges();
  }

  volumeSlider(event: Event) {
    if (!this.audio) return; 
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    this.volumeValue = value;
    this.audio.volume = value / 16;
    this.cdr.detectChanges();
  }

  durationSlider(event: Event) {
    if (!this.audio) return; 
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    this.currentTimeValue = value;
    this.audio.currentTime = value;
    this.cdr.detectChanges();
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  @Input() isClosing: boolean = false;
  @Output() onCloseWindow = new EventEmitter<void>();
  @Output() onAnimationFinished = new EventEmitter<void>();

  close() {
    this.onCloseWindow.emit();
    if (this.audio) {
      this.audio.pause();
    }
  }

  animationDone() {
    this.onAnimationFinished.emit();
  }
}
