export interface CurrentLocation {
  latitude: number
  longitude: number
  accuracy: number
}

export class LocationError extends Error {}

export function getCurrentLocation(): Promise<CurrentLocation> {
  if (!navigator.geolocation) {
    return Promise.reject(
      new LocationError('이 기기에서는 위치 정보를 사용할 수 없습니다.'),
    )
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
        })
      },
      (error) => {
        const messages: Record<number, string> = {
          1: '위치 권한이 필요합니다. 브라우저 설정에서 위치 권한을 허용해 주세요.',
          2: '현재 위치를 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.',
          3: '위치 확인 시간이 초과되었습니다. 하늘이 보이는 곳에서 다시 시도해 주세요.',
        }
        reject(
          new LocationError(
            messages[error.code] ?? '위치를 가져오는 중 문제가 발생했습니다.',
          ),
        )
      },
      {
        enableHighAccuracy: true,
        timeout: 15_000,
        maximumAge: 30_000,
      },
    )
  })
}