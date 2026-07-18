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
              我们是echo有求必应，一家扎根广东、深耕大湾区的精品生意增长和品牌成长伙伴。
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.22}>
            <p className="company-intro__text">
              在这里，我们提供一体化、全渠道的一站式解决方案。我们用创意驱动生意，这一哲学贯穿于我们为客户所做的一切之最前沿。
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.29}>
            <p className="company-intro__text">
              我们通过本地生活整合营销、商业IP打造与数字推广等核心业务，已经帮助大湾区众多餐饮、零售和日用品牌实现效益突破。
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.36}>
            <p className="company-intro__text">
              法语"écho"的发音如同英语中的"平等"。这是我们的相处之道。这里没有甲方乙方，只有并肩面对市场的战友。
              你不会感到被冷落，更不会感到晦涩艰难，我们用最真诚的温度，去构建彼此的信任纽带。
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
          在增量转向存量的今天，传统的单一传播路径已经失效。从消费者看到你的第一眼开始，
          视觉设计、物料制作、内容拍摄、线上种草到最后的线下客流转化，每一个触点都在决定着最终的转化。
        </ScrollRevealText>

        <ScrollRevealText
          baseOpacity={0.08}
          baseRotation={2}
          blurStrength={4}
          enableBlur={true}
        >
          我们的整合营销主张，就是将从策略到执行的每一个闭环彻底打通。品牌是所有兢兢业业的生意人都能握在手中的实力武器。
          我们致力于为你打造有影响力的品牌，将你无形的"品牌资产"，真正转化为看得见的"生意活力"。
        </ScrollRevealText>

        <ScrollRevealText
          baseOpacity={0.08}
          baseRotation={2.5}
          blurStrength={4}
          enableBlur={true}
        >
          我们不仅是你的策略师与创意师，更是你最可靠的生意增长伙伴。面对激烈的红海竞争，
          我们用极致的创意、完全定制的套餐和无与伦比的响应速度，为你提供破局的新解法。
        </ScrollRevealText>

        <ScrollRevealText
          baseOpacity={0.08}
          baseRotation={2}
          blurStrength={4}
          enableBlur={true}
        >
          在商业世界里，我们将陪你穿越竞争的迷雾，把极致的定制化与雷厉风行的响应速度交到你的手中。
          我们深信：广告、品牌与市场推广，绝不是巨头大厂的专属特权。再微弱的火光也值得被看见，再小的声音也值得被听见。
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
