import Dexie, { type EntityTable } from 'dexie'
import type { NewParkingRecord, ParkingRecord } from '../types/parking'

class ParkingDatabase extends Dexie {
  records!: EntityTable<ParkingRecord, 'id'>

  constructor() {
    super('parking-location-db')
    this.version(1).stores({
      records: 'id, parkedAt',
    })
  }
}

export const parkingDb = new ParkingDatabase()

export async function addParkingRecord(input: NewParkingRecord) {
  const record: ParkingRecord = {
    ...input,
    id: crypto.randomUUID(),
    parkedAt: new Date().toISOString(),
  }

  await parkingDb.records.add(record)
  return record
}

export function getParkingRecords() {
  return parkingDb.records.orderBy('parkedAt').reverse().toArray()
}

export function deleteParkingRecord(id: string) {
  return parkingDb.records.delete(id)
}