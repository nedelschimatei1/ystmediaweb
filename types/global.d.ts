// Global browser augmentations
// Provides a typed `grecaptcha` on window to avoid casting to `any`

declare global {
  interface Window {
    grecaptcha?: {
      execute(siteKey: string, options?: { action?: string }): Promise<string>;
      ready?(cb: () => void): void;
    };
  }
}

export {};
