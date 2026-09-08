import { useEffect, useState, type FormEvent } from 'react'
import { Camera, CarFront, Clock3, ExternalLink, LocateFixed, MapPin, Navigation, Trash2, WifiOff, X } from 'lucide-react'
import { addParkingRecord, deleteParkingRecord, getParkingRecords } from './db/parkingDb'
import { getCurrentLocation } from './services/geolocation'
import { compressImage } from './services/image'
import type { ParkingRecord } from './types/parking'
import './App.css'

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
})

function Photo({ blob, alt }: { blob: Blob; alt: string }) {
  const [url] = useState(() => URL.createObjectURL(blob))
  useEffect(() => {
    return () => URL.revokeObjectURL(url)
  }, [url])
  return <img src={url} alt={alt} />
}

function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [url] = useState(() => URL.createObjectURL(file))
  useEffect(() => {
    return () => URL.revokeObjectURL(url)
  }, [url])
  return <div className="photo-preview"><img src={url} alt="선택한 주차 사진 미리보기" /><button type="button" onClick={onRemove} aria-label="선택한 사진 제거" title="사진 제거"><X size={16} /></button></div>
}

function mapUrl(record: ParkingRecord) {
  return `https://www.openstreetmap.org/?mlat=${record.latitude}&mlon=${record.longitude}#map=18/${record.latitude}/${record.longitude}`
}

