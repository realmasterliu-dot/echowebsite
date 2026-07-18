import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollRevealText.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollRevealText — 滚动逐词揭示（react-bits 风格）
 *
 * 文本按自然词/字拆分，每词独立 inline-block，CSS 控制自然换行。
 * 滚动时整段微旋转归位 + 逐词 opacity+blur scrub 动画，
 * 效果优美高级：随滚动条推进，文字从模糊到清晰逐一浮现。
 */
export default function ScrollRevealText({
  children,
  containerClassName = '',
  textClassName = ''
}) {
  const containerRef = useRef(null);

  // 将文本拆分为"词"（中文单字 / 英文单词 / 标点），保留原始空白
  const splitText = useMemo(() => {
    const raw = typeof children === 'string' ? children : '';
    return raw.split(/(\s+)/g).map((part, index) => {
      // 空白部分原样保留
      if (/^\s+$/.test(part)) return part;
      // 非空部分：中文按单字拆分，英文单词保持整体
      const chars = part.split(/([\u4e00-\u9fff\u3000-\u303f\uff00-\uffef])/g);
      return chars.filter(Boolean).map((ch, i) => (
        <span className="sr-word" key={`${index}-${i}`}>{ch}</span>
      ));
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll('.sr-word');
    if (!words.length) return;

    // 收集本组件创建的 ScrollTrigger，cleanup 时只销毁自己的，避免误杀全站其他动画
    const localTriggers = [];

    // 1) 整段容器微旋转 → 归位（transform 合成，几乎零成本）
    //    区间缩短：元素刚进入视口即从底部开始，滚到约屏幕 55% 处就完成，
    //    不必一直滑到顶部才结束（之前 end:'top 15%' 导致要滑过整段才加载完）
    const tRotate = gsap.fromTo(el,
      { transformOrigin: '0% 50%', rotate: 2 },
      {
        rotate: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          end: 'top 55%',
          scrub: 1.2,
        }
      }
    );
    if (tRotate.scrollTrigger) localTriggers.push(tRotate.scrollTrigger);

    // 2) 逐词 opacity + 位移揭示（仅用 transform/opacity，GPU 合成层，滚动不掉帧）
    //    注意：曾经用 filter:blur 做"由模糊到清晰"，但 blur 需每帧重绘每个字，
    //    在手机上极卡（实测 48fps / 最低 10fps）。改为 opacity + 轻微上移，同样优雅但丝滑。
    const tWords = gsap.fromTo(words,
      { opacity: 0.08, y: 16 },
      {
        opacity: 1,
        y: 0,
        ease: 'none',
        stagger: 0.04,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          end: 'top 55%',
          scrub: 1.2,
        }
      }
    );
    if (tWords.scrollTrigger) localTriggers.push(tWords.scrollTrigger);

    return () => {
      localTriggers.forEach(t => t.kill());
      gsap.set([el, ...words], { clearProps: 'all' });
    };
  }, [children]);

  return (
    <div ref={containerRef} className={`scroll-reveal-text ${containerClassName}`}>
      <p className={`scroll-reveal-text__body ${textClassName}`}>{splitText}</p>
    </div>
  );
}
