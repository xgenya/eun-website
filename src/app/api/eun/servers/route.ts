import { NextResponse } from 'next/server'
import { getServers } from '../../../../lib/eunBotApi'

export const dynamic = 'force-dynamic'

// GET /api/eun/servers - 上游 /api/servers 服务器列表
export async function GET() {
  const result = await getServers()
  return NextResponse.json(result)
}
