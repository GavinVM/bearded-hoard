const baseTMDBUrl: string = 'https://api.themoviedb.org/3/';
const cexSearchApiBase: string = 'https://search.webuy.io/1/indexes/prod_cex_uk';

export const environment = {
  production: true,
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
    ['page', '0'],
    ['hitsPerPage', '10'],
    ['query', 'Blu-Ray'],
  ])
};
