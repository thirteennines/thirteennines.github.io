import {
  AfterViewInit,
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { WindowTab } from '../window/window';
import { WindowTitle } from '../window/window_tile';
import { WindowContent } from '../window/window_content';

@Component({
  imports: [
    CommonModule,
    WindowTab,
    WindowTitle,
    WindowContent
  ],
  selector: 'drawbox',
  styleUrl: './drawbox.scss',
  templateUrl: './drawbox.html',
})
export class Drawbox implements OnInit, AfterViewInit {

  @Input() isClosing: boolean = false;

  @Output() onCloseWindow = new EventEmitter<void>();
  @Output() onAnimationFinished = new EventEmitter<void>();

  // ============================================================
  // CONFIG
  // ============================================================

  private readonly GOOGLE_FORM_ID =
    '1FAIpQLSeuzf6-Ws5227Tkl7XzhK-yR_vWYoC_nZaO29evmS1XCOrUaA';

  private readonly ENTRY_ID =
    'entry.700781246';

  private readonly GOOGLE_SHEET_ID =
    '1Q10HDd9sWFcOorB3Cef_-O1tHLPn8RM-mRwTeBue33w';

  public readonly DISPLAY_IMAGES = true;

  private readonly CLIENT_ID =
    'b4fb95e0edc434c';

  // IMPORTANT:
  // These URLs match the original JavaScript version.

  private readonly GOOGLE_SHEET_URL =
    `https://docs.google.com/spreadsheets/d/${this.GOOGLE_SHEET_ID}/export?format=csv`;

  private readonly GOOGLE_FORM_URL =
    `https://docs.google.com/forms/d/e/${this.GOOGLE_FORM_ID}/formResponse`;


  // ============================================================
  // CANVAS
  // ============================================================

  @ViewChild('drawCanvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('sliderInput', { static: false })
  sliderRef!: ElementRef<HTMLInputElement>;

  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;


  // ============================================================
  // DRAWING STATE
  // ============================================================

  private restoreArray: ImageData[] = [];

  private startIndex = -1;

  private strokeColor = '#20283D';

  public strokeWidth = 5;

  private isDrawing = false;


  // ============================================================
  // UI STATE
  // ============================================================

  public isSubmitting = false;

  public statusText = '';

  public galleryImages: Array<{
    timestamp: string;
    url: string;
  }> = [];


  // ============================================================
  // ANGULAR LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    this.fetchImages();
  }


  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;

    const ctx = this.canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not evaluate canvas context.');
    }

    this.context = ctx;

    // Initial canvas background
    this.context.fillStyle = '#FBF7F3';
    this.context.fillRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    // Same behavior as the original JavaScript.
    this.context.drawImage = function () {
      console.warn('noo >:(');
    };

    if (this.sliderRef) {
      this.updateSliderBackground(
        this.sliderRef.nativeElement
      );
    }
  }


  // ============================================================
  // WINDOW CONTROLS
  // ============================================================

  close(): void {
    this.onCloseWindow.emit();
  }

  animationDone(): void {
    this.onAnimationFinished.emit();
  }


  // ============================================================
  // DRAWING
  // ============================================================

  public changeColor(color: string): void {
    this.strokeColor = color;
  }


  public onSliderChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    this.strokeWidth = parseInt(
      target.value,
      10
    );

    this.updateSliderBackground(target);
  }


  private updateSliderBackground(
    el: HTMLInputElement
  ): void {

    const min = parseFloat(el.min) || 0;
    const max = parseFloat(el.max) || 100;

    const pct =
      ((parseFloat(el.value) - min) / (max - min)) * 100;

    el.style.setProperty(
      '--range-pct',
      pct + '%'
    );
  }


  public start(
    event: MouseEvent | TouchEvent
  ): void {

    this.isDrawing = true;

    this.context.beginPath();

    const coords =
      this.getRelativeCoordinates(event);

    this.context.moveTo(
      coords.x,
      coords.y
    );

    event.preventDefault();
  }


  public draw(
    event: MouseEvent | TouchEvent
  ): void {

    if (!this.isDrawing) {
      return;
    }

    const coords =
      this.getRelativeCoordinates(event);

    this.context.lineTo(
      coords.x,
      coords.y
    );

    this.context.strokeStyle =
      this.strokeColor;

    this.context.lineWidth =
      this.strokeWidth;

    this.context.lineCap = 'round';

    this.context.lineJoin = 'round';

    this.context.stroke();

    event.preventDefault();
  }


  public stop(
    event: MouseEvent | TouchEvent
  ): void {

    if (!this.isDrawing) {
      return;
    }

    this.context.stroke();

    this.context.closePath();

    this.isDrawing = false;

    this.restoreArray.push(
      this.context.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      )
    );

    this.startIndex++;

    event.preventDefault();
  }


  private getRelativeCoordinates(
    event: MouseEvent | TouchEvent
  ): { x: number; y: number } {

    const rect =
      this.canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if (event instanceof MouseEvent) {

      clientX = event.clientX;
      clientY = event.clientY;

    } else if (
      event.targetTouches &&
      event.targetTouches.length > 0
    ) {

      clientX =
        event.targetTouches[0].clientX;

      clientY =
        event.targetTouches[0].clientY;

    } else if (
      event.changedTouches &&
      event.changedTouches.length > 0
    ) {

      clientX =
        event.changedTouches[0].clientX;

      clientY =
        event.changedTouches[0].clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }


  // ============================================================
  // UNDO / CLEAR
  // ============================================================

  public restore(): void {

    if (this.startIndex <= 0) {

      this.clear();

    } else {

      this.startIndex--;

      this.restoreArray.pop();

      this.context.putImageData(
        this.restoreArray[this.startIndex],
        0,
        0
      );
    }
  }


  public clear(): void {

    this.context.fillStyle =
      '#FBF7F3';

    this.context.fillRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    // Keep the current clear state so it can be undone.
    this.restoreArray.push(
      this.context.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      )
    );

    this.startIndex++;
  }


  // ============================================================
  // SUBMIT DRAWING
  // ============================================================

  public async submitDrawing(): Promise<void> {

    this.isSubmitting = true;

    this.statusText = 'Uploading...';

    try {

      // Convert canvas to PNG
      const imageData =
        this.canvas.toDataURL('image/png');

      const blob =
        await (await fetch(imageData)).blob();

      const formData =
        new FormData();

      formData.append(
        'image',
        blob,
        'drawing.png'
      );


      // IMPORTANT:
      // The original JavaScript uses the /3/image endpoint.
      const response = await fetch(
        'https://api.imgur.com/3/image',
        {
          method: 'POST',

          headers: {
            Authorization:
              `Client-ID ${this.CLIENT_ID}`
          },

          body: formData,
        }
      );


      const data =
        await response.json();


      if (!data.success) {
        throw new Error(
          'Imgur upload failed'
        );
      }


      const imageUrl =
        data.data.link;

      console.log(
        'Uploaded image URL:',
        imageUrl
      );


      // Submit image URL to Google Form
      const googleFormData =
        new FormData();

      googleFormData.append(
        this.ENTRY_ID,
        imageUrl
      );


      await fetch(
        this.GOOGLE_FORM_URL,
        {
          method: 'POST',

          body: googleFormData,

          mode: 'no-cors',
        }
      );


      this.statusText =
        'Upload successful!';

      alert(
        'Image uploaded and submitted successfully ☻'
      );


      // Clear drawing after successful upload
      this.clear();

    } catch (error) {

      console.error(error);

      this.statusText =
        'Error uploading image.';

      alert(
        'Error uploading image or submitting to Google Form.'
      );

    } finally {

      this.isSubmitting = false;
    }
  }


  // ============================================================
  // GALLERY
  // ============================================================

  private async fetchImages(): Promise<void> {

    if (!this.DISPLAY_IMAGES) {
      console.log(
        'Image display is disabled.'
      );

      return;
    }


    try {

      // Fetch the Google Sheet CSV
      const response =
        await fetch(
          this.GOOGLE_SHEET_URL
        );


      if (!response.ok) {
        throw new Error(
          `Google Sheet request failed: ${response.status}`
        );
      }


      const csvText =
        await response.text();


      // Split lines, handling both Windows and Unix line endings.
      const rows =
        csvText
          .split(/\r?\n/)
          .slice(1);


      const parsedImages:
        Array<{
          timestamp: string;
          url: string;
        }> = [];


      // Newest images first
      rows.reverse().forEach((row) => {

        if (!row.trim()) {
          return;
        }


        const columns =
          row.split(',');


        if (columns.length < 2) {
          return;
        }


        const timestamp =
          columns[0]
            .trim()
            .replace(/^"|"$/g, '');


        const imgUrl =
          columns[1]
            .trim()
            .replace(/^"|"$/g, '');


        if (imgUrl.startsWith('http')) {

          parsedImages.push({
            timestamp,
            url: imgUrl
          });
        }
      });


      // Give Angular the gallery data.
      this.galleryImages =
        parsedImages;


      console.log(
        'Gallery images:',
        this.galleryImages
      );

    } catch (error) {

      console.error(
        'Error fetching images:',
        error
      );

      this.statusText =
        'Failed to load images.';
    }
  }
}
