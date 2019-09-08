import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  ProgressButtonDesign,
  ProgressButtonForm,
  ProgressButtonStatus,
  ProgressButtonType,
  ProgressButtonData, ProgressButtonAnimation
} from './progress-button.types';
import {Observable} from 'rxjs';

@Component({
  selector: 'ydd-progress-button',
  templateUrl: './progress-button.component.html',
  styleUrls: [
    './progress-button.component.vars.scss',
    './progress-button.component.scss',
    './progress-button.component.styles.scss']
})
export class ProgressButtonComponent implements OnInit {

  /** Private Props */
  private progressDefault: ProgressButtonData = {
    animation: 'fill',
    direction: 'horizontal',
    statusTime: 1500,
  };

  private designDefault: ProgressButtonDesign = {
    background: '#222222',
    color: '#FFFFFF',
    successBackground: '#00e175',
    errorBackground: '#ff0c00',
    successIconColor: '#ffffff',
    errorIconColor: '#ffffff',
    progressBackground: '#000000',
    progressInnerBackground: '#555555',
    linesSize: 10
  };

  private progressP: ProgressButtonData = this.progressDefault;
  private designP: ProgressButtonDesign = this.designDefault;

  /** Public Props */
  progressValue = 0;
  loading = false;
  noTransition = false;
  statusClass = '';

  /**
   * Specifies a name for the button
   */
  @Input() name: string;
  /**
   * Specifies an initial value for the button
   */
  @Input() value: string;
  /**
   * Specifies the type of button
   */
  @Input() type: ProgressButtonType = 'button';
  /**
   * Specifies that a button should automatically get focus when the page loads
   */
  @Input() autofocus = null;
  /**
   * Specifies that a button should be disabled
   */
  @Input() disabled = null;
  /**
   * Specifies form parameters for the button
   */
  @Input() form: ProgressButtonForm;

  /**
   *  Fires on a mouse click on the element
   */
  @Output() action = new EventEmitter();

  constructor() {
  }

  /**
   * Execute click action
   */
  click() {
    this.action.emit(this);
  }

  /**
   * Init the progress component
   */
  progressInit() {
    this.disabled = true;
    this.loading = true;
    this.noTransition = false;
    this.progressValue = 0;
  }

  /**
   * Stop the progress animation
   * @param status ProgressButtonStatus State of stop (error, success)
   * @return Observable An observable with after-init and complete steps
   */
  progressStop(status: ProgressButtonStatus): Observable<string> {
    return new Observable((observer) => {
      observer.next('before-init');
      const tim1 = setTimeout(() => {
        this.noTransition = true;
        this.progressValue = 0;
        this.loading = false;
        this.statusClass = ('state-' + status);
        observer.next('after-init');
        const tim2 = setTimeout(() => {
          this.statusClass = '';
          this.disabled = null;
          observer.complete();
          clearTimeout(tim1);
          clearTimeout(tim2);
        }, this.progress.statusTime);
      }, 300);
    });
  }

  /**
   * Tell if the progress is 3d perspective
   * @return mix The attribute data-perspective value
   */
  get perspective() {
    return (this.progress.animation.includes('rotate-') || this.progress.animation.includes('flip-')) ? '' : null;
  }

  /**
   * Get css style of the button
   */
  get buttonStyle() {
    return {
      background: (this.perspective === null) ? this.mainBackgroundColor : null,
      color: this.design.color
    };
  }

  /**
   * Get the background color of the button according to the status
   */
  get mainBackgroundColor() {
    let bg = this.design.background;
    switch (this.statusClass) {
      case 'state-success':
        bg = this.design.successBackground;
        break;
      case 'state-error':
        bg = this.design.errorBackground;
        break;
    }
    return bg;
  }

  /**
   * Get the content style according to the status
   */
  get contentStyle() {
    return {
      background: (this.perspective === '' || this.isAnimation('slide-down') || this.isAnimation('move-up')) ?
        this.mainBackgroundColor : null,
      color: this.design.color
    };
  }

  /**
   * Get the Progress Inner Style
   */
  get progressInnerStyle() {

    const style = {
      background: this.design.progressInnerBackground,
      borderColor: null,
      borderLeftWidth: null,
      borderRightWidth: null,
      height: null,
      width: null,
    };

    // Lateral Lines
    if (this.isAnimation('lateral-lines')) {
      style.background = null;
      style.borderColor = this.design.progressInnerBackground;
      if (this.design.linesSize) {
        style.borderLeftWidth = this.design.linesSize + 'px';
        style.borderRightWidth = this.design.linesSize + 'px';
      }
    }

    if (this.isHorizontal()) {
      style.width = this.progressValue + '%';
      style.height = (this.isAnimation('top-line') && this.design.linesSize) ? this.design.linesSize + 'px' : null;
    } else {
      style.height = this.progressValue + '%';
      style.width = (this.isAnimation('top-line') && this.design.linesSize) ? this.design.linesSize + 'px' : null;
    }

    return style;
  }

  /**
   * Check if animation is active
   * @param name ProgressButtonAnimation Animation name
   */
  isAnimation(name: ProgressButtonAnimation) {
    return (this.progress.animation === name);
  }

  /**
   * Check if progress direction is horizontal
   */
  isHorizontal() {
    return (this.progress.direction === 'horizontal');
  }

  /**
   * Check if vertical direction is forced
   */
  isForcedVerticalDirection() {
    return (this.progress.animation === 'lateral-lines');
  }

  /**
   * Progress Button Data
   * @param progress ProgressButtonData The Progress Button Data
   */
  @Input()
  set progress(progress: ProgressButtonData) {
    this.progressP = Object.assign({}, this.progressDefault, progress);
    this.progressP.direction = (this.isForcedVerticalDirection()) ? 'vertical' : this.progressP.direction;
  }

  /**
   * The Progress Button Data
   */
  get progress(): ProgressButtonData {
    return this.progressP;
  }

  /**
   * Progress Button Design
   * @param design ProgressButtonDesign The Progress Button Design
   */
  @Input()
  set design(design: ProgressButtonDesign) {
    this.designP = Object.assign({}, this.designDefault, design);
  }

  /**
   * The Progress Button Design
   */
  get design(): ProgressButtonDesign {
    return this.designP;
  }

  ngOnInit() {
  }

}
