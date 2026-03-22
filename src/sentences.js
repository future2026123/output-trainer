export const sentences = [
  "생각의 속도는 타자보다 빠르다 그래서 제어가 필요하다",
  "천천히 정확하게 입력하는 것이 빠르게 틀리는 것보다 낫다",
  "집중력은 훈련으로 만들어지는 근육과 같다",
  "하루 열 분의 연습이 일 년의 습관을 바꾼다",
  "완성된 문장은 완성된 생각의 증거다",
  "손가락이 생각을 따라가게 하라 앞서가지 않게",
  "정확한 출력은 명확한 사고에서 시작된다",
  "멈추는 것도 훈련이다 빠른 것만이 좋은 것은 아니다",
  "한 글자씩 의식하며 입력하는 것이 진짜 실력이다",
  "좋은 글은 빠른 손이 아니라 깊은 생각에서 나온다",
  "제어할 수 있는 사람이 결국 가장 빠른 사람이다",
  "급하게 치면 급하게 틀린다 여유를 가져라",
  "타자는 도구일 뿐이다 진짜 중요한 것은 사고의 질이다",
  "반복은 배신하지 않는다 매일 조금씩 성장한다",
  "흐름을 끊지 마라 리듬을 타며 입력하라",
  "정확도가 속도를 이긴다 기초가 탄탄해야 한다",
  "의식적 연습만이 무의식적 능력을 만든다",
  "오늘의 느린 연습이 내일의 빠른 실력이 된다",
  "키보드 위의 명상 한 글자에 마음을 담아라",
  "생각하고 입력하라 입력하며 생각하지 마라",
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
