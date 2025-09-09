import { DatePipe, DecimalPipe } from '@angular/common'
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { FlexModule } from '@ngbracket/ngx-layout/flex'

import { ICurrentWeather } from '../interfaces'
import { WeatherService } from '../weather/weather.service'

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css'],
  standalone: true,
  imports: [FlexModule, DecimalPipe, DatePipe],
})
export class CurrentWeatherComponent implements OnChanges {
  constructor(private weatherService: WeatherService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchText']) {
      // Perform actions when dataInput changes
      console.log('dataInput changed:', changes['searchText'].currentValue)
      this.populateCurrentWeather(changes['searchText'].currentValue)
    }
  }
  @Input() searchText!: string
  current!: ICurrentWeather

  populateCurrentWeather(userInput: string) {
    const userInputTokens = userInput.split(',').map((s) => s.trim())
    this.weatherService
      .getCurrentWeather(
        userInputTokens[0],
        userInputTokens.length > 1 ? userInputTokens[1] : undefined
      )
      .subscribe((data) => (this.current = data))
  }
  getOrdinal(date: number) {
    const n = new Date(date).getDate()
    return n > 0
      ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : ''
  }
}
