// ============================================================
// 有求必应品牌策划 (écho) — 全站文案数据
// 来源: Agency Profile Version 2.pdf
// ============================================================

export const company = {
  name: '有求必应品牌策划有限公司',
  brandName: 'écho',
  brandNameEn: 'echo',
  slogan: '我们坚信，\n创意驱动生意，\n再小的声音也值得被听见。',
  address: '广东省广州市番禺区 XX大厦XX楼',
  positioning: '扎根广东、深耕大湾区的精品生意增长和品牌成长伙伴',
}

export const about = {
  whoWeAre: {
    title: '我们是谁',
    content: `我们是écho有求必应，一家扎根广东、深耕大湾区的精品生意增长和品牌成长伙伴。在这里，我们提供一体化、全渠道的一站式解决方案。我们用创意驱动生意，这一哲学贯穿于我们为客户所做的一切之最前沿。我们通过本地生活整合营销、商业IP打造与数字化推广等核心业务，已经帮助大湾区众多餐饮、零售和日用品牌实现效益突破。`,
    echoMeaning: `法语"écho"的发音如同英语中的"平等"。这是我们的相处之道。这里没有甲方乙方，只有并肩面对市场的战友。你不会感到被冷落，更不会感到晦涩艰难，我们用最真诚的温度，去构建彼此的信任纽带。`,
  },
  vision: '成为品牌永续增长的合作伙伴',
  philosophy: `在增量转向存量的今天，传统的单一传播路径已经失效。从消费者看到你的第一眼开始，视觉设计、物料制作、内容拍摄、线上种草到最后的线下客流转化，每一个触点都在决定着最终的转化。我们的整合营销主张，就是将从策略到执行的每一个闭环彻底打通。品牌是所有兢兢业业的生意人都能握在手中的实力武器。`,
}

// 核心业务（8项）— 顺序与图标严格对齐企业介绍 PDF
export const services = [
  {
    icon: 'object-ungroup',
    title: '本地生活整合运营',
    desc: '围绕抖音、小红书、美团、大众点评等平台提供一站式本地生活整合运营服务',
  },
  {
    icon: 'photo-film',
    title: '内容营销',
    desc: '内容策略、创意制作（图文/短视频/直播）、多平台运营、效果优化',
  },
  {
    icon: 'user',
    title: 'IP 孵化打造',
    desc: '围绕创始人/主理人打造具备传播力与信任感的商业IP',
  },
  {
    icon: 'users-between-lines',
    title: '达人探店营销',
    desc: '联动本地达人流量资源，帮助商家快速获取曝光与流量',
  },
  {
    icon: 'wand-magic-sparkles',
    title: '线上门店搭建与优化',
    desc: '抖音、美团、大众点评等平台的搭建与优化服务',
  },
  {
    icon: 'compass',
    title: '策略咨询',
    desc: '多维度深度分析，制定科学可落地的生意增长方案',
  },
  {
    icon: 'square-rss',
    title: '流量增长服务',
    desc: '平台流量助推、内容数据增长与传播热度提升',
  },
  {
    icon: 'message',
    title: '舆情监测与口碑管理',
    desc: '7×24小时舆情实时监测与专业化口碑管理服务',
  },
]

