import { pinataKey, pinataSecret } from './constants';

export const uploadJsonToIpfs = async (jsonContent) => {
  const endpoint = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': pinataKey,
        'pinata_secret_api_key': pinataSecret,
      },
      body: JSON.stringify(jsonContent),
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        pinataUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      };
    } else {
      throw new Error(result.error || 'Failed to pin JSON to IPFS');
    }
  } catch (error) {
    console.log(error)
    console.error('Error uploading JSON to IPFS:', error);
    return {
      success: false,
      message: error.message,
    };
  }
};
