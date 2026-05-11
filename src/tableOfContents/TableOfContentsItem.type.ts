import type { Colour } from "src/colours/Colour.type";

export type TableOfContentsItem = {
  title: string;
  navigationId: string | null;
  italic?: boolean;
  icons?: Array<{ iconName: string; colour: Colour }>;
};
