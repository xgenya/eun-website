import { NextResponse } from 'next/server'
import { getHealth } from '../../../../lib/eunBotApi'

export const dynamic = 'force-dynamic'

// GET /api/eun/health - 上游 /api/health 探活（上游本身允许无 token，但此代理会附带 token）
export async function GET() {
  const result = await getHealth()
  return NextResponse.json(result)
}