function App() {
  const [records, setRecords] = useState<ParkingRecord[]>([])
  const [locationNote, setLocationNote] = useState('')
  const [memo, setMemo] = useState('')
  const [photo, setPhoto] = useState<File>()
  const [selectedRecord, setSelectedRecord] = useState<ParkingRecord>()
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  async function refreshRecords() {
    setRecords(await getParkingRecords())
  }

  useEffect(() => {
    void getParkingRecords().then(setRecords)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSaving) return
    setIsSaving(true)
    setMessage('GPS 위치를 확인하고 있습니다...')
    try {
      const location = await getCurrentLocation()
      setMessage(photo ? '사진을 정리하고 있습니다...' : '위치를 저장하고 있습니다...')
      const compressedPhoto = photo ? await compressImage(photo) : undefined
      await addParkingRecord({ ...location, locationNote: locationNote.trim(), memo: memo.trim(), photo: compressedPhoto })
      await refreshRecords()
      setLocationNote('')
      setMemo('')
      setPhoto(undefined)
      setMessage('주차 위치를 저장했습니다.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '저장 중 문제가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(record: ParkingRecord) {
    if (!window.confirm('이 주차 기록을 삭제할까요?')) return
    await deleteParkingRecord(record.id)
    setSelectedRecord(undefined)
    await refreshRecords()
    setMessage('주차 기록을 삭제했습니다.')
  }

  const currentRecord = records[0]

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true"><CarFront size={25} strokeWidth={2.2} /></div>
        <div><p className="eyebrow">PARKING NOTE</p><h1>내 차 어디에?</h1></div>
        {!isOnline && <span className="offline-badge"><WifiOff size={14} /> 오프라인</span>}
      </header>

      <main>
        <section className="current-section" aria-labelledby="current-title">
          <div className="section-heading"><div><p className="section-kicker">CURRENT SPOT</p><h2 id="current-title">현재 주차 위치</h2></div><MapPin aria-hidden="true" /></div>
          {currentRecord ? (
            <button className="current-record" type="button" onClick={() => setSelectedRecord(currentRecord)}>
              {currentRecord.photo && <span className="current-photo"><Photo blob={currentRecord.photo} alt="현재 주차 위치" /></span>}
              <span className="current-copy"><strong>{currentRecord.locationNote || '위치 메모 없음'}</strong><span><Clock3 size={15} /> {dateFormatter.format(new Date(currentRecord.parkedAt))}</span><span>GPS 오차 약 {Math.round(currentRecord.accuracy)}m</span></span>
              <Navigation size={20} aria-hidden="true" />
            </button>
          ) : (
            <div className="empty-current"><LocateFixed size={32} aria-hidden="true" /><p>아직 저장된 위치가 없습니다.</p><span>아래에서 첫 주차 위치를 기록해 보세요.</span></div>
          )}
        </section>

        <section className="save-section" aria-labelledby="save-title">
          <div className="section-heading compact"><div><p className="section-kicker">SAVE A SPOT</p><h2 id="save-title">지금 위치 기록</h2></div></div>
          <form onSubmit={handleSubmit}>
            <label><span>층 · 구역</span><input value={locationNote} onChange={(event) => setLocationNote(event.target.value)} placeholder="예: B2층 C-18" maxLength={60} /></label>
            <label><span>메모</span><textarea value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="예: 엘리베이터 3번 출구 앞" rows={3} maxLength={240} /></label>
            <div className="photo-row">
              <label className="photo-button"><Camera size={19} /><span>{photo ? '사진 바꾸기' : '사진 추가'}</span><input type="file" accept="image/*" capture="environment" onChange={(event) => setPhoto(event.target.files?.[0])} /></label>
              {photo && <FilePreview file={photo} onRemove={() => setPhoto(undefined)} />}
            </div>
            <button className="save-button" type="submit" disabled={isSaving}><LocateFixed size={21} />{isSaving ? '위치 확인 중...' : '현재 위치 저장'}</button>
            <p className="permission-note">저장할 때만 GPS 위치 권한을 요청합니다.</p>
            {message && <p className="status-message" role="status" aria-live="polite">{message}</p>}
          </form>
        </section>

        <section className="history-section" aria-labelledby="history-title">
          <div className="section-heading compact"><div><p className="section-kicker">HISTORY</p><h2 id="history-title">주차 기록</h2></div><span className="record-count">{records.length}</span></div>
          {records.length > 0 ? <div className="record-list">{records.map((record, index) => (
            <article className="record-card" key={record.id}>
              <button type="button" onClick={() => setSelectedRecord(record)}>
                {record.photo ? <span className="record-photo"><Photo blob={record.photo} alt="주차 위치 사진" /></span> : <span className="record-placeholder"><MapPin size={20} /></span>}
                <span className="record-copy"><span className="record-title">{record.locationNote || '위치 메모 없음'}{index === 0 && <small>현재</small>}</span><span>{dateFormatter.format(new Date(record.parkedAt))}</span>{record.memo && <span className="record-memo">{record.memo}</span>}</span>
              </button>
              <button className="delete-button" type="button" onClick={() => void handleDelete(record)} aria-label={`${record.locationNote || '주차 기록'} 삭제`} title="기록 삭제"><Trash2 size={18} /></button>
            </article>
          ))}</div> : <p className="empty-history">저장된 주차 기록이 여기에 쌓입니다.</p>}
        </section>
      </main>

      {selectedRecord && <div className="dialog-backdrop" role="presentation" onMouseDown={() => setSelectedRecord(undefined)}>
        <section className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={(event) => event.stopPropagation()}>
          <div className="dialog-header"><div><p className="section-kicker">PARKING DETAIL</p><h2 id="detail-title">{selectedRecord.locationNote || '주차 위치'}</h2></div><button type="button" onClick={() => setSelectedRecord(undefined)} aria-label="상세 화면 닫기" title="닫기"><X size={21} /></button></div>
          {selectedRecord.photo && <div className="detail-photo"><Photo blob={selectedRecord.photo} alt="저장된 주차 위치" /></div>}
          <dl><div><dt>주차 시각</dt><dd>{dateFormatter.format(new Date(selectedRecord.parkedAt))}</dd></div><div><dt>GPS 좌표</dt><dd>{selectedRecord.latitude.toFixed(6)}, {selectedRecord.longitude.toFixed(6)}</dd></div><div><dt>정확도</dt><dd>약 {Math.round(selectedRecord.accuracy)}m</dd></div>{selectedRecord.memo && <div><dt>메모</dt><dd>{selectedRecord.memo}</dd></div>}</dl>
          <div className="dialog-actions"><a href={mapUrl(selectedRecord)} target="_blank" rel="noreferrer"><ExternalLink size={18} /> 지도에서 보기</a><button type="button" onClick={() => void handleDelete(selectedRecord)}><Trash2 size={18} /> 삭제</button></div>
        </section>
      </div>}
    </div>
  )
}

export default App
