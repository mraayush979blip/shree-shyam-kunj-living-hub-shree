/**
 * Converts a standard Google Drive sharing link into a direct image URL
 * supported by browsers.
 */
export const convertGDriveLink = (url: string): string => {
  if (!url) return "";

  try {
    // 1. Try to extract ID between /d/ and /view or /
    let id = "";
    const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    
    if (dMatch) id = dMatch[1];
    else if (idMatch) id = idMatch[1];
    // 2. If it's JUST the ID itself (33 chars), grab it
    else if (url.length >= 25 && url.length <= 50 && /^[a-zA-Z0-9_-]+$/.test(url)) {
      id = url;
    }
    // 3. Fallback: Find anything that looks like an ID in a longer string
    else {
      const genericMatch = url.match(/([a-zA-Z0-9_-]{33})/);
      if (genericMatch) id = genericMatch[1];
    }

    if (id) {
      // Thumbnail endpoint is often the most reliable for bypassing scanning/permission buffers
      return `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
    }
  } catch (err) {
    console.error("Link conversion failed", err);
  }
  
  return url;
};

export const handleWhatsAppInquiry = (property: any) => {
  const shyamNum = "919617573084"; 
  
  const number = shyamNum;
  const message = `Namaste! I am interested in this property: 
🏢 *Title*: ${property.title}
📑 *Type*: ${property.type}
📍 *Location*: ${property.location}
💰 *Price*: ₹${property.price || 'Exclusive'}
  
Can you provide more details?`;

  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${number}?text=${encoded}`, '_blank');
};
