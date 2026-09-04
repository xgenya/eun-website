import nextra from 'nextra'

const withNextra = nextra({
  search: true,
  defaultShowCopyCode: true,
})

export default withNextra({
  output: 'standalone',
  allowedDevOrigins: ['192.168.31.48', '*.local'],
})
