const home = {
  // 首页打字机效果文字
  typingPhrases: [
    '一个纯粹的原版生存服务器',
    'A Pure Vanilla Survival Server',
    '红石 · 建筑 · 探索',
    'Redstone · Building · Exploration',
  ],

  // 开服日期（用于计算已运行天数，格式 YYYY-MM-DD）
  startDate: '2026-03-12',

  // 服务器列表（用于首页在线状态查询，支持多个，各自独立域名和端口）
  // id 用于 API 查询标识，name 用于前端展示，eunId 对应 EUN Bot API 的服务器 key
  servers: [
    {
      id: 'survival',
      name: '生存服',
      host: 'eunoia.ink',
      port: 24871,
      eunId: 'main' as const,
    },
    {
      id: 'creative',
      name: '创造服',
      host: 'eunoia.ink',
      port: 25565,
      eunId: 'creative' as const,
    },
  ],

  // 服务器特性卡片（Why EUN 区块）
  features: [
    {
      icon: '/images/mc-icons/redstone_block.png',
      title: '性能拉满，畅快无阻',
      desc: '搭载 EPYC™ 高性能处理器，全天候稳定 20TPS。无论是复杂红石装置还是远征未知大陆，丝滑体验始终如一',
    },
    {
      icon: '/images/mc-icons/crafting_table_top.png',
      title: '原版内核，恰到好处',
      desc: '坚守原版生存的纯粹体验，不做多余的堆砌。少量自研插件只在关键处画龙点睛，让每一次游玩都有恰到好处的新鲜感',
    },
    {
      icon: '/images/mc-icons/repeater.png',
      title: '为红石留足空间',
      desc: '完善的红石基础设施，保留原版特性不做阉割。无论多复杂的装置，都能稳定运行、如你所愿',
    },
    {
      icon: '/images/mc-icons/torch.png',
      title: '好的氛围，自然生长',
      desc: '不立太多规矩，不搞形式主义。老玩家带新玩家，互帮互助自然而然。这里没有戾气，只有一群同样热爱这个世界的人',
    },
  ],

  // 画廊截图列表
  gallery: [
    { src: '/images/gallery/screenshot-1.png', alt: 'Gallery screenshot 1' },
    { src: '/images/gallery/screenshot-2.png', alt: 'Gallery screenshot 2' },
    { src: '/images/gallery/screenshot-3.png', alt: 'Gallery screenshot 3' },
  ],

  // 各区块的文案配置
  sections: {
    whyEun: {
      eyebrow: 'WHY EUN',
      title: '在这里',
      titleEm: '安心生存',
      subtitle: '用心打磨每一个细节，只为让你在方块世界里，找到一份踏实与安心。',
    },
    gallery: {
      eyebrow: 'GALLERY',
      title: '留住',
      titleEm: '每一帧',
      subtitle: '一座拔地而起的城堡，一场日落时分的偶遇。这些由玩家亲手创造的瞬间，是服务器里最真实的风景',
    },
    cta: {
      eyebrow: 'JOIN US',
      title: '找到',
      titleEm: '你的位置',
      subtitle: '不需要门槛，不需要理由。进来看看，也许这里就是你一直在找的地方。',
      btnLabel: '开始你的冒险',
      btnHref: '/getting-started',
    },
    infrastructure: {
      eyebrow: 'INFRASTRUCTURE',
      title: '为稳定',
      titleEm: '全力以赴',
      subtitle: '工业级服务器硬件，专为 Minecraft 高负载场景深度调优',
    },
  },
}

export default home