// 了解更多 - 4个Why板块
export const whySections = [
  {
    id: 'brand',
    title: '为什么要做品牌？',
    subtitle: 'BRAND',
    circleMatrix: {
      value: 64,
      suffix: '%',
      label: '消费者愿为品牌支付溢价',
      fillCount: 64,
      total: 100, /* 20列×5行，前64个橙色 */
      columns: 20,
    },
    dataPoints: [
      {
        value: 64.2,
        suffix: '%',
        decimals: 1,
        label: '64.2%的消费者表示他们会使用抖音在线上完成购买动作，并在线下进行到店消费，线上和线下已经成为相辅相成的消费新整体。',
      },
      {
        value: 62.9,
        suffix: '%',
        decimals: 1,
        label: '62.9%的消费者表示抖音让他们发现了很多平时不会注意到的本地店铺，消费的需求一直存在，只缺一次被看到的机会。',
      },
    ],
    points: [
      { title: '溢价主权', icon: 'donate', desc: '品牌是摆脱行业恶性价格战的唯一解法，让你的每一分利润都赚得堂堂正正。' },
      { title: '复购惯性', icon: 'redo', desc: '只有当消费者记住了你的品牌，他们才会跨越算法和推荐，产生主动寻找、反复到店的"复购惯性"。' },
      { title: '降本增效', icon: 'arrow-up-wide-short', desc: '品牌本身就是最好的滤镜。当你的品牌在本地有了知名度，你的短视频心动率、团购转化率会呈指数级上升。' },
      { title: '破圈辐射', icon: 'broadcast-tower', desc: '普通门店的生意，死死受限于周围方圆两公里的物理距离；而品牌的声量，可以顺着屏幕辐射到整个城市。' },
      { title: '资产增值', icon: 'cubes', desc: '店面会老化，员工会流失，但品牌的资产会随着时间不断增值。' },
    ],
  },
  {
    id: 'localLife',
    title: '为什么要做本地生活？',
    subtitle: 'LOCAL LIFE',
    stat: { value: 8500, suffix: '亿', label: '2025年抖音本地生活GMV', size: 'lg' },
    growthChart: [
      { label: '2022', value: 770, display: '770亿' },
      { label: '2023', value: 3000, display: '3000亿' },
      { label: '2024', value: 5600, display: '5600亿' },
      { label: '2025', value: 8500, display: '8500亿' },
      { label: '2026', value: 10000, display: '万亿+' },
    ],
    subHeading: '抖音是你无可替代的商业跳板',
    purpleBentos: [
      { icon: 'heart', title: '最低门槛入局', desc: '2.5%的超低佣金费率，无沉重的前期固定费用。将有限的初期预算投入到真正能产生裂变的内容和流量上，而非枯竭在平台入场券里。' },
      { icon: 'arrow-trend-up', title: '极速商业验证', desc: '依托庞大且活跃的公域流量池，商家的产品、套餐和营销模型可以在极短时间内得到市场验证，快速完成试错与迭代升级。' },
      { icon: 'dollar-sign', title: '现金流造血器', desc: '相比于纯粹的防守型渠道，抖音极具进攻性。它不仅是获客阵地，更是"造血"机器，能够迅速回笼资金，为后续扩张储备子弹。' },
    ],
  },
  {
    id: 'commercialIP',
    title: '为什么要做商业IP？',
    subtitle: 'COMMERCIAL IP',
    ipBentos: [
      {
        value: '400亿',
        desc: '抖音职人已经成为商家新的增长引擎，通过视频、直播带货等方式，2025年职人为门店带来交易额超400亿元',
      },
      {
        value: '4.4万',
        desc: '在"老板出道"项目中，掌柜们发布超4.4万条视频。全盘上抖音的时代已经到来，抖音成为品牌新增量的新解法',
      },
      {
        value: '17类',
        desc: '采自餐饮美食、住宿酒店、游戏票务、丽人美容美发、休闲娱乐等17个品类的商家持续入驻抖音，后续还将开放更多行业',
      },
      {
        value: '300万',
        desc: '抖音平台认证职人总数已突破300万人，来自各行各业的掌柜、创始人都在通过抖音触达更多的有效消费者',
      },
    ],
  },
  {
    id: 'chooseUs',
    title: '为什么选择有求必应？',
    subtitle: 'WHY écho',
    resultBentos: [
      {
        value: 98,
        suffix: '%+',
        desc: '根据抖音来客数据，与专业服务商合作前后一个月对比的平均数据，抖音成交金额增长98%，线上流量增长带动团购、代金券等销量上升，同时进一步带动门店曝光，实现利润营收双增加的良性循环',
      },
      {
        value: 72,
        suffix: '%',
        desc: '根据抖音来客数据，与专业服务商合作前后一个月对比的平均数据，内容流量曝光增长72%，实现门店巨量曝光',
      },
      {
        value: 200,
        suffix: '+',
        desc: '我们与大湾区超过200位优质探店博主建立合作关系，覆盖抖音、小红书、大众点评等多个渠道，严格标准筛选账号，只选择真正带货、懂内容的优质力量，让每一次探店都转化为具体的收益',
      },
      {
        value: 1000,
        suffix: '万+',
        desc: '庞大的合作网络带来的是大湾区最活跃的本地核心消费群体，博主的精准推广和引流，为潜在客户提供新的消费参考，极大缩短他们的决策链路，为门店收入打开新的增长窗口',
      },
    ],
    values: [
      { icon: 'handshake', title: '可靠', desc: '海量品牌合作经验，顺畅成熟的合作流程' },
      { icon: 'bolt', title: '高效', desc: '结果导向，精简高效的方案让每一份投资都迅速转换成增长' },
      { icon: 'bed', title: '省心', desc: '一站备齐所有营销武器，你负责商业运营，我们负责品牌成长' },
      { icon: 'list-check', title: '灵活', desc: '一客一案的专属定制服务，助力商业目标高效落地' },
    ],
  },
]

