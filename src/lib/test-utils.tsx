import { render, type RenderOptions } from "@testing-library/react";
import { type ReactElement } from "react";

// SWR 導入時に SWRTestProvider を追加する
// import { SWRConfig } from "swr";
//
// function SWRTestProvider({ children }: { children: React.ReactNode }) {
//   return (
//     <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
//       {children}
//     </SWRConfig>
//   );
// }

function customRender(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, { ...options });
}

export { customRender as render };
export { screen, within, waitFor } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
