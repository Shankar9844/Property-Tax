import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  isLoading = new BehaviorSubject<boolean>(false);
  private delayDuration = 1000;  // Minimum delay of 2 seconds
  private timeoutId: any = null;

  show() {
    if (!this.isLoading.getValue()) {
      this.isLoading.next(true);
    }
  }

  hide() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.isLoading.next(false);
      this.timeoutId = null;
    }, this.delayDuration);
  }
}
