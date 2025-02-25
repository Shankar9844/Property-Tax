import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
  private versionSource = new BehaviorSubject<string | null>(null);
  currentVersion = this.versionSource.asObservable();

  updateVersion(version: string | null) {
    this.versionSource.next(version);
  }

}
