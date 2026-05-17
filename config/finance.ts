const finance = {
  // 赞助记录（name: 赞助者, amount: 金额/元, date: 年-月）
  sponsors: [
    { name: 'motor10086', amount: 100, date: '2026-05' },
    { name: 'Rhandom', amount: 20, date: '2026-05' },
    { name: 'canling_CL', amount: 100, date: '2026-05' },
    { name: 'sixteen0522', amount: 66, date: '2026-05' },
    { name: 'sixihappy', amount: 200, date: '2026-05' },
    { name: 'remrinya', amount: 30, date: '2026-05' },
    { name: '自由国度服服主', amount: 20, date: '2026-05' },
    { name: 'Y_jiaopiYa', amount: 100, date: '2026-05' },
  ],

  // 支出记录（recurring: 是否为每月固定支出）
  expenses: [
    { item: '服务器月租', amount: 800, date: '2026-04', recurring: true },
  ],
}

export default finance
