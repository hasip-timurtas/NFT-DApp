import { pinataKey, pinataSecret } from './constants';

export const uploadImageToIpfs = async (file) => {
  const endpoint = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'pinata_api_key': pinataKey,
        'pinata_secret_api_key': pinataSecret,
      },
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        pinataUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      };
    } else {
      throw new Error(result.error || 'Failed to pin file to IPFS');
    }
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    return {
      success: false,
      message: error.message,
    };
  }
};
