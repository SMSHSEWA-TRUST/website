declare module 'react-barcode' {
  import { ComponentType } from 'react';

  interface BarcodeProps {
    value: string;
    width?: number;
    height?: number;
    format?: string;
    displayValue?: boolean;
    font?: string;
    textAlign?: string;
    textPosition?: string;
    textMargin?: number;
    fontSize?: number;
    background?: string;
    lineColor?: string;
    margin?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
  }

  const Barcode: ComponentType<BarcodeProps>;
  export default Barcode;
}
