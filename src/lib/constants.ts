// Portfolio demo data — replace with real business details before production use.
export const SITE = {
  name: "Dogar Foods & Sajji",
  shortName: "Dogar Foods",
  tagline: "Authentic Pakistani Cuisine Since 2019",
  description:
    "Experience the finest Sajji, Karahi, BBQ and traditional Pakistani dishes prepared with authentic spices and quality ingredients.",
  email: "hello@example.com",
  domain: "dogar-foods-sajji.vercel.app",
  hours: "12:00 PM – 4:00 AM Daily",
  socials: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    youtube: "#",
    tiktok: "#",
  },
} as const;

export type Branch = {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  mapUrl: string;
};

// Demo phone numbers — clearly placeholders. Replace with real numbers in production.
export const BRANCHES: Branch[] = [
  {
    id: "tajpura",
    name: "Tajpura Branch",
    city: "Lahore",
    address: "Main Tajpura Road, near Tajpura Chowk, Lahore",
    phone: "+923001234567",
    phoneDisplay: "0300-1234567",
    whatsapp: "923001234567",
    mapUrl: "https://maps.google.com/?q=Tajpura+Lahore",
  },
  {
    id: "garhi-shahu",
    name: "Garhi Shahu Branch",
    city: "Lahore",
    address: "Garhi Shahu, near Railway Station, Lahore",
    phone: "+923011234567",
    phoneDisplay: "0301-1234567",
    whatsapp: "923011234567",
    mapUrl: "https://maps.google.com/?q=Garhi+Shahu+Lahore",
  },
  {
    id: "faisalabad",
    name: "Faisalabad Branch",
    city: "Faisalabad",
    address: "Main Susan Road, Faisalabad",
    phone: "+923211234567",
    phoneDisplay: "0321-1234567",
    whatsapp: "923211234567",
    mapUrl: "https://maps.google.com/?q=Susan+Road+Faisalabad",
  },
];

export const PRIMARY_WHATSAPP = BRANCHES[0].whatsapp;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/branches", label: "Branches" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
] as const;
