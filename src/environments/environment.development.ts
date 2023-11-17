const baseTMDBUrl: string = 'https://api.themoviedb.org/3/';
const api: string = 'https://4gsgpp-8081.csb.app/api/';

export const environment = {
  movieSearchUrl: baseTMDBUrl + 'search/movie',
  tvSearchUrl: baseTMDBUrl + 'search/tv',
  multiSearchUrl: baseTMDBUrl + 'search/multi',
  accessTokenAuth:
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNzRmNDA5YmJjMTExNTY3Yjk5YjYxZmQxMmZkMzFkZSIsInN1YiI6IjYzNGRjZWMyZWY5ZDcyMDA5MTY0ZGEwNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5YVA4TnXy27q2v70iqdJUCE5WFupBXXiwc8jEzLYkNs',
  apiKeyAuth: 'd74f409bbc111567b99b61fd12fd31de',
  entriesurl: api + 'entries',
};
