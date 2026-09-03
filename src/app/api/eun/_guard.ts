import { NextResponse } from 'next/server'

/**
 * 管理端点访问守卫。
 * 期望请求头 `x-admin-key` 与环境变量 SITE_ADMIN_KEY 匹配。
 * 未配置 SITE_ADMIN_KEY 时一律拒绝，避免误开放。
 */
export function requireAdmin(request: Request): NextResponse | null {
  const expected = process.env.SITE_ADMIN_KEY
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: '服务端未配置 SITE_ADMIN_KEY，管理端点已禁用' },
      { status: 503 },
    )
  }
  const provided = request.headers.get('x-admin-key')
  if (provided !== expected) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 })
  }
  return null
}
