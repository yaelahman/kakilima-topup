import { httpClient } from "@/lib/client";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type ContactInfo = {
  email: string | null;
  whatsapp: string | null;
  whatsapp_raw: string | null;
  whatsapp_link: string | null;
  facebook: string | null;
  instagram: string | null;
  operational_hours: string;
  address: string | null;
};

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

export type ContactResponse = {
  success: boolean;
  message: string;
};

export async function getContactInfo(): Promise<ContactInfo> {
  return httpClient({ route: "/contact" });
}

export async function submitContactForm(
  payload: ContactPayload
): Promise<ContactResponse> {
  const { data } = await axios.post<ContactResponse>(
    `${API_URL}/contact`,
    payload,
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  return data;
}
