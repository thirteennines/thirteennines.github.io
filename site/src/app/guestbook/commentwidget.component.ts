/*
    Comment Widget - Single-file Angular Standalone Component
    Ported from Ayano's comment-widget
    https://virtualobserver.moe/ayano/comment-widget

    Usage:

        import { CommentWidgetComponent } from './comment-widget.component';

        // In your template:
        <app-comment-widget [config]="minConfig"></app-comment-widget>

    Minimal config:

        minConfig: Partial<CommentWidgetConfig> = {
            formId: 'YOUR_GOOGLE_FORM_ID',
            sheetId: 'YOUR_GOOGLE_SHEET_ID',
            nameId: 'ENTRY_ID',
            websiteId: 'ENTRY_ID',
            textId: 'ENTRY_ID',
            pageId: 'ENTRY_ID',
            replyId: 'ENTRY_ID',
        };
*/

import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';

import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';


// ─────────────────────────────────────────────────────────────────────────────
// Models
// ─────────────────────────────────────────────────────────────────────────────

export interface CommentWidgetConfig {
  formId: string;
  nameId: string;
  websiteId: string;
  textId: string;
  pageId: string;
  replyId: string;
  sheetId: string;

  timezone: number;
  daylightSavings: boolean;

  dstStart: [string, string, number, number];
  dstEnd: [string, string, number, number];

  commentsPerPage: number;
  maxLength: number;
  maxLengthName: number;

  commentsOpen: boolean;
  collapsedReplies: boolean;
  longTimestamp: boolean;

  includeUrlParameters: boolean;
  fixRarebitIndexPage: boolean;

  wordFilterOn: boolean;
  filterReplacement: string;
  filteredWords: string[];

  widgetTitle: string;
  nameFieldLabel: string;
  websiteFieldLabel: string;
  textFieldLabel: string;
  submitButtonLabel: string;

  loadingText: string;
  noCommentsText: string;
  closedCommentsText: string;

  websiteText: string;
  replyButtonText: string;
  replyingText: string;
  expandRepliesText: string;

  leftButtonText: string;
  rightButtonText: string;
}


const DEFAULT_CONFIG: CommentWidgetConfig = {

  // Google
  formId: '',
  nameId: '',
  websiteId: '',
  textId: '',
  pageId: '',
  replyId: '',
  sheetId: '',

  // Time
  timezone: -5,
  daylightSavings: true,

  dstStart: ['March', 'Sunday', 2, 2],
  dstEnd: ['November', 'Sunday', 1, 2],

  // Misc
  commentsPerPage: 5,
  maxLength: 500,
  maxLengthName: 16,

  commentsOpen: true,
  collapsedReplies: true,
  longTimestamp: false,

  includeUrlParameters: false,
  fixRarebitIndexPage: false,

  // Word filter
  wordFilterOn: false,
  filterReplacement: '****',
  filteredWords: [],

  // Text
  widgetTitle: 'guestbook',
  nameFieldLabel: 'name',
  websiteFieldLabel: 'site',
  textFieldLabel: '',
  submitButtonLabel: 'submit',

  loadingText: 'loading entries...',
  noCommentsText: 'no entries yet!',
  closedCommentsText: 'comments are closed temporarily!',

  websiteText: 'website',
  replyButtonText: 'reply',
  replyingText: 'replying to',
  expandRepliesText: 'show replies',

  leftButtonText: '<<',
  rightButtonText: '>>'
};


interface Comment {
  Timestamp: string;
  Timestamp2: string;

  Name: string;
  Website?: string;
  Text: string;

  Page: string;
  Reply?: string;
}


interface CommentGroup {
  comment: Comment;
  id: string;
  replies: Comment[];
  repliesExpanded: boolean;
}


// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-comment-widget',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  styles: [`

    /* ==========================================
       WIDGET MAIN LAYOUT
       ========================================== */

    #c_widget {
      font-family: inherit;
      margin:1em;
    }

    #c_inputDiv {
      margin-bottom: 1.5rem;
    }

    #c_widgetTitle {
      margin-bottom: 3%;
      text-align:center;
      color: rgb(78, 126, 101);
    }


    /* ==========================================
       FORM
       ========================================== */

    .c-inputWrapper {
      display: flex;
      flex-direction: column;
      margin-bottom: .75rem;
    }

    .c-label {
      font-weight: bold;
      margin-bottom: .25rem;
      padding-left: 40px;
    }

    .c-input {
      padding: .4rem .6rem;
      border: 1px solid #e8fff280;
      background-color: #e8fff280;
      border-radius: 4px;
      font-family: inherit;

      margin-left: 40px;
      margin-right: 40px;

      color: #151615;

      transition:
        border-color 0.2s,
        box-shadow 0.2s;
    }

    .c-input:focus {
      outline: none;

      border-color: rgb(78, 126, 101);

      box-shadow:
        0 0 0 3px #CEF8B1;
    }

    .c-textInput {
      resize: vertical;
    }


    /* ==========================================
       REPLYING
       ========================================== */

    .c-replyingText {
      display: inline-block;

      margin-bottom: .5rem;
      margin-left: 40px;

      font-style: italic;

      color: rgb(78, 126, 101);

      padding: .25rem .75rem;

      background-color: rgb(139, 182, 160);

      border-radius: 1rem;
    }

    .c-cancelReply {
      background: none;
      border: none;

      cursor: pointer;

      font-size: .85rem;

      margin-left: .4rem;

      color: #DCF2E6;
      font-weight: bold;
    }

    .c-cancelReply:hover {
      color: #ceff5c;
    }


    /* ==========================================
       BUTTONS
       ========================================== */

    #c_submitButton,
    .c-replyButton,
    .c-expandButton,
    .c-paginationButton {

      color: #DCF2E6;

      background-color: rgb(117, 167, 141);
      padding:.5rem;

      border: 1px solid #15161580;

      border-radius: .5rem;

      cursor: pointer;

      transition:
        all .1s ease-in-out;
    }

    #c_submitButton {
      padding: .4rem 1rem;

      font-size: 1rem;

      margin-left: 40px;
    }

    .c-replyButton,
    .c-expandButton {
      padding: .2rem .6rem;

      font-size: .8rem;

      margin-right: .4rem;
    }

    .c-paginationButton {
      padding: .2rem .7rem;

      font-size: 1rem;
    }


    /* ==========================================
       BUTTON STATES
       ========================================== */

    #c_submitButton:hover:not(:disabled),
    .c-replyButton:hover,
    .c-expandButton:hover,
    .c-paginationButton:hover:not(:disabled) {

      background-color: rgb(100, 148, 123);

      box-shadow:
        4px 2px #CEF8B1;

      color: #CEF8B1;
    }

    #c_submitButton:active:not(:disabled),
    .c-replyButton:active,
    .c-expandButton:active,
    .c-paginationButton:active:not(:disabled) {

      background-color: rgb(78, 126, 101);

      box-shadow:
        4px 2px #15161580,
        4px 2px #15161580 inset;

      color: #ceff5c;
    }

    #c_submitButton:disabled,
    .c-paginationButton:disabled {

      opacity: .5;

      cursor: not-allowed;

      background-color: rgb(139, 182, 160);

      box-shadow: none;

      color: #DCF2E6;
    }


    /* ==========================================
       COMMENTS
       ========================================== */

    #c_container {
    }

    .c-comment {
      border-top: 1px solid #FFF4E880;

      
      margin-top:.5rem;
      padding: 1rem;
      border-radius:4px;
      background-color:#e8fff280;
    }

    .c-replyContainer {
      margin-top: .5rem;
    }

    .c-reply {
      border-left: 3px solid rgb(117, 167, 141);

      padding:
        .5rem
        0
        .5rem
        .75rem;

      margin-top: .5rem;

      background-color:
        rgba(255, 255, 255, .2);

      border-radius:
        0
        4px
        4px
        0;
    }

    .c-name {
      margin: 0 0 .2rem;

      

      font-weight: bold;

      display: inline-block;
    }

    .c-timestamp {

      color: rgb(78, 126, 101);

      margin-right: .5rem;
    }

    .c-site {
      font-size: 1rem;

      margin-right: .5rem;

      color: rgb(100, 148, 123);

      text-decoration: underline;
    }

    .c-site:hover {
      color: rgb(78, 126, 101);
    }

    .c-text {
      margin: .4rem 0 .5rem;

      white-space: pre-wrap;

      line-height: 1.4;
    }


    /* ==========================================
       STATES
       ========================================== */

    .c-successMessage {
      color: rgb(78, 126, 101);

      margin-bottom: .5rem;

      font-weight: bold;

      margin-left: 40px;
    }

    .c-closedText,
    .c-loading,
    .c-noComments {

      font-style: italic;

      color: rgb(100, 148, 123);
    }

    .c-error {
      color: #e53e3e;

      font-weight: bold;
    }


    /* ==========================================
       PAGINATION
       ========================================== */

    #c_pagination {
      display: flex;

      align-items: center;

      gap: .5rem;

      margin-top: 1rem;

      justify-content: center;
    }

    .c-pageIndicator {
      font-size: .9rem;

      color: #151615;

      font-weight: bold;
    }

  `],

  template: `

    <div id="c_widget">

      <!-- =====================================================
           COMMENT FORM
           ===================================================== -->

      <div id="c_inputDiv">

        <ng-container
          *ngIf="cfg.commentsOpen; else closedTpl">

          <form
            #commentForm="ngForm"
            (ngSubmit)="onSubmit(commentForm)">

            <h2 id="c_widgetTitle">
              {{ cfg.widgetTitle }}
            </h2>


            <!-- Reply indicator -->

            <span
              *ngIf="replyingToName"
              class="c-replyingText">

              {{ cfg.replyingText }}
              {{ replyingToName }}...

              <button
                type="button"
                class="c-cancelReply"
                (click)="cancelReply()">

                ✕

              </button>

            </span>


            <!-- Name -->

            <div class="c-inputWrapper">

              <label
                class="c-label  pixel-corners-cont"
                for="c_name">

                {{ cfg.nameFieldLabel }}

              </label>

              <input
                class="c-input c-nameInput"

                id="c_name"

                name="name"

                type="text"

                [(ngModel)]="formName"

                [maxlength]="cfg.maxLengthName"

                required

                placeholder="who are you?"
              />

            </div>


            <!-- Website -->

            <div class="c-inputWrapper pixel-corners-cont">

              <label
                class="c-label"
                for="c_website">

                {{ cfg.websiteFieldLabel }}

              </label>

              <input
                class="c-input c-websiteInput"

                id="c_website"

                name="website"

                type="url"

                [(ngModel)]="formWebsite"

                placeholder="optional, start w/ https://"
              />

            </div>


            <!-- Comment -->

            <div class="c-inputWrapper">

              <label
                class="c-label"
                for="c_text">

                {{ cfg.textFieldLabel }}

              </label>

              <textarea
                class="c-input c-textInput"

                id="c_text"

                name="text"

                rows="4"

                [(ngModel)]="formText"

                [maxlength]="cfg.maxLength"

                required

                placeholder="what are you saying?"
              ></textarea>

            </div>


            <!-- Success -->

            <p
              *ngIf="submitSuccess"
              class="c-successMessage">

              Comment submitted! Refreshing...

            </p>


            <!-- Submit -->

            <button
              id="c_submitButton"

              type="submit"

              [disabled]="
                commentForm.invalid ||
                isSubmitting
              ">

              {{
                isSubmitting
                  ? 'Submitting...'
                  : cfg.submitButtonLabel
              }}

            </button>

          </form>

        </ng-container>


        <!-- Closed -->

        <ng-template #closedTpl>

          <p class="c-closedText">
            {{ cfg.closedCommentsText }}
          </p>

        </ng-template>

      </div>


      <!-- =====================================================
           COMMENTS
           ===================================================== -->

      <div id="c_container">

        <!-- Loading -->

        <p
          *ngIf="isLoading"
          class="c-loading">

          {{ cfg.loadingText }}

        </p>


        <!-- Error -->

        <p
          *ngIf="errorMessage"
          class="c-error">

          {{ errorMessage }}

        </p>


        <!-- Empty -->

        <p
          *ngIf="
            !isLoading &&
            !errorMessage &&
            commentGroups.length === 0
          "
          class="c-noComments">

          {{ cfg.noCommentsText }}

        </p>


        <!-- Comment list -->

        <ng-container
          *ngIf="
            !isLoading &&
            !errorMessage
          ">

          <div
            *ngFor="
              let group of visibleGroups
            "

            [id]="group.id"

            class="c-comment pixel-corners-cont">


            <!-- Name -->

            <h3 class="c-name">

              {{ filter(group.comment.Name) }}

            </h3>


            <!-- Timestamp -->

            <span class="c-timestamp">

              {{ timestamp(group.comment) }}

            </span>


            <!-- Website -->

            <a
              *ngIf="group.comment.Website"

              [href]="group.comment.Website"

              class="c-site"

              target="_blank"

              rel="noopener noreferrer">

              {{ cfg.websiteText }}

            </a>


            <!-- Text -->

            <p class="c-text">

              {{ filter(group.comment.Text) }}

            </p>


            <!-- Replies toggle -->

            <button
              *ngIf="
                cfg.collapsedReplies &&
                group.replies.length
              "

              type="button"

              class="c-expandButton"

              (click)="
                group.repliesExpanded =
                  !group.repliesExpanded
              ">

              {{ cfg.expandRepliesText }}
              ({{ group.replies.length }})

            </button>


            <!-- Replies -->

            <div
              *ngIf="group.replies.length"

              [id]="group.id + '-replies'"

              class="c-replyContainer"

              [style.display]="
                group.repliesExpanded
                  ? 'block'
                  : 'none'
              ">

              <div
                *ngFor="
                  let reply of group.replies
                "

                class="c-reply">


                <h3 class="c-name">

                  {{ filter(reply.Name) }}

                </h3>


                <span class="c-timestamp">

                  {{ timestamp(reply) }}

                </span>


                <a
                  *ngIf="reply.Website"

                  [href]="reply.Website"

                  class="c-site"

                  target="_blank"

                  rel="noopener noreferrer">

                  {{ cfg.websiteText }}

                </a>


                <p class="c-text">

                  {{ filter(reply.Text) }}

                </p>

              </div>

            </div>


            <!-- Reply -->

            <button
              *ngIf="cfg.commentsOpen"

              type="button"

              class="c-replyButton"

              (click)="openReply(group)">

              {{ cfg.replyButtonText }}

            </button>

          </div>


          <!-- Pagination -->

          <div
            *ngIf="totalPages > 1"

            id="c_pagination">


            <button
              type="button"

              class="c-paginationButton"

              (click)="changePage(-1)"

              [disabled]="page === 1">

              {{ cfg.leftButtonText }}

            </button>


            <span class="c-pageIndicator">

              {{ page }} / {{ totalPages }}

            </span>


            <button
              type="button"

              class="c-paginationButton"

              (click)="changePage(1)"

              [disabled]="page === totalPages">

              {{ cfg.rightButtonText }}

            </button>

          </div>

        </ng-container>

      </div>

    </div>
  `
})
export class CommentWidgetComponent implements OnInit, OnChanges {

  // ───────────────────────────────────────────────────────────────────────────
  // Input
  // ───────────────────────────────────────────────────────────────────────────

  @Input()
  config: Partial<CommentWidgetConfig> = {};


  // ───────────────────────────────────────────────────────────────────────────
  // Config
  // ───────────────────────────────────────────────────────────────────────────

  cfg!: CommentWidgetConfig;


  // ───────────────────────────────────────────────────────────────────────────
  // Comment state
  // ───────────────────────────────────────────────────────────────────────────

  isLoading = false;

  errorMessage: string | null = null;

  commentGroups: CommentGroup[] = [];

  visibleGroups: CommentGroup[] = [];

  page = 1;

  totalPages = 1;


  // ───────────────────────────────────────────────────────────────────────────
  // Form state
  // ───────────────────────────────────────────────────────────────────────────

  formName = '';

  formWebsite = '';

  formText = '';

  isSubmitting = false;

  submitSuccess = false;


  // ───────────────────────────────────────────────────────────────────────────
  // Reply state
  // ───────────────────────────────────────────────────────────────────────────

  replyingToId: string | null = null;

  replyingToName: string | null = null;


  // ───────────────────────────────────────────────────────────────────────────
  // Internal
  // ───────────────────────────────────────────────────────────────────────────

  private pagePath = '';

  private filterRegex: RegExp | null = null;

  private platformId = inject(PLATFORM_ID);

  private cdr = inject(ChangeDetectorRef);


  // ───────────────────────────────────────────────────────────────────────────
  // Lifecycle
  // ───────────────────────────────────────────────────────────────────────────

  ngOnInit(): void {

    this.applyConfig();

    if (isPlatformBrowser(this.platformId)) {
      this.loadComments();
    }
  }


  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['config'] &&
      !changes['config'].firstChange
    ) {

      this.applyConfig();

      if (isPlatformBrowser(this.platformId)) {
        this.loadComments();
      }
    }
  }


  // ───────────────────────────────────────────────────────────────────────────
  // Configuration
  // ───────────────────────────────────────────────────────────────────────────

  private applyConfig(): void {

    this.cfg = {
      ...DEFAULT_CONFIG,
      ...this.config
    };


    // Same behavior as original Rarebit setting.

    if (this.cfg.fixRarebitIndexPage) {
      this.cfg.includeUrlParameters = true;
    }


    // window does not exist during SSR.

    if (isPlatformBrowser(this.platformId)) {

      this.pagePath =
        window.location.pathname;

      if (
        this.cfg.includeUrlParameters
      ) {

        this.pagePath +=
          window.location.search;
      }

    } else {

      this.pagePath = '/';

    }


    // Rarebit index page fix.

    if (
      this.cfg.fixRarebitIndexPage &&
      this.pagePath === '/'
    ) {

      this.pagePath = '/?pg=1';

    }


    // Word filter.

    if (
      this.cfg.wordFilterOn &&
      this.cfg.filteredWords.length
    ) {

      const escapedWords =
        this.cfg.filteredWords.map(word =>
          word.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&'
          )
        );

      const joined =
        escapedWords.join('|');

      this.filterRegex =
        new RegExp(
          String.raw`\b(${joined})\b`,
          'ig'
        );

    } else {

      this.filterRegex = null;

    }
  }


  // ───────────────────────────────────────────────────────────────────────────
  // Google Sheets
  // ───────────────────────────────────────────────────────────────────────────

  loadComments(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }


    if (!this.cfg.sheetId) {

      this.errorMessage =
        'Google Sheet ID is missing.';

      return;
    }


    this.isLoading = true;

    this.errorMessage = null;


    /*
        IMPORTANT:

        The original JavaScript downloads the whole GViz
        response and dynamically finds the "Page" column.

        We intentionally do the same here.

        Do NOT assume Page is column E.
    */

    const url =
      `https://docs.google.com/spreadsheets/d/` +
      `${this.cfg.sheetId}/gviz/tq`;


    fetch(url)

      .then(response => {

        if (!response.ok) {

          throw new Error(
            'Could not find Google Sheet.'
          );
        }

        return response.text();

      })

      .then(raw => {

        const json =
          this.parseGvizResponse(raw);


        if (!json?.table) {

          throw new Error(
            'Invalid Google Sheets response.'
          );
        }


        const comments =
          this.parseComments(json);


        this.buildGroups(comments);


        // Always return to page 1 after loading.

        this.goToPage(1);


        this.isLoading = false;

        this.cdr.detectChanges();

      })

      .catch(error => {

        console.error(
          'Comment widget error:',
          error
        );


        this.errorMessage =
          error instanceof Error
            ? error.message
            : 'Could not load comments.';


        this.isLoading = false;

        this.cdr.detectChanges();

      });
  }


  // ───────────────────────────────────────────────────────────────────────────
  // Parse Google GViz response
  // ───────────────────────────────────────────────────────────────────────────

  private parseGvizResponse(raw: string): any {

    let text =
      raw.trim();


    /*
        Google may prepend:

            /*O_o*​/

        Remove that prefix.
    */

    text =
      text.replace(
        /^\/\*O_o\*\/\s*/,
        ''
      );


    /*
        Normal response:

        google.visualization.Query.setResponse(
            {...}
        );
    */

    const prefix =
      'google.visualization.Query.setResponse(';


    if (text.startsWith(prefix)) {

      text =
        text.slice(prefix.length);


      if (text.endsWith(');')) {

        text =
          text.slice(0, -2);

      } else if (text.endsWith(')')) {

        text =
          text.slice(0, -1);
      }
    }


    return JSON.parse(text);
  }


  // ───────────────────────────────────────────────────────────────────────────
  // Parse comments
  // ───────────────────────────────────────────────────────────────────────────

  private parseComments(json: any): Comment[] {

    const table =
      json?.table;


    if (
      !table ||
      !table.cols ||
      !table.rows
    ) {

      return [];
    }


    /*
        Find the Page column by label.

        This is exactly what the original
        JavaScript implementation does.
    */

    const pageIdx =
      table.cols.findIndex(
        (column: any) =>
          column.label === 'Page'
      );


    if (pageIdx === -1) {

      console.error(
        'Could not find "Page" column.',
        table.cols
      );

      throw new Error(
        'Could not find the "Page" column in the Google Sheet.'
      );
    }


    const comments: Comment[] = [];


    for (const row of table.rows) {

      const pageValue =
        row.c?.[pageIdx]?.v ?? '';


      /*
          Only comments belonging to
          the current URL are displayed.
      */

      if (
        pageValue !== this.pagePath
      ) {

        continue;
      }


      const comment: any = {};


      for (
        let i = 0;
        i < table.cols.length;
        i++
      ) {

        const column =
          table.cols[i];


        comment[column.label] =
          row.c?.[i]?.v ?? '';
      }


      /*
          The original widget uses the
          formatted timestamp for Timestamp2.
      */

      comment.Timestamp2 =
        row.c?.[0]?.f ??
        row.c?.[0]?.v ??
        '';


      comments.push(
        comment as Comment
      );
    }


    return comments;
  }


  // ───────────────────────────────────────────────────────────────────────────
  // Build comment groups
  // ───────────────────────────────────────────────────────────────────────────

  private buildGroups(
    comments: Comment[]
  ): void {

    /*
        Main comments first.

        Original JavaScript reverses them
        so newest comments appear first.
    */

    const mainComments =
      comments
        .filter(comment => !comment.Reply)
        .reverse();


    const replies =
      comments.filter(
        comment => !!comment.Reply
      );


    this.commentGroups =
      mainComments.map(comment => {

        const id =
          `${comment.Name}|--|${comment.Timestamp2}`;


        return {

          comment,

          id,

          replies:
            replies.filter(
              reply =>
                reply.Reply === id
            ),

          repliesExpanded:
            !this.cfg.collapsedReplies

        };

      });


    this.totalPages =
      Math.max(
        1,
        Math.ceil(
          this.commentGroups.length /
          this.cfg.commentsPerPage
        )
      );
  }


  // ───────────────────────────────────────────────────────────────────────────
  // Form submission
  // ───────────────────────────────────────────────────────────────────────────

  onSubmit(form: NgForm): void {

    if (
      !this.cfg.commentsOpen ||
      form.invalid ||
      this.isSubmitting
    ) {

      return;
    }


    if (
      !isPlatformBrowser(this.platformId)
    ) {

      return;
    }


    this.isSubmitting = true;

    this.errorMessage = null;


    /*
        This deliberately uses a real HTML form
        submission instead of fetch(..., no-cors).

        That matches the original widget's
        Google Forms submission method.
    */

    const hiddenForm =
      document.createElement('form');


    hiddenForm.method = 'POST';

    hiddenForm.action =
      `https://docs.google.com/forms/d/e/` +
      `${this.cfg.formId}/formResponse`;

    hiddenForm.target =
      'commentSubmitFrame';

    hiddenForm.style.display =
      'none';


    const addField =
      (
        name: string,
        value: string
      ) => {

        const input =
          document.createElement('input');

        input.type = 'hidden';

        input.name = name;

        input.value = value;

        hiddenForm.appendChild(input);
      };


    // Name

    addField(
      `entry.${this.cfg.nameId}`,
      this.formName
    );


    // Website

    addField(
      `entry.${this.cfg.websiteId}`,
      this.formWebsite
    );


    // Text

    addField(
      `entry.${this.cfg.textId}`,
      this.formText
    );


    // Page

    addField(
      `entry.${this.cfg.pageId}`,
      this.pagePath
    );


    // Reply

    if (this.replyingToId) {

      addField(
        `entry.${this.cfg.replyId}`,
        this.replyingToId
      );
    }


    /*
        Create target iframe.

        Google Forms does not need to return
        a readable response to us.
    */

    const iframe =
      document.createElement('iframe');

    iframe.name =
      'commentSubmitFrame';

    iframe.style.display =
      'none';


    document.body.appendChild(iframe);

    document.body.appendChild(hiddenForm);


    // Submit to Google Forms.

    hiddenForm.submit();


    /*
        Give Google Forms time to receive
        the submission, then reload comments.
    */

    setTimeout(() => {

      hiddenForm.remove();

      iframe.remove();


      this.formName = '';

      this.formWebsite = '';

      this.formText = '';


      this.cancelReply();


      this.submitSuccess = true;

      this.isSubmitting = false;


      this.cdr.detectChanges();


      setTimeout(() => {

        this.submitSuccess = false;

        this.loadComments();

      }, 1000);

    }, 800);
  }


  // ───────────────────────────────────────────────────────────────────────────
  // Pagination
  // ───────────────────────────────────────────────────────────────────────────

  goToPage(p: number): void {

    this.page =
      Math.max(
        1,
        Math.min(
          p,
          this.totalPages
        )
      );


    const min =
      this.cfg.commentsPerPage *
      (this.page - 1);


    const max =
      this.cfg.commentsPerPage *
      this.page;


    this.visibleGroups =
      this.commentGroups.slice(
        min,
        max
      );
  }


  changePage(delta: number): void {

    this.goToPage(
      this.page + delta
    );
  }


  // ───────────────────────────────────────────────────────────────────────────
  // Replies
  // ───────────────────────────────────────────────────────────────────────────

  openReply(
    group: CommentGroup
  ): void {

    if (
      this.replyingToId === group.id
    ) {

      this.cancelReply();

      return;
    }


    this.replyingToId =
      group.id;


    this.replyingToName =
      group.comment.Name;


    if (
      isPlatformBrowser(this.platformId)
    ) {

      document
        .getElementById('c_inputDiv')
        ?.scrollIntoView({
          behavior: 'smooth'
        });
    }
  }


  cancelReply(): void {

    this.replyingToId = null;

    this.replyingToName = null;
  }


  // ───────────────────────────────────────────────────────────────────────────
  // Word filter
  // ───────────────────────────────────────────────────────────────────────────

  filter(text: string): string {

    if (
      !this.cfg.wordFilterOn ||
      !this.filterRegex
    ) {

      return text;
    }


    return text.replace(
      this.filterRegex,
      this.cfg.filterReplacement
    );
  }


  // ───────────────────────────────────────────────────────────────────────────
  // Timestamp
  // ───────────────────────────────────────────────────────────────────────────

  timestamp(
    comment: Comment
  ): string {

    if (!comment.Timestamp) {
      return '';
    }


    /*
        Google normally returns:

        Date(2025,8,20,14,32,10)
    */

    const match =
      comment.Timestamp.match(
        /Date\(([-\d,\s]+)\)/
      );


    if (!match) {

      return '';
    }


    const vals =
      match[1]
        .split(',')
        .map(Number);


    if (
      vals.length < 6 ||
      vals.some(Number.isNaN)
    ) {

      return '';
    }


    const date =
      new Date(
        vals[0],
        vals[1],
        vals[2],
        vals[3],
        vals[4],
        vals[5]
      );


    /*
        Convert to configured timezone.
    */

    const timezoneDiff =
      (
        this.cfg.timezone * 60 +
        date.getTimezoneOffset()
      ) * -1;


    let d =
      new Date(
        date.getTime() +
        timezoneDiff * 60 * 1000
      );


    /*
        Apply DST just like the
        original JavaScript.
    */

    if (
      this.cfg.daylightSavings
    ) {

      d =
        this.applyDST(d);
    }


    return this.cfg.longTimestamp

      ? d.toLocaleString()

      : d.toLocaleDateString();
  }


  // ───────────────────────────────────────────────────────────────────────────
  // DST
  // ───────────────────────────────────────────────────────────────────────────

  private applyDST(
    date: Date
  ): Date {

    const start =
      this.getDSTDate(
        this.cfg.dstStart,
        date.getFullYear()
      );


    const end =
      this.getDSTDate(
        this.cfg.dstEnd,
        date.getFullYear()
      );


    const time =
      date.getTime();


    if (
      time >= start.getTime() &&
      time < end.getTime()
    ) {

      date.setHours(
        date.getHours() - 1
      );
    }


    return date;
  }


  private getDSTDate(
    config: [
      string,
      string,
      number,
      number
    ],
    year: number
  ): Date {

    const month =
      this.monthNum(config[0]);


    const weekday =
      this.dayNum(config[1]);


    const occurrence =
      config[2];


    const hour =
      config[3];


    return this.nthWeekday(
      weekday,
      occurrence,
      new Date(
        year,
        month,
        1
      ),
      hour
    );
  }


  private nthWeekday(
    day: number,
    n: number,
    from: Date,
    hour: number
  ): Date {

    let count = 0;

    const d =
      new Date(from);


    d.setDate(1);


    /*
        This intentionally follows the
        original JavaScript implementation.
    */

    while (count < n) {

      d.setDate(
        d.getDate() + 1
      );


      if (
        d.getDay() === day
      ) {

        count++;
      }
    }


    d.setHours(hour);

    return d;
  }


  // ───────────────────────────────────────────────────────────────────────────
  // Day/month conversion
  // ───────────────────────────────────────────────────────────────────────────

  private dayNum(
    day: string
  ): number {

    return [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday'
    ].indexOf(
      day.toLowerCase()
    );
  }


  private monthNum(
    month: string
  ): number {

    return [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december'
    ].indexOf(
      month.toLowerCase()
    );
  }
}
