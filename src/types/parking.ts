export interface ParkingRecord {
  id: string
  latitude: number
  longitude: number
  accuracy: number
  parkedAt: string
  locationNote: string
  memo: string
  photo?: Blob
}

export type NewParkingRecord = Omit<ParkingRecord, 'id' | 'parkedAt'>