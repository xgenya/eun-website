import { NextResponse } from 'next/server'
import { sparkAnalyze } from '../../../../../lib/eunBotApi'
import { requireAdmin } from '../../_guard'

export const dynamic = 'force-dynamic'

// POST /api/eun/spark/analyze { url }
export async function POST(request: Request) {
  const denied = requireAdmin(request)
  if (denied) return denied
  const body = await request.json().catch(() => ({}))
  const url = typeof body?.url === 'string' ? body.url : ''
  if (!url) {
    return NextResponse.json({ ok: false, error: '缺少参数 url' }, { status: 400 })
  }
  const result = await sparkAnalyze(url)
  return NextResponse.json(result)
}
