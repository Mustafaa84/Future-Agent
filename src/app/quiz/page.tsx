import { getPublishedToolsForQuiz } from '@/lib/getToolData'
import QuizClient from './QuizClient'

export const metadata = {
  title: 'AI Tool Finder Quiz | Future Agent',
  description:
    'Answer 6 quick questions and get personalized AI tool recommendations based on your goals, budget, and experience level.',
}

export default async function QuizPage() {
  const tools = await getPublishedToolsForQuiz()

  return <QuizClient tools={tools} />
}
