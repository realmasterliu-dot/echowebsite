/**
 * 了解更多 — 4 个 Why 板块
 * 自 H5 content.js `whySections` 迁入；iconKey 见 icons.js
 *
 * 对应 H5：`src/components/about/AboutSection.jsx`
 */

/** 页面顶栏文案（对齐 H5 DISCOVER MORE / WHY） */
export const aboutPageHeader = {
  label: 'DISCOVER MORE',
  title: '了解更多',
  titleEn: 'WHY',
}

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
      total: 100,
      columns: 20,
    },
    dataPoints: [
      {
        value: 64.2,
        suffix: '%',
        decimals: 1,
        label:
          '64.2%的消费者表示他们会使用抖音在线上完成购买动作，并在线下进行到店消费，线上和线下已经成为相辅相成的消费新整体。',
      },
      {
        value: 62.9,
        suffix: '%',
        decimals: 1,
        label:
          '62.9%的消费者表示抖音让他们发现了很多平时不会注意到的本地店铺，消费的需求一直存在，只缺一次被看到的机会。',
      },
    ],
    points: [
      {
        title: '溢价主权',
        iconKey: 'donate',
        desc: '品牌是摆脱行业恶性价格战的唯一解法，让你的每一分利润都赚得堂堂正正。',
      },
      {
        title: '复购惯性',
        iconKey: 'redo',
        desc: '只有当消费者记住了你的品牌，他们才会跨越算法和推荐，产生主动寻找、反复到店的"复购惯性"。',
      },
      {
        title: '降本增效',
        iconKey: 'arrow-up-wide-short',
        desc: '品牌本身就是最好的滤镜。当你的品牌在本地有了知名度，你的短视频心动率、团购转化率会呈指数级上升。',
      },
      {
        title: '破圈辐射',
        iconKey: 'broadcast-tower',
        desc: '普通门店的生意，死死受限于周围方圆两公里的物理距离；而品牌的声量，可以顺着屏幕辐射到整个城市。',
      },
      {
        title: '资产增值',
        iconKey: 'cubes',
        desc: '店面会老化，员工会流失，但品牌的资产会随着时间不断增值。',
      },
    ],
  },
  {
    id: 'localLife',
    title: '为什么要做本地生活？',
    subtitle: 'LOCAL LIFE',
    stat: {
      value: 8500,
      suffix: '亿',
      label: '2025年抖音本地生活GMV',
      size: 'lg',
    },
    growthChart: [
      { label: '2022', value: 770, display: '770亿' },
      { label: '2023', value: 3000, display: '3000亿' },
      { label: '2024', value: 5600, display: '5600亿' },
      { label: '2025', value: 8500, display: '8500亿' },
      { label: '2026', value: 10000, display: '万亿+' },
    ],
    subHeading: '抖音是你无可替代的商业跳板',
    purpleBentos: [
      {
        iconKey: 'heart',
        title: '最低门槛入局',
        desc: '2.5%的超低佣金费率，无沉重的前期固定费用。将有限的初期预算投入到真正能产生裂变的内容和流量上，而非枯竭在平台入场券里。',
      },
      {
        iconKey: 'arrow-trend-up',
        title: '极速商业验证',
        desc: '依托庞大且活跃的公域流量池，商家的产品、套餐和营销模型可以在极短时间内得到市场验证，快速完成试错与迭代升级。',
      },
      {
        iconKey: 'dollar-sign',
        title: '现金流造血器',
        desc: '相比于纯粹的防守型渠道，抖音极具进攻性。它不仅是获客阵地，更是"造血"机器，能够迅速回笼资金，为后续扩张储备子弹。',
      },
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
      {
        iconKey: 'handshake',
        title: '可靠',
        desc: '海量品牌合作经验，顺畅成熟的合作流程',
      },
      {
        iconKey: 'bolt',
        title: '高效',
        desc: '结果导向，精简高效的方案让每一份投资都迅速转换成增长',
      },
      {
        iconKey: 'bed',
        title: '省心',
        desc: '一站备齐所有营销武器，你负责商业运营，我们负责品牌成长',
      },
      {
        iconKey: 'list-check',
        title: '灵活',
        desc: '一客一案的专属定制服务，助力商业目标高效落地',
      },
    ],
  },
]
