import MockPhotosPa from 'src/app/modules/photos/assets/mock-images-one.json';
import MockPhotosBos from 'src/app/modules/photos/assets/mock-images-two.json';
import MockPhotosPj from 'src/app/modules/photos/assets/mock-pjs.json';
import MockPhotosCol from 'src/app/modules/photos/assets/mock-colonial-theater.json';
import MockPhotosVal from 'src/app/modules/photos/assets/mock-valley.json';
import MockPhotosFan from 'src/app/modules/photos/assets/mock-faneuil.json';
import MockPhotosAq from 'src/app/modules/photos/assets/mock-aquarium.json';
import MockPhotosTea from 'src/app/modules/photos/assets/mock-tea-party.json';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockPhotoFetcher {

  getPhotos(query: string, limit: number): Observable<any> {
    if (query.includes('Boston')) {
      if (query.includes('Tea Party')) {
        return of(MockPhotosTea);
      }
      else if (query.includes('Faneuil Hall')) {
        return of(MockPhotosFan);
      }
      else if (query.includes('1920')) {
        return of(MockPhotosBos);
      }
      else {
        return of(MockPhotosAq);
      }
    }
    else {
      if (query.includes('Pj')) {
        return of(MockPhotosPj);
      }
      else if (query.includes('Colonial')) {
        return of(MockPhotosCol);
      }
      else if (query.includes('1910')) {
        return of(MockPhotosPa);
      }
      else {
        return of(MockPhotosVal);
      }
    }
  }

}
