export const sentences = [
  // 제어와 시스템
  "속도가 붙으면 감속하라 과열은 의지가 아니라 환경으로 통제한다",
  "많이 하는 사람보다 덜 틀리는 사람이 이긴다",
  "성과는 시장에 맡기고 내가 통제한 공정의 완수만으로 성공을 기록하라",
  "통제권은 결과에서 오지 않는다 행동에서 온다",
  "정답 루트는 없다 덜 틀리는 루트만 있다 대신 싸고 빠르게 틀려라",
  "완벽한 설계도를 꿈꾸기보다 일단 배포하고 수정하며 나아가라",
  "의지 신화를 버리고 판단력 보존을 최우선으로 두어라",
  "작게 시작해서 크게 가는 사람은 많고 크게 시작해서 오래 가는 사람은 드물다",
  // 사고와 판단
  "사업에서 제일 중요한 자산은 돈도 아이디어도 아니다 판단력이다",
  "도구가 평준화되어도 결과는 평준화되지 않는다",
  "논리가 막히는 변곡점에서는 직관을 따라야 어떤 결과에도 미련이 남지 않는다",
  "초조함은 통제 불가능한 영역에 시선이 갈 때 커진다",
  "조급해질수록 위험한 선택의 확률이 올라간다",
  "코딩은 대신해 주는 시대가 왔기에 어떤 문제를 풀 것인가가 중요해졌다",
  "성장은 강해지는 것이 아니라 내 패턴을 빨리 알아차리는 속도다",
  // 실행과 습관
  "완벽보다 완료가 낫다 품질 칠십 곱하기 삼백이 품질 백 곱하기 이십보다 강하다",
  "하기 싫은 일이 에너지를 쓰는 게 아니라 미루는 상태가 더 많은 에너지를 쓴다",
  "의지가 거의 필요 없는 동작으로 시작해야 한다 그것이 시작 버튼이다",
  "빠르게 만들고 시장에 테스트한 뒤 반복적으로 개선하라",
  "반복 작업은 즉시 템플릿화한다 시간이 짧다는 건 반복 가능하다는 뜻이다",
  // 감정과 회복
  "분노는 에너지다 흩어지면 소모되고 집중되면 자산이 된다",
  "과열 후 휴식은 회복이 아니라 복구 작업이다 에너지가 두 배로 든다",
  "훌륭한 설계자는 엔진의 쿨링 타임까지 설계에 포함한다",
  "깨달음은 준비됐을 때만 보인다 시행착오가 쌓여야 구조를 찾는다",
  "거리두기는 도망이 아니다 자기 관리다",
  "예전처럼 안 사는 것이 실패가 아니라 예전으로 돌아가지 않는 것이 진짜 변화다",
  // 관계와 신뢰
  "도움과 의존을 구분하라 도움은 일시적이고 의존은 반복과 기대의 고정이다",
  "사람은 각자 다른 속도로 흘러가는 강물이고 모임은 잠시 머무는 호수와 같다",
  "장기적 신뢰를 중시하라 단기 전환율보다 신뢰가 더 옳은 방향이다",
  "참는 건 단기 안전 같지만 장기적으로 더 위험하다 기록이 실제로 더 안전하다",
  // 본질
  "일상에서 느끼는 불편함이 곧 혁신적인 프로젝트의 씨앗이 될 수 있다",
  "마찰은 전진할 때 생긴다 지금 불편하다면 움직이고 있다는 증거다",
  "사업 초반은 많이 하는 사람이 이기는 게 아니라 안 무너지는 사람이 이긴다",
  "버티는 사람이 올라간다 확장보다 밀도다 속도보다 방향이다",
  "상상은 현실이 아니다 불확실한 돈은 영으로 계산하라 그것이 사업가의 계산법이다",
]

/**
 * Split a sentence into chunks of roughly `size` words.
 * Tries to keep chunks between 3-5 words.
 */
export function chunkSentence(sentence, size = 4) {
  const words = sentence.split(/\s+/)
  const chunks = []
  for (let i = 0; i < words.length; i += size) {
    const chunk = words.slice(i, i + size).join(' ')
    if (chunk) chunks.push(chunk)
  }
  // If last chunk is only 1 word and there's a previous chunk, merge it
  if (chunks.length > 1 && chunks[chunks.length - 1].split(/\s+/).length === 1) {
    const last = chunks.pop()
    chunks[chunks.length - 1] += ' ' + last
  }
  return chunks
}

/**
 * Get a shuffled session of N sentences
 */
export function getSession(count = 10) {
  const shuffled = [...sentences].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
