export interface Entry {
    title: string
    overview: string
    image: string
    genres: Genre[]
    apiId: string
    mediaType: string
    season?: string
    seasonId?: string
    format: string[]
}

interface Genre {
    id: number
    name:string
}