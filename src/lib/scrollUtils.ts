export function scrollToElement(el: HTMLElement | null, extraOffset = 0): boolean {
  if (!el || typeof window === 'undefined') return false;
  try {
    const header = document.querySelector('header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset);
    window.scrollTo({ top, behavior: 'smooth' });
    return true;
  } catch (e) {
    return false;
  }
}

export function scrollToId(id: string, extraOffset = 0): boolean {
  const el = document.getElementById(id);
  return scrollToElement(el, extraOffset);
}