// 价格套餐 — 严格对齐参考截图
export const pricingPlans = [
  {
    id: 'starter',
    name: '优选起航套餐',
    price: 6800,
    period: '/月',
    badge: null,
    theme: 'light',       // light | orange | dark
    description: '适合刚开业或刚入局，想要低成本快速把店开起来、把品上齐的本地新店。',
    features: [
      { text: '6维全场景经营深度诊断', disabled: false },
      { text: '1对1生意增长实战陪跑', disabled: false },
      { text: '门店基础搭建', disabled: false },
      { text: '门店信息优化', disabled: false },
      { text: '团购套餐设计', disabled: false },
      { text: '10条门店宣传视频', disabled: false },
      { text: '掌柜IP全流程运营', disabled: true },
      { text: '高端店铺宣传视频', disabled: true },
      { divider: true },
      { text: '高质量抖音博主探店', disabled: true },
      { divider: true },
      { text: '高质量小红书笔记', disabled: true },
    ],
    bonus: '赠送：2026本地生活运营实操地图',
  },
  {
    id: 'growth',
    name: '全量增长套餐',
    price: 8800,
    period: '/月',
    badge: '最受欢迎',
    theme: 'orange',
    description: '适合已有基础、急需打破流量瓶颈的成熟门店，聚焦全渠道爆发与精准破圈。',
    features: [
      { text: '6维全场景经营深度诊断', disabled: false },
      { text: '1对1生意增长实战陪跑', disabled: false },
      { text: '门店基础搭建', disabled: false },
      { text: '门店信息优化', disabled: false },
      { text: '团购套餐设计', disabled: false },
      { text: '20条门店宣传视频', disabled: false },
      { text: '掌柜IP全流程运营', disabled: true },
      { text: '高端店铺宣传视频', disabled: true },
      { divider: true },
      { text: '20位高质量抖音博主探店', disabled: false },
      { divider: true },
      { text: '10篇高质量小红书笔记', disabled: false },
    ],
    bonus: '赠送：2026本地生活运营实操地图',
  },
  {
    id: 'premium',
    name: '卓越长赢套餐',
    price: 11800,
    period: '/月',
    badge: null,
    theme: 'light',       // 与优选起航一致的浅色 + 橙色描边
    description: '适合追求区域行业头部、希望构筑长期竞争壁垒的标杆商家。抢占同城流量高地构筑竞争力。',
    features: [
      { text: '6维全场景经营深度诊断', disabled: false },
      { text: '1对1生意增长实战陪跑', disabled: false },
      { text: '门店基础搭建', disabled: false },
      { text: '门店信息优化', disabled: false },
      { text: '团购套餐设计', disabled: false },
      { text: '35条门店宣传视频', disabled: false },
      { text: '掌柜IP全流程运营', disabled: true },
      { text: '2条高端店铺宣传视频', disabled: false },
      { divider: true }, /* ← 分割线 */
      { text: '30位高质量抖音博主探店', disabled: false },
      { divider: true }, /* ← 分割线 */
      { text: '20篇高质量小红书笔记', disabled: false },
    ],
    bonus: '赠送：2026本地生活运营实操地图',
  },
  {
    id: 'strategic',
    name: '战略全案套餐',
    price: 26800,
    period: '/月',
    badge: '旗舰领航',
    theme: 'dark',
    description: '适合谋求跨区域扩张或多店连锁的掌柜，构筑起同行无法逾越的长期竞争壁垒。',
    features: [
      { text: '6维全场景经营深度诊断', disabled: false },
      { text: '1对1生意增长实战陪跑', disabled: false },
      { text: '门店基础搭建', disabled: false },
      { text: '门店信息优化', disabled: false },
      { text: '团购套餐设计', disabled: false },
      { text: '45条门店宣传视频', disabled: false },
      { text: '掌柜IP全流程运营', disabled: false },
      { text: '2条高端店铺宣传视频', disabled: false },
      { divider: true },
      { text: '50位高质量抖音博主探店', disabled: false },
      { divider: true },
      { text: '45篇高质量小红书笔记', disabled: false },
    ],
    bonus: '赠送：2026本地生活运营实操地图',
  },
]

