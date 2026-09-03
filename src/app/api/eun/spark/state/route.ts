import { NextResponse } from 'next/server'
import { getSparkState } from '../../../../../lib/eunBotApi'

export const dynamic = 'force-dynamic'

// GET /api/eun/spark/state
export async function GET() {
  const result = await getSparkState()
  return NextResponse.json(result)
}
