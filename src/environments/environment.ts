// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const baseTMDBUrl: string = 'https://api.themoviedb.org/3/';
// const api: string = 'https://4gsgpp-8081.csb.app/api/';
const api: string = 'http://localhost:8081/api/';
const cexSearchApiBase: string = 'https://search.webuy.io/1/indexes/prod_cex_uk';

export const environment = {
  production: false,
  movieSearchUrl: baseTMDBUrl + 'search/movie',
  movieDetailsByIdUrl: baseTMDBUrl + 'movie/',
  movieGenreListUrl: baseTMDBUrl + 'genre/movie/list',
  tvSearchUrl: baseTMDBUrl + 'search/tv',
  tvDetailsByIdUrl: baseTMDBUrl + 'tv/',
  tvGenreListUrl: baseTMDBUrl + 'genre/tv/list',
  multiSearchUrl: baseTMDBUrl + 'search/multi',
  accessTokenAuth:
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNzRmNDA5YmJjMTExNTY3Yjk5YjYxZmQxMmZkMzFkZSIsInN1YiI6IjYzNGRjZWMyZWY5ZDcyMDA5MTY0ZGEwNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5YVA4TnXy27q2v70iqdJUCE5WFupBXXiwc8jEzLYkNs',
  apiKeyAuth: 'd74f409bbc111567b99b61fd12fd31de',
  tmdbImageBase: 'https://image.tmdb.org/t/p/original',
  icons: (icon:string, outlined?:boolean | false) => {
    return `/assets/icon/${icon}${outlined ? '-outline':''}.svg`
  },
  cexSearchApiBase: 'https://search.webuy.io/1/indexes/prod_cex_uk',
  cexDefaultSearchParams: new Map<string, string>([
    ['page', '1'],
    ['hitsPerPage', '1000'],
    ['query', 'Blu-Ray 4k'],
  ])
};

// https://search.webuy.io/1/indexes/prod_cex_uk?page=2&hitsPerPage=100&query=categoryName=Blu-Ray%204k



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