// 灵活增值服务
export const addOnServices = [
  {
    title: '内容营销',
    items: ['内容策略方案制定', '视频制作', '图文内容制作', '社交媒体内容运营', '平台数据优化'],
  },
  {
    title: '商业IP孵化打造',
    items: ['IP定位', '内容策略', 'IP内容制作', '账号矩阵搭建', '社交媒体运营与维护', 'IP长期成长计划'],
  },
  {
    title: '达人探店营销',
    items: ['达人资源匹配及矩阵搭建', '探店执行', '发布审核', '探店数据监测', '内容二次混剪传播'],
  },
  {
    title: '线上门店搭建与优化',
    items: ['线上门店基础搭建', '信息优化', '门店视觉优化', '团购套餐设计'],
  },
  {
    title: '流量增长服务',
    items: ['平台内容加热', '账号粉丝增长', '数据监测'],
  },
]

// 服务流程（6步）— 含图标
export const serviceProcess = [
  { step: 1, title: '需求确认', icon: 'clipboard', desc: '与你面对面深度沟通，充分了解你的品牌愿景和商业期望，并将其落实为可量化、可执行的实际目标。' },
  { step: 2, title: '市场调研', icon: 'magnifying-glass-chart', desc: '深入剖析细分品类与所属行业，对同业竞争、目标受众、产品优势及地域环境进行详细分析，发掘品牌独特的竞争优势。' },
  { step: 3, title: '策略制定', icon: 'network-wired', desc: '结合需求与调研结果，为你制定涵盖产品、运营等多维度的专属增长策略，并分阶段、按步骤规划出清晰的时间线。' },
  { step: 4, title: '实际制作', icon: 'clapperboard', desc: '严格按照双方确认的策略和时间线进行物料的高标准制作，确保图文内容、视频内容及门店相关物料的高质感落地。' },
  { step: 5, title: '上线运营', icon: 'share-nodes', desc: '将制作完成的物料按计划布局至相应的社交媒体平台，并根据平台机制与受众倾向进行实时优化，确保精准触达。' },
  { step: 6, title: '数据监测', icon: 'chart-bar', desc: '持续监控全平台数据，从传播和转化多个维度评估实际效果，通过严谨的数据收集进行后续迭代，为生意持续加码。' },
]

// 底部结语文案
export const closingQuote = {
  title: '任凭风浪起伏\n我们始终在这',
  content: '不论您今天因为什么业务需求找到我们，又因各种原因最终选择、或是暂时未选择我们，皆祝你商途坦荡。在品牌增长这条路上，有求必应时刻准备着，在这里为你提供最真诚的支持。',
  subtext: '商海自有起伏，但专业的陪伴从不缺席。错过的红利我们帮你追回来，未竟的战局我们陪你打下去。',
}

// Dock导航配置
export const navItems = [
  { id: 'hero', label: '首页', icon: 'home' },
  { id: 'about', label: '了解更多', icon: 'compass' },
  { id: 'pricing', label: '价格', icon: 'tags' },
  { id: 'contact', label: '联系我们', icon: 'envelope' },
]
