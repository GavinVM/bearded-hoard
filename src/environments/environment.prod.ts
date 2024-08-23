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
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZjg0NmZjNzQ0NTFhYjQ5NTZlNDYyMzY5MjY3MTJkYSIsIm5iZiI6MTcyMjYzOTc1Ni45NTQxLCJzdWIiOiI2MzRkY2VjMmVmOWQ3MjAwOTE2NGRhMDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.u8eENujPod8XnSgZP-wy_xmbZbzBYOBhpPBTlIW-LcE',
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
