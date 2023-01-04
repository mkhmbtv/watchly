import {faker} from '@faker-js/faker'
import {AuthUser, UserCredentialsWithId} from 'types/user'
import {Movie} from 'types/movie'
import {LogEntryWithMovie} from 'types/log-entry'

function buildUser(
  overrides?: Partial<UserCredentialsWithId>,
): UserCredentialsWithId {
  return {
    id: faker.datatype.uuid(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    ...overrides,
  }
}

function buildMovie(overrides?: Partial<Movie>): Movie {
  const starList = Array.from({length: 4}, () => ({
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
  }))

  return {
    id: faker.datatype.uuid(),
    image: faker.image.imageUrl(),
    title: faker.lorem.words(),
    description: `(${faker.date.between('1900', '2023').getFullYear()})`,
    runtimeStr: `${faker.datatype.number(300)} min`,
    genres: faker.lorem.word(),
    contentRating: faker.random.alpha({casing: 'upper'}),
    imDbRating: faker.datatype.float({max: 10}).toString(),
    imDbRatingVotes: faker.datatype.number().toString(),
    plot: faker.lorem.paragraph(),
    stars: starList.map(star => star.name).join(', '),
    starList,
    ...overrides,
  }
}

function buildLogEntry(
  overrides?: Partial<LogEntryWithMovie> & {user?: AuthUser},
): LogEntryWithMovie {
  const {
    movieId = overrides?.movie ? overrides.movie.id : faker.datatype.uuid(),
    watchedDate = faker.date.past(2).getTime(),
    user = {id: faker.datatype.uuid()},
  } = overrides || {}
  return {
    id: faker.datatype.uuid(),
    movieId,
    userId: user.id,
    notes: faker.datatype.boolean() ? '' : faker.lorem.paragraph(),
    rating: faker.datatype.number(5),
    watchedDate,
    favorite: faker.datatype.boolean(),
    movie: buildMovie({id: movieId}),
    ...overrides,
  }
}

export {buildUser, buildMovie, buildLogEntry}
