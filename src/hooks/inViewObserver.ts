type InViewCallback = (isInView: boolean) => void;

type Registration = {
  callback: InViewCallback;
  triggerOnce: boolean;
};

type ObserverRecord = {
  observer: IntersectionObserver;
  elements: Map<Element, Set<Registration>>;
};

const observers = new Map<number, ObserverRecord>();

function getObserver(threshold: number): ObserverRecord {
  const existing = observers.get(threshold);
  if (existing) return existing;

  const elements = new Map<Element, Set<Registration>>();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const registrations = elements.get(entry.target);
      if (!registrations) continue;

      for (const registration of [...registrations]) {
        if (entry.isIntersecting) {
          registration.callback(true);
          if (registration.triggerOnce) registrations.delete(registration);
        } else if (!registration.triggerOnce) {
          registration.callback(false);
        }
      }

      if (registrations.size === 0) {
        elements.delete(entry.target);
        observer.unobserve(entry.target);
      }
    }
  }, { threshold });

  const record = { observer, elements };
  observers.set(threshold, record);
  return record;
}

export function observeInView(
  element: Element,
  threshold: number,
  callback: InViewCallback,
  triggerOnce = true,
) {
  const record = getObserver(threshold);
  const registrations = record.elements.get(element) ?? new Set<Registration>();
  const registration = { callback, triggerOnce };

  registrations.add(registration);
  record.elements.set(element, registrations);
  record.observer.observe(element);

  return () => {
    registrations.delete(registration);
    if (registrations.size > 0) return;

    record.elements.delete(element);
    record.observer.unobserve(element);
    if (record.elements.size === 0) {
      record.observer.disconnect();
      observers.delete(threshold);
    }
  };
}
