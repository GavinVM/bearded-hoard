import { Genre } from "./genre.model"

export interface Entry {
    title: string,
    overview: string,
    image: string
    genres: Genre[],
    apiId: number,
    kind: string
}