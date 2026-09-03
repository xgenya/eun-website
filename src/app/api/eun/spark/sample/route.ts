import { NextResponse } from 'next/server'
import { sparkSample } from '../../../../../lib/eunBotApi'
import { requireAdmin } from '../../_guard'

export const dynamic = 'force-dynamic'

// POST /api/eun/spark/sample { seconds? }
export async function POST(request: Request) {
  const denied = requireAdmin(request)
  if (denied) return denied
  const body = await request.json().catch(() => ({}))
  const seconds = typeof body?.seconds === 'number' ? body.seconds : 10
  const result = await sparkSample(seconds)
  return NextResponse.json(result)
}
