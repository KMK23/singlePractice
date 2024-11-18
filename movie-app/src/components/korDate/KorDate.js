export default function kroDate() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000; // UTC 시간
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000; // 한국 시간 차이 (9시간)
  const kroNow = new Date(utc + KR_TIME_DIFF);

  // 숫자를 2자리로 맞추는 함수 (01, 02, ... 09)
  const padZero = (num) => String(num).padStart(2, "0");

  // YYYY:MM:DD HH:MM:SS 형식
  const formattedKroNowColon =
    `${kroNow.getFullYear()}:${padZero(kroNow.getMonth() + 1)}:${padZero(
      kroNow.getDate()
    )} ` +
    `${padZero(kroNow.getHours())}:${padZero(kroNow.getMinutes())}:${padZero(
      kroNow.getSeconds()
    )}`;
  return formattedKroNowColon;
}
