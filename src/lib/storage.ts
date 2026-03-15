import { supabase } from './supabase';

// ☁️ CLOUDINARY CONFIG
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Upload failed");
  
  return data.secure_url;
};

// 📧 BREVO EMAIL UTILITY
const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;

export const sendPropertyAlert = async (property: any, subscribers: any[]) => {
  const emails = subscribers.map(s => ({ email: s.email, name: s.name }));
  
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: "Shyam Kunj Living Hub", email: "aayush.70.sharma@gmail.com" },
      replyTo: { email: "aayush.70.sharma@gmail.com", name: "Shyam Kunj Living Hub" },
      to: emails,
      subject: `New Property: ${property.title} in ${property.location}`,
      textContent: `New Premium Listing: ${property.title} in ${property.location}. Price: ₹ ${property.price}. View details at: https://shyam-kunj-living-hub.vercel.app`,
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h1 style="color: #0f172a;">New Premium Listing</h1>
          <img src="${property.image}" style="width: 100%; border-radius: 8px; margin: 20px 0;" />
          <h2>${property.title}</h2>
          <p>📍 Location: ${property.location}</p>
          <p>💰 Price: ₹ ${property.price}</p>
          <a href="https://shyam-kunj-living-hub.vercel.app" style="background: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 20px;">View Full Details</a>
        </div>
      `
    })
  });

  return response.ok;
};

export interface Property {
  id: string; // Changed to string for UUID
  title: string;
  type: string;
  location: string;
  price?: string;
  image: string;
  instagramLink?: string;
  address?: string;
  is_featured?: boolean;
  googleMapsLink?: string;
}

export const getGeneralProperties = async (): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('is_featured', false)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Supabase Error [General Properties]:", error);
    return [];
  }
  
  return (data || []).map(mapDbToProperty);
};

export const getFeaturedProperties = async (): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase Error [Featured Properties]:", error);
    return [];
  }
  
  return (data || []).map(mapDbToProperty);
};

export const addPropertyToStorage = async (type: 'featured' | 'general', property: any) => {
  const { error } = await supabase
    .from('properties')
    .insert([{
      title: property.title,
      type: property.type,
      location: property.location,
      price: property.price,
      image_url: property.image,
      instagram_link: property.instagramLink,
      address: property.address,
      google_maps_link: property.googleMapsLink,
      is_featured: type === 'featured'
    }]);

  if (error) throw error;
};

export const removePropertyFromStorage = async (id: string) => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const updatePropertyInStorage = async (id: string, property: any) => {
  const { error } = await supabase
    .from('properties')
    .update({
      title: property.title,
      type: property.type,
      location: property.location,
      price: property.price,
      image_url: property.image,
      instagram_link: property.instagramLink,
      address: property.address,
      google_maps_link: property.googleMapsLink
    })
    .eq('id', id);

  if (error) throw error;
};

export const getSubscribers = async () => {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching subscribers:", error);
    return [];
  }
  return data;
};

// Helper to map DB snake_case to Frontend camelCase
const mapDbToProperty = (db: any): Property => ({
  id: db.id,
  title: db.title,
  type: db.type,
  location: db.location,
  price: db.price,
  image: db.image_url,
  instagramLink: db.instagram_link,
  address: db.address,
  googleMapsLink: db.google_maps_link,
  is_featured: db.is_featured
});

// Mock init for compatibility
export const initStorage = () => {};
