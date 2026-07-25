interface GoatCounter {
  count: (opts?: { path?: string; title?: string; event?: boolean }) => void;
}

interface Window {
  goatcounter?: GoatCounter;
}
