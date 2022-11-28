import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { PickerController } from '@ionic/angular';
import {ViewportRuler} from '@angular/cdk/scrolling';
import { supportsScrollBehavior } from '@angular/cdk/platform';

const scrollBehaviorSupported = supportsScrollBehavior();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ionic';
  private _previousHTMLStyles = {top: '', left: ''};
  private _previousScrollPosition!: {top: number; left: number};

  constructor(
    private pickerCtrl: PickerController,
    private _viewportRuler: ViewportRuler,
    @Inject(DOCUMENT) protected document: Document
  ) {}

  async openPicker() {
    const picker = await this.pickerCtrl.create({
      columns: [
        {
          name: 'languages',
          options: [
            {
              text: 'JavaScript',
              value: 'javascript',
            },
            {
              text: 'TypeScript',
              value: 'typescript',
            },
            {
              text: 'Rust',
              value: 'rust',
            },
            {
              text: 'C#',
              value: 'c#',
            },
          ],
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: (value) => {
            window.alert(`You selected: ${value.languages.value}`);
          },
        },
      ],
    });
    // picker.onDidPresent().then(() => this.addNoScroll());
    await picker.present();
    picker.onWillDismiss().then(() => this.removeNoScroll());
    this.addNoScroll();
  }

  private addNoScroll() {
    const body = this.document.body;
    const documentElement = this.document.documentElement;
    this._previousScrollPosition = this._viewportRuler.getViewportScrollPosition();
    this._previousHTMLStyles.left = documentElement.style.left || '';
    this._previousHTMLStyles.top = documentElement.style.top || '';
    const y = documentElement.scrollTop;
    documentElement.style.left = this.coerceCssPixelValue(-this._previousScrollPosition.left);
    documentElement.style.top = this.coerceCssPixelValue(-this._previousScrollPosition.top);
    documentElement.classList.add('cdk-global-scrollblock');
  }

  removeNoScroll() : void {
    const html = this.document.documentElement!;
    const body = this.document.body!;
    const htmlStyle = html.style;
    const bodyStyle = body.style;
    const previousHtmlScrollBehavior = htmlStyle.scrollBehavior || '';
    const previousBodyScrollBehavior = bodyStyle.scrollBehavior || '';

    htmlStyle.left = this._previousHTMLStyles.left;
    htmlStyle.top = this._previousHTMLStyles.top;
    html.classList.remove('cdk-global-scrollblock');

    // Disable user-defined smooth scrolling temporarily while we restore the scroll position.
    // See https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior
    // Note that we don't mutate the property if the browser doesn't support `scroll-behavior`,
    // because it can throw off feature detections in `supportsScrollBehavior` which
    // checks for `'scrollBehavior' in documentElement.style`.
    if (scrollBehaviorSupported) {
      htmlStyle.scrollBehavior = bodyStyle.scrollBehavior = 'auto';
    }

    window.scroll(this._previousScrollPosition.left, this._previousScrollPosition.top);

    if (scrollBehaviorSupported) {
      htmlStyle.scrollBehavior = previousHtmlScrollBehavior;
      bodyStyle.scrollBehavior = previousBodyScrollBehavior;
    }
  }

   coerceCssPixelValue(value: any): string {
    if (value == null) {
      return '';
    }
  
    return typeof value === 'string' ? value : `${value}px`;
  }
}
