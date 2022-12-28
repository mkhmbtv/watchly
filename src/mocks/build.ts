import {faker} from '@faker-js/faker'
import {UserFormData} from 'types/user'
import {Movie} from 'types/movies'

type UserCredentialsWithId = {
  id: string
} & UserFormData

function buildUser(overrides?: UserCredentialsWithId): UserCredentialsWithId {
  return {
    id: faker.datatype.uuid(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    ...overrides,
  }
}

function buildMovie(overrides?: Movie): Movie {
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

export {buildUser, buildMovie}
