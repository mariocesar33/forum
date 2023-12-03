import { Answer } from "../entities/answer"

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
}

// Responder à pergunta
export class AnswerQuestionUseCase {
  execute({ instructorId, questionId, content }: AnswerQuestionUseCaseRequest) {
    const answer = new Answer({
      content,
      authorId: instructorId,
      questionId,
    })

    return answer
  }
}