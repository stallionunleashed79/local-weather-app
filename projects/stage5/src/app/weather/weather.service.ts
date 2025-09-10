import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { environment } from '../../environments/environment'
import { ICurrentWeather } from '../interfaces'

interface ICurrentWeatherData {
  weather: [
    {
      description: string
      icon: string
    },
  ]
  main: {
    temp: number
  }
  sys: {
    country: string
  }
  dt: number
  name: string
}

export interface IWeatherService {
  getCurrentWeather(search: string, country?: string): Observable<ICurrentWeather>
  getCurrentWeatherByCoords(coords: GeolocationCoordinates): Observable<ICurrentWeather>
  readonly currentWeather$: BehaviorSubject<ICurrentWeather>
  updateCurrentWeather(search: string, country?: string): void
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService implements IWeatherService {
  constructor(private httpClient: HttpClient) {}
  updateCurrentWeather(search: string, country?: string): void {
    this.getCurrentWeather(search, country).subscribe((currentWeather) =>
      this.currentWeather$.next(currentWeather)
    )
  }
  currentWeather$: BehaviorSubject<ICurrentWeather> =
    new BehaviorSubject<ICurrentWeather>({
      city: '--',
      country: '--',
      date: Date.now(),
      image: '',
      temperature: 0,
      description: '',
    })

  getCurrentWeatherByCoords(coords: GeolocationCoordinates): Observable<ICurrentWeather> {
    const uriParams = new HttpParams()
      .set('lat', coords.latitude.toString())
      .set('lon', coords.longitude.toString())
    return this.getCurrentWeatherHelper(uriParams)
  }

  getCurrentWeather(search: string, country?: string): Observable<ICurrentWeather> {
    let params = new HttpParams()
    if (typeof search === 'string') {
      params = params.set('q', country ? `${search},${country}` : search)
    } else {
      params = params.set('zip', search)
    }
    return this.getCurrentWeatherHelper(params)
  }

  private getCurrentWeatherHelper(params: HttpParams): Observable<ICurrentWeather> {
    params = params.set('appid', environment.appId)
    return this.httpClient
      .get<ICurrentWeatherData>(
        `${environment.baseUrl}api.openweathermap.org/data/2.5/weather`,
        { params }
      )
      .pipe(map((data) => this.transformToICurrentWeather(data)))
  }

  private transformToICurrentWeather(data: ICurrentWeatherData): ICurrentWeather {
    return {
      city: data.name,
      country: data.sys.country,
      date: data.dt * 1000,
      image: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      temperature: this.convertKelvinToFahrenheit(data.main.temp),
      description: data.weather[0].description,
    }
  }

  private convertKelvinToFahrenheit(kelvin: number): number {
    return (kelvin * 9) / 5 - 459.67
  }
}
