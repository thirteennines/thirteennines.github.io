import { AfterViewInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowTab } from '../window/window';
import { WindowTitle } from '../window/window_tile';
import { WindowContent } from '../window/window_content';

@Component({
  selector: 'about',
  styleUrl: './about.scss',
  templateUrl: './about.html',
  standalone: true,
  imports: [CommonModule, WindowTab, WindowTitle, WindowContent],
})
export class About implements AfterViewInit {

  @Input() isClosing: boolean = false;

  @Output() onCloseWindow = new EventEmitter<void>();
  @Output() onAnimationFinished = new EventEmitter<void>();

  private chomp = new Audio('/chomp.mp3');

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
