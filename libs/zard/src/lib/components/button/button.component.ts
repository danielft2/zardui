import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, ViewEncapsulation } from '@angular/core';
import { ClassValue } from 'class-variance-authority/dist/types';

import { buttonVariants, ZardButtonVariants } from './button.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';

@Component({
  selector: 'z-button, button[z-button], a[z-button]',
  exportAs: 'zButton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (zLoading()) {
      <span zType="cached" class="icon-loader-circle animate-spin"></span>
    }

    <ng-content></ng-content>
  `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardButtonComponent {
  private readonly elementRef = inject(ElementRef);

  readonly zType = input<ZardButtonVariants['zType']>('default');
  readonly zSize = input<ZardButtonVariants['zSize']>('default');
  readonly zShape = input<ZardButtonVariants['zShape']>('default');

  readonly class = input<ClassValue>('');

  readonly zFull = input(false, { transform });
  readonly zLoading = input(false, { transform });

  protected readonly classes = computed(() =>
    mergeClasses(
      buttonVariants({ zType: this.zType(), zSize: this.iconOnly() ? 'icon' : this.zSize(), zShape: this.zShape(), zFull: this.zFull(), zLoading: this.zLoading() }),
      this.class(),
    ),
  );

  private iconOnly(): boolean {
    const childNodes = Array.from((this.elementRef?.nativeElement as HTMLButtonElement)?.childNodes || []);
    return childNodes.every(node => !['#text', 'SPAN'].includes(node.nodeName));
  }
}
