interface Window {
  yaContextCb?: Array<() => void>;
  Ya?: {
    Context?: {
      AdvManager?: {
        render: (options: { blockId: string; renderTo: string; async?: boolean }) => void;
      };
    };
  };
}

declare const Ya: Window["Ya"];