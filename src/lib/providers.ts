// External API Provider Integration

export interface ProviderResponse {
  success: boolean;
  data?: any;
  error?: string;
  balance?: number;
}

/**
 * Connects to external API providers to fulfill orders
 */
export async function connectApi(
  url: string,
  postData: Record<string, any>,
  inputHeaders: string[] = [],
  debug: boolean = false
): Promise<ProviderResponse> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Convert array of headers to object if needed, though usually standard fetch headers are used
      },
      body: JSON.stringify(postData),
    });

    const json = await response.json();

    if (debug) {
      console.log('API Response:', json);
    }

    if (!response.ok) {
      return { success: false, error: json.error || response.statusText };
    }

    return { success: true, data: json };
  } catch (error: any) {
    console.error('API Connection Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verifies external API provider credentials and balance
 */
export async function verifyApi(apiUrl: string, apiKey: string): Promise<ProviderResponse> {
  // Most SMM panels use a standard API format (v2) where action=balance
  const postData = {
    key: apiKey,
    action: 'balance',
  };

  try {
    const result = await connectApi(apiUrl, postData);
    
    if (result.success && result.data) {
      // Check standard SMM panel balance responses
      if (result.data.balance !== undefined) {
        return { success: true, balance: parseFloat(result.data.balance) };
      }
      
      if (result.data.error) {
        return { success: false, error: result.data.error };
      }
    }
    
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
