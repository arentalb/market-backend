interface InvoiceProduct {
  productName: string;
  quantity: number;
  price: number;
  unitSymbol: string;
}

export interface InvoiceData {
  invoiceId: number;
  supplierName: string;
  workerName: string;
  products: InvoiceProduct[];
}

export interface SaleInvoiceData {
  invoiceId: number;
  workerName: string;
  products: InvoiceProduct[];
}
