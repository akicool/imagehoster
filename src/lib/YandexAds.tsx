"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function Ads({ blockID }: { blockID: string }) {
  useEffect(() => {
    window!.yaContextCb!.push(() => {
      Ya!.Context!.AdvManager!.render({
        blockId: `R-A-16677951-${blockID}`,
        renderTo: `yandex_rtb_R-A-16677951-${blockID}`,
        async: true,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usePathname, useSearchParams]);

  return <div id={`yandex_rtb_R-A-16677951-${blockID}`}></div>;
}
