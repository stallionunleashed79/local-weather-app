import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { defaultIfEmpty, flatMap, Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

import { IPostalCode, IPostalCodeData, IPostalCodeService } from './models/postal.code'

@Injectable({
  providedIn: 'root',
})
export class PostalCodeService implements IPostalCodeService {
  constructor(private httpClient: HttpClient) {}
  resolvePostalCode(postalCode: string): Observable<IPostalCode | null> {
    const params = new HttpParams()
      .set('maxRows', 1)
      .set('username', environment.username)
      .set('postalcode', postalCode)
    return this.httpClient
      .post<IPostalCodeData>(
        `${environment.baseUrl}${environment.geonamesApi}.geonames.org/
        postalCodeSearchJSON`,
        { params }
      )
      .pipe(
        flatMap((data) => data.postalCodes),
        defaultIfEmpty(null)
      )
  }
}
