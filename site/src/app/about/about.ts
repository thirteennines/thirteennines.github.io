import { AfterViewInit, Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowTab } from '../window/window';
import { WindowTitle } from '../window/window_tile';
import { WindowContent } from '../window/window_content';

// 1. Move interfaces completely outside the class definition
interface LastfmTextProperty {
  '#text': string;
}

interface LastfmTrackAttributes {
  nowplaying?: string;
}

interface LastfmTrack {
  artist: LastfmTextProperty;
  name: string;
  album: LastfmTextProperty;
  image: Array<LastfmTextProperty & { size: string }>;
  streamable: string;
  url: string;
  mbid: string;
  '@attr'?: LastfmTrackAttributes;
}

interface LastfmRecentTracksResponse {
  recenttracks: {
    track: LastfmTrack[];
    '@attr': {
      user: string;
      totalPages: string;
      page: string;
      perPage: string;
      total: string;
    };
  };
}

@Component({
  selector: 'about',
  styleUrl: './about.scss',
  templateUrl: './about.html',
  standalone: true,
  imports: [CommonModule, WindowTab, WindowTitle, WindowContent],
})
export class About implements OnInit, AfterViewInit { // Added OnInit here

  @Input() isClosing: boolean = false;

  @Output() onCloseWindow = new EventEmitter<void>();
  @Output() onAnimationFinished = new EventEmitter<void>();

  private chomp = new Audio('/chomp.mp3');

  // 2. Define your configurations cleanly as private class members
  private readonly API_KEY = '6f7a48db2d408029e62bb9fb3e7c418e';
  private readonly USERNAME = 'domushen';

  // 3. Use ngOnInit to securely fire off your initial network fetch tasks
  ngOnInit(): void {
    this.fetchLastfmStatus();
  }

  private fetchLastfmStatus(): void {
    fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this.USERNAME}&api_key=${this.API_KEY}&format=json&limit=1`)
      .then((res: Response) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json() as Promise<LastfmRecentTracksResponse>;
      })
      .then((data: LastfmRecentTracksResponse) => {
        const track: LastfmTrack | undefined = data.recenttracks.track[0];
        
        if (!track) {
          throw new Error('No tracks found.');
        }

        const artist: string = track.artist['#text'];
        const song: string = track.name;
        const isNowPlaying: boolean = track['@attr']?.nowplaying === 'true';

        const outputElement = document.getElementById('now-playing');
        if (outputElement) {
          outputElement.innerHTML = isNowPlaying
            ? `i'm currently listening to: <span class="emphasized">${song}</span> by ${artist}.`
            : `last played: <span class="emphasized">${song}</span> by ${artist}.`;
        }
      })
      .catch((error: unknown) => {
        console.error('Error fetching Last.fm status:', error);
        const outputElement = document.getElementById('now-playing');
        if (outputElement) {
          outputElement.textContent = "im not listening to anything.";
        }
      });
  }

  close() {
    this.onCloseWindow.emit();
  }

  animationDone() {
    this.onAnimationFinished.emit();
  }

  ngAfterViewInit(): void {
    const foods = document.querySelectorAll<HTMLImageElement>('img.food');

    foods.forEach((img) => {
      img.style.cursor = "url('/fork.png'), auto";

      img.addEventListener('click', (e: MouseEvent) => {
        const rect = img.getBoundingClientRect();

        const canvas = document.createElement('canvas');

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        canvas.className = img.className;

        canvas.style.cssText = img.style.cssText;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        canvas.style.cursor = "url('/fork.png'), auto";

        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        this.punchHoleAt(canvas, ctx, x, y);

        img.parentNode?.replaceChild(canvas, img);

        canvas.addEventListener('click', (ev: MouseEvent) => {
          const canvasRect = canvas.getBoundingClientRect();

          const canvasX =
            (ev.clientX - canvasRect.left) *
            (canvas.width / canvasRect.width);

          const canvasY =
            (ev.clientY - canvasRect.top) *
            (canvas.height / canvasRect.height);

          this.punchHoleAt(canvas, ctx, canvasX, canvasY);
        });
      });
    });
  }

  private punchHoleAt(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ): void {
    const sound = this.chomp.cloneNode(true) as HTMLAudioElement;

    sound.play().catch(() => {});

    const radius = 100 + Math.random() * 20;
    const angle = Math.random() * Math.PI * 2;

    ctx.save();

    ctx.globalCompositeOperation = 'destination-out';

    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.beginPath();

    ctx.ellipse(
      0,
      0,
      radius,
      radius * (0.6 + Math.random() * 0.8),
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
  }
}
