type flush_callback_t<T, extra_t> = (params: {
  extra: extra_t;
  items: T[];
}) => Promise<void>;

interface buffered_array_config_i {
  max_length: number; // threshold to trigger flush by size
  interval_ms: number; // max time to wait before flushing
}

export class BufferedArray<T, extra_t> {
  private items: T[] = [];
  private readonly max_length: number;
  private readonly interval_ms: number;
  private readonly flush_callback: flush_callback_t<T, extra_t>;
  private timer_id: ReturnType<typeof setTimeout> | null = null;
  private is_flushing: boolean = false;
  extra: extra_t;

  constructor(params: {
    config: buffered_array_config_i;
    flush_callback: flush_callback_t<T, extra_t>;
    extra: extra_t;
  }) {
    this.max_length = params.config.max_length;
    this.interval_ms = params.config.interval_ms;
    this.extra = params.extra;
    this.flush_callback = params.flush_callback;
  }

  public async addMany(items: Array<T>) {
    if (!items) return;
    if (!Array.isArray(items)) return;
    if (items.length <= 0) return;
    for (let idx = 0; idx < items.length; idx++) {
      this.items.push(items[idx]);
      if (this.items.length >= this.max_length) {
        await this.triggerFlushNow();
      }
    }

    if (this.items.length) {
      if (this.interval_ms <= 0) {
        await this.triggerFlushNow();
      }
    }

    // Start a one-shot timer if none is active
    if (this.items.length) {
      if (this.timer_id === null && this.interval_ms > 0) {
        this.scheduleTimer();
      }
    }
  }

  public async add(item: T): Promise<void> {
    this.items.push(item);

    // If we hit max_length, cancel timer and flush immediately
    if (this.items.length >= this.max_length) {
      await this.triggerFlushNow();
      return;
    }

    // Start a one-shot timer if none is active
    if (this.timer_id === null && this.interval_ms > 0) {
      this.scheduleTimer();
    }
  }

  // Exposed flush that callers can invoke manually if desired
  public async flushNow(): Promise<void> {
    if (this.is_flushing) {
      return;
    }

    if (this.items.length === 0) {
      return;
    }

    this.is_flushing = true;

    // Swap out current items so new ones can be added while flushing
    const items_to_flush = this.items;
    this.items = [];

    const extra = this.extra;
    await this.flush_callback({ items: items_to_flush, extra: extra });
    this.is_flushing = false;
  }

  // Graceful shutdown: cancel any scheduled timer and flush what's left
  public async shutdown(): Promise<void> {
    this.clearTimer();
    await this.flushNow();
  }

  // Optional helper to inspect current buffer size
  public getSize(): number {
    return this.items.length;
  }

  private scheduleTimer(): void {
    if (this.interval_ms <= 0 || this.timer_id !== null) {
      return;
    }

    this.timer_id = setTimeout(() => {
      // Timer has fired; clear it first, then flush
      this.timer_id = null;
      void this.flushNow();
    }, this.interval_ms);
  }

  private clearTimer(): void {
    if (this.timer_id !== null) {
      clearTimeout(this.timer_id);
      this.timer_id = null;
    }
  }

  // Internal helper: ensures we cancel the timer before flushing
  private async triggerFlushNow(): Promise<void> {
    this.clearTimer();
    await this.flushNow();
  }
}
