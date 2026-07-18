import ScrollReveal from '../shared/ScrollReveal'
import TiltedCard from '../shared/TiltedCard'
import ScrollRevealText from '../shared/ScrollRevealText'
import './CompanyIntro.css'

/**
 * CompanyIntro — 我们是谁 + 品牌理念
 * 左右布局：左侧文字（我们是谁标题 + 正文），右侧 TiltedCard 配图
 * 下方：品牌理念（ScrollRevealText 滚动模糊揭示）
 */
export default function CompanyIntro() {
  return (
    <section id="company" className="company-intro section">
      {/* ===== 我们是谁 — 左右 Grid ===== */}
      <div className="company-intro__grid">
        {/* 左侧：文字内容 */}
        <div className="company-intro__left">
          <ScrollReveal direction="left" delay={0.1}>
            <h2 className="company-intro__title">我们是谁</h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.15}>
            <p className="company-intro__text company-intro__text--lead">
              我们是écho 有求必应，一家扎根广东、深耕大湾区的品牌增长公司，专注于为品牌提供一体化、全渠道的一站式解决方案。
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.22}>
            <p className="company-intro__text">
              我们始终坚信“创意驱动生意”，通过本地生活整合营销、商业IP打造与数字化推广等核心业务，已帮助众多餐饮、零售和日用品牌实现品牌价值与商业增长的双重提升。
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.29}>
            <p className="company-intro__text">
              écho 在法语中意为“回声”。正如品牌需要被市场听见，我们希望成为品牌与消费者之间的那一道回声，让每一次创意都产生真实的回应，让每一次传播都创造商业价值。
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.36}>
            <p className="company-intro__text">
              在有求必应，没有甲方与乙方，只有共同面对市场的合作伙伴，我们将始终以专业、高效与真诚，陪伴每一位客户走好品牌增长的每一步。
            </p>
          </ScrollReveal>
        </div>

        {/* 右侧：TiltedCard 配图 */}
        <div className="company-intro__right">
          <ScrollReveal direction="right" delay={0.2}>
            <TiltedCard
              imageSrc="/mockup-intro.jpg"
              altText="有求必应 écho 品牌形象"
              captionText=""
              containerHeight="480px"
              containerWidth="100%"
              imageHeight="480px"
              imageWidth="100%"
              scaleOnHover={1.05}
              rotateAmplitude={10}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={false}
            />
          </ScrollReveal>
        </div>
      </div>

      {/* ===== 品牌理念 — ScrollRevealText 滚动揭示 ===== */}
      <div className="company-intro__philosophy">
        <ScrollReveal direction="left" delay={0.05}>
          <h2 className="company-intro__title">品牌理念</h2>
        </ScrollReveal>

        <ScrollRevealText
          baseOpacity={0.08}
          baseRotation={3}
          blurStrength={4}
          enableBlur={true}
        >
          在增量转向存量的今天，单一的传播路径已经难以支撑品牌持续增长。从消费者第一次认识品牌开始，视觉形象、内容表达、线上传播到线下体验与转化，每一个触点都影响着对品牌的认知，也决定着生意最终的结果。
        </ScrollRevealText>

        <ScrollRevealText
          baseOpacity={0.08}
          baseRotation={2}
          blurStrength={4}
          enableBlur={true}
        >
          écho有求必应主张整合营销，把从策略到执行的每一个闭环彻底打通。致力于为你打造有影响力的品牌，将你无形的“品牌资产”，真正转化为看得见的“生意活力”。
        </ScrollRevealText>

        <ScrollRevealText
          baseOpacity={0.08}
          baseRotation={2.5}
          blurStrength={4}
          enableBlur={true}
        >
          我们不仅是你的策略师与创意师，更是你最可靠的生意增长伙伴。面对激烈的红海竞争，我们用极致的创意、完全定制的套餐和无与伦比的响应速度，为你提供破局的新解法。
        </ScrollRevealText>

        <ScrollRevealText
          baseOpacity={0.08}
          baseRotation={2}
          blurStrength={4}
          enableBlur={true}
        >
          我们始终相信：广告、品牌与市场推广，绝不是巨头大厂的专属特权。再微弱的火光也値得被看见，再小的声音也値得被听见。
        </ScrollRevealText>

        <ScrollRevealText
          baseOpacity={0.08}
          baseRotation={3}
          blurStrength={5}
          enableBlur={true}
        >
          我们用真正的一体化全链路服务，让你的品牌30天看到真实增长，助力你的生意火爆长青。
        </ScrollRevealText>
      </div>
    </section>
  )
}
