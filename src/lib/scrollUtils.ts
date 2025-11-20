export function scrollToElement(el: HTMLElement | null, extraOffset = 0, ignoreHeader: boolean | null = null, behavior: ScrollBehavior = 'smooth'): boolean {
  if (!el || typeof window === 'undefined') return false;
  try {
    const targetY = el.getBoundingClientRect().top + window.scrollY;
    let headerOffset = 0;

    if (ignoreHeader === true) {
      headerOffset = 0;
    } else if (ignoreHeader === false) {
      const header = document.querySelector('header');
      headerOffset = header ? header.getBoundingClientRect().height : 0;
    } else {
      // Smart mode (null): Check if target is deep enough to trigger header hide
      // Header hides when scrolling down > 200px
      if (targetY > 200) {
        headerOffset = 0;
      } else {
        const header = document.querySelector('header');
        headerOffset = header ? header.getBoundingClientRect().height : 0;
      }
    }

    const top = Math.max(0, targetY - headerOffset - extraOffset);
    window.scrollTo({ top, behavior });
    return true;
  } catch (e) {
    return false;
  }
}

export function scrollToId(id: string, extraOffset = 0, ignoreHeader: boolean | null = null, behavior: ScrollBehavior = 'smooth'): boolean {
  const el = document.getElementById(id);
  return scrollToElement(el, extraOffset, ignoreHeader, behavior);
}
