import { Component, DestroyRef, inject, OnInit } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs'

import { WeatherService } from '../weather/weather.service'

@Component({
  selector: 'app-city-search',
  templateUrl: './city-search.component.html',
  styleUrl: './city-search.component.css',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
})
export class CitySearchComponent implements OnInit {
  constructor(private weatherService: WeatherService) {}
  search = new FormControl('', [Validators.required, Validators.minLength(2)])
  private destroyRef = inject(DestroyRef)
  ngOnInit(): void {
    this.search.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(300),
        distinctUntilChanged(),
        filter((value): value is string => value !== null && this.search.valid),
        tap((searchValue: string) => this.populateCurrentWeather(searchValue)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe()
  }

  populateCurrentWeather(userInput: string) {
    const userInputTokens = userInput.split(',').map((s) => s.trim())
    this.weatherService.updateCurrentWeather(
      userInputTokens[0],
      userInputTokens.length > 1 ? userInputTokens[1] : undefined
    )
  }

  getErrorMessage() {
    return this.search.hasError('minlength')
      ? 'Type more than one character to search'
      : ''
  }
}
