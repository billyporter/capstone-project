import { mergeMap, switchMap, map, takeUntil } from 'rxjs/operators';
import { WikiSearchResult } from '../WikiSearchTemplate';
import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, ChangeDetectorRef, AfterContentChecked, AfterViewChecked, NgZone } from '@angular/core';
import { WikiServiceResult } from '../WikiServiceResult';
import { WikiResultsService } from '../wiki-results.service';
import { HttpClientModule } from '@angular/common/http';
import Languages from '../languages-word-for-history.json';
import { Subject } from 'rxjs';
import { SharedPlacesCityService } from 'src/app/services/shared-places-city.service';

interface LanguageData {
  [language: string]: AllLanguages;
}

interface AllLanguages {
  ['FullLangName']: string,
  ['WordForHistory']: string
}

@Component({
  selector: 'app-wiki-media-history-section',
  templateUrl: './wiki-media.component.html',
  styleUrls: ['./wiki-media.component.scss']
})

export class WikiMediaComponent implements OnChanges, OnInit {
  history: string[];
  title: string;
  error: string;
  destroy$ = new Subject<void>();
  loading = true;
  body: string[];
  urls = new Map();
  langlinks = new Map();
  languages: LanguageData = Languages as LanguageData;
  query: string;
  urlForAttribution: string;

  @Input() cityName!: string;

  constructor(private cityFetcher: SharedPlacesCityService, private wikiService: WikiResultsService, public zone: NgZone) { }

  ngOnInit(): void {
    this.cityFetcher.getCityName().subscribe(city => {
      this.cityName = city;
      if (city) {
        this.zone.run(() => this.getResults(this.cityName));
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes.cityName;
    if (!change.firstChange && change){
      this.getResults(this.cityName);
    }
  }

  getResults(queryString: string) {
    const currentQuery = queryString;
    let isOldRequest = false;
    this.wikiService.search(queryString, 'en', 'History')
      .subscribe((result: WikiServiceResult) => {
        if (result.history) {
          this.error = '';
          this.body = result.history;
          this.history = result.history;
          this.urls = result.furtherReading;
          this.title = result.title;
          this.loading = false;
          this.langlinks = result.langlinks;
          this.urlForAttribution = 'https://en.wikipedia.org/wiki/' + result.originalSearchQuery;
        }
        else {
          this.error = 'Unfortunately there is no history to display.';
          this.urlForAttribution = '';
        }
    });
  }

  changeLanguage(queryString: string, languagePrefix: string, wordForHistory: string) {
    this.wikiService.searchNewLang(queryString, languagePrefix, wordForHistory)
      .subscribe((result: WikiServiceResult) => {
        this.error = '';
        this.history = result.history;
        if (this.history.length > 0) {
          this.error = '';
          this.body = this.history;
          this.loading = false;
          this.title = result.title;
          this.urls = result.furtherReading;
          this.urlForAttribution = 'https://' + languagePrefix + '.wikipedia.org/wiki/' + queryString;
          if(result.langlinks && result.langlinks.size > 0) {
              this.langlinks = result.langlinks;
          }
        }
        else {
          this.loading = true;
          this.urlForAttribution = '';
          this.error = 'Unfortunately, the language you requested does not have an available tranlation '
          + 'for this page. Please select a different language.';
        }
    });
  }

  onChangeLanguage(prefix: string) {
      const language = this.langlinks.get(prefix);
      this.query = language.get('searchQuery');
      const wordForHistory = this.languages[prefix]['WordForHistory'];
      this.changeLanguage(this.query, prefix, wordForHistory);
  }
}
