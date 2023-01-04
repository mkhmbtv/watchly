import {Movie} from './movie'

export interface LogEntry {
  id: string
  movieId: string
  userId: string
  notes?: string
  rating?: number
  watchedDate?: number | null
  favorite?: boolean
}

export interface LogEntryWithMovie extends LogEntry {
  movie: Movie
}
