import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo, setSession } from '@/app/api/utils/common'

export async function GET(request: NextRequest, props: { params: Promise<{ messageId: string }> }) {
  const params = await props.params
  const { messageId } = params
  const { sessionId, user } = getInfo(request)

  // Using sendRequest directly because getSuggestedQuestions might not be in the type definition yet
  // Endpoint: /messages/{message_id}/suggested
  const { data }: any = await client.sendRequest('GET', `/messages/${messageId}/suggested`, undefined, { user })

  return NextResponse.json(data, {
    headers: setSession(sessionId),
  })
}
