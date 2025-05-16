export type ChainSelectOptionType = {
  label: string;
  value: string;
  chain: {
    id: string;
    name: string;
    networkName: string;
    svgUrl?: string;
    pngUrl?: string;
  };
};
