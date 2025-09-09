import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { debounceTime, distinctUntilChanged } from 'rxjs'

import { WeatherService } from '../weather/weather.service'

@Component({
  selector: 'app-city-search',
  templateUrl: './city-search.component.html',
  styleUrl: './city-search.component.css',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
})
export class CitySearchComponent implements OnInit {
  @Output() searchEvent = new EventEmitter<string>()
  constructor(private weatherService: WeatherService) {}
  ngOnInit(): void {
    this.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchValue: string | null) => {
        if (!this.search.invalid) {
          console.log(`CURRENT VALUE ${searchValue}`)
          this.searchEvent.emit(searchValue as string)
        }
      })
  }
  search = new FormControl('', [Validators.minLength(2)])

  getErrorMessage() {
    return this.search.hasError('minlength')
      ? 'Type more than one character to search'
      : ''
  }
}
