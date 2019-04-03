import './styles.css';

import { fromEvent, Observable, from, of } from 'rxjs';
import { filter, switchMap, map, catchError, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { GithubUserResponseModel, UserModel } from './models/github-user-response.model';

const searchInputSel: string = '[data-app="search-input"]';
const searchResultSel: string = '[data-app="search-result"]';

const getUsers: string = 'https://api.github.com/search/users';

const searchInputEl = document.querySelector(searchInputSel) as HTMLInputElement;
let resultContainerEl = document.querySelector(searchResultSel) as HTMLDivElement;

const search$: Observable<GithubUserResponseModel> = fromEvent(searchInputEl, 'keyup')
  .pipe(
    debounceTime(500),
    map((event: Event) => (event.target as any).value.trim()),
    filter(i => !!i),
    distinctUntilChanged(),
    tap(_ => clearResultContainer()),
    switchMap(term => getRemoteData(term)
      .pipe(
        catchError(_ => of({total_count: 0, items: []}))
      )
    )
  );
search$.subscribe(res => renderResponse(res));  

function clearResultContainer(): void {
  if (resultContainerEl) {
    document.body.removeChild(resultContainerEl);
    resultContainerEl = document.createElement('div');
    resultContainerEl.setAttribute('data-app', 'search-result');
    document.body.appendChild(resultContainerEl);
  }
}

function getRemoteData(term: string): Observable<GithubUserResponseModel> {
  const url: string = `${getUsers}?q=${term}`;
  return from(fetch(url).then(res => res.json()));
}

function renderResponse(response: GithubUserResponseModel): void {
  if (!response.items || !response.items.length) {
    resultContainerEl.innerText = 'Нет результатов';

    return;
  }

  response.items
    .map((user: UserModel) => {
      const link = document.createElement('a');
      link.href = user.html_url;
      link.innerText = user.login;
      
      const avatar = document.createElement('img');
      avatar.src = user.avatar_url;
      
      const el =  document.createElement('div');
      el.appendChild(avatar);
      el.appendChild(link);

      return el;
    })
    .forEach(el => resultContainerEl.appendChild(el));
}