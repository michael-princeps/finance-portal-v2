import { ErrorHandler, Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChunkErrorService implements ErrorHandler {

  handleError(error: any): void {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    if (chunkFailedMessage.test(error.message)) {
      if (confirm('New update available. Download new version?')) {
        window.location.reload();
      }
    } else {
      console.error(error)
    }
  }
}
