import * as moviesDB from './movies'
import {HttpError} from '../error'
import {LogEntry} from 'types/log-entry'

const logEntriesKey = '__watchly_log_entries__'
type LogEntryStore = {
  [key: string]: LogEntry
}

let logEntries: LogEntryStore = {}

const persist = () =>
  window.localStorage.setItem(logEntriesKey, JSON.stringify(logEntries))
const load = () =>
  Object.assign(
    logEntries,
    JSON.parse(window.localStorage.getItem(logEntriesKey) || ''),
  )

try {
  load()
} catch (error) {
  persist()
}

async function create({
  movieId,
  userId,
  notes = '',
  rating = -1,
  watchedDate = null,
  favorite = false,
}: Omit<LogEntry, 'id'>): Promise<LogEntry> {
  if (!movieId) {
    throw new HttpError(400, 'movieId is required')
  }
  if (!userId) {
    throw new HttpError(400, 'userId is required')
  }

  const id = hash(`${movieId}${userId}`)
  if (logEntries[id]) {
    throw new HttpError(400, 'This user cannot create log entry for that movie')
  }
  const movie = await moviesDB.read(movieId)
  if (!movie) {
    throw new HttpError(400, `No movie found with the ID of ${movieId}`)
  }
  logEntries[id] = {id, movieId, userId, notes, rating, watchedDate, favorite}
  persist()
  return read(id)
}

async function update(
  id: string,
  updates: Partial<LogEntry>,
): Promise<LogEntry> {
  validateLogEntry(id)
  Object.assign(logEntries[id], updates)
  persist()
  return read(id)
}

async function remove(id: string): Promise<void> {
  validateLogEntry(id)
  delete logEntries[id]
  persist()
}

async function readMany(
  userId: string,
  logEntryIds: string[],
): Promise<LogEntry[]> {
  return Promise.all(
    logEntryIds.map(id => {
      authorize(userId, id)
      return read(id)
    }),
  )
}

async function readByUser(userId: string): Promise<LogEntry[]> {
  return Object.values(logEntries).filter(entry => entry.userId === userId)
}

async function authorize(userId: string, logEntryId: string): Promise<void> {
  const logEntry = await read(logEntryId)
  if (logEntry.userId !== userId) {
    throw new HttpError(403, 'You are not authorized to view that log entry')
  }
}

function read(id: string): LogEntry {
  validateLogEntry(id)
  return logEntries[id]
}

function validateLogEntry(id: string): void {
  load()
  if (!logEntries[id]) {
    throw new HttpError(404, `No log entry with the id of ${id}`)
  }
}

function hash(str: string): string {
  let hash = 5381,
    i = str.length

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }
  return String(hash >>> 0)
}

async function reset() {
  logEntries = {}
  persist()
}

export {authorize, create, update, remove, read, readMany, readByUser, reset}
