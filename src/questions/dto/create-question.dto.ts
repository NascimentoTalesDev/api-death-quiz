export class CreateQuestionDto {
    quizId: number
    question: string
    correctAnswer: string
    answers: [{ text: string}]
}
