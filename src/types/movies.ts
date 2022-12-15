export interface Movie {
  id: string
  image: string
  title: string
  description: string
  runtimeStr: string
  genres: string
  contentRating: string
  imDbRating: string
  imDbRatingVotes: string
  metacriticRating: string
  plot: string
  stars: string
  starList: Star[]
  loadingMovie?: boolean
}

interface Star {
  id: string
  name: string
}
