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

    // 1) 整段容器微旋转 → 归位
    //    区间拉长：元素刚进入视口下方即开始，滚到偏上方才完成，动画随滚动缓慢推进
    const tRotate = gsap.fromTo(el,
      { transformOrigin: '0% 50%', rotate: 3 },
      {
        rotate: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          end: 'top 15%',
          scrub: 1.2,
        }
      }
    );
    if (tRotate.scrollTrigger) localTriggers.push(tRotate.scrollTrigger);

    // 2) 逐词 opacity + blur 同步揭示（合并为一个 tween，减少 ScrollTrigger 数量更顺）
    //    加大模糊起点(7px)与错开(stagger 0.06)，让"逐词浮现"更舒展、更高级
    const tWords = gsap.fromTo(words,
      { opacity: 0.05, filter: 'blur(7px)' },
      {
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'none',
        stagger: 0.04,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          end: 'top 15%',
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
