interface PaymentRequestData {
  requestId?: string;
  requester: string;
  requesterHandle: string;
  amount: string;
  note?: string;
}

interface HandleData {
  handle: string;
}

class QRService {
  private readonly QR_PREFIX = 'monadpay://';
  
  /**
   * Encode payment request data into QR format
   */
  encodePaymentRequest(data: PaymentRequestData): string {
    const payload = {
      type: 'payment-request',
      requester: data.requester,
      requesterHandle: data.requesterHandle,
      amount: data.amount,
      note: data.note || '',
      requestId: data.requestId || '',
    };
    
    return this.QR_PREFIX + 'request?' + new URLSearchParams(payload as any).toString();
  }
  
  /**
   * Encode handle into QR format
   */
  encodeHandle(handle: string): string {
    const payload = {
      type: 'handle',
      handle: handle,
    };
    
    return this.QR_PREFIX + 'handle?' + new URLSearchParams(payload as any).toString();
  }
  
  /**
   * Decode QR code data
   */
  decodeQR(qrData: string): {
    type: 'payment-request' | 'handle' | 'unknown';
    data: any;
  } {
    if (!qrData.startsWith(this.QR_PREFIX)) {
      throw new Error('Invalid QR code format');
    }
    
    const url = qrData.replace(this.QR_PREFIX, '');
    const [path, queryString] = url.split('?');
    const params = new URLSearchParams(queryString);
    
    if (path === 'request') {
      return {
        type: 'payment-request',
        data: {
          requester: params.get('requester') || '',
          requesterHandle: params.get('requesterHandle') || '',
          amount: params.get('amount') || '',
          note: params.get('note') || '',
          requestId: params.get('requestId') || '',
        },
      };
    }
    
    if (path === 'handle') {
      return {
        type: 'handle',
        data: {
          handle: params.get('handle') || '',
        },
      };
    }
    
    return {
      type: 'unknown',
      data: {},
    };
  }
}

export const qrService = new QRService();


