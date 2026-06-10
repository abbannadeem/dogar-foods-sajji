export const SITE = {
  name: "Dogar Foods & Sajji",
  shortName: "Dogar Foods",
  tagline: "Authentic Pakistani Cuisine Since 2019",
  description:
    "Experience the finest Sajji, Karahi, BBQ and traditional Pakistani dishes prepared with authentic spices and quality ingredients.",
  email: "booking@dogarfoodssajji.com",
  domain: "dogarfoodssajji.com",
  hours: "12:00 PM – 4:00 AM Daily",
  socials: {
    facebook: "https://facebook.com/dogarfoodssajji",
    instagram: "https://instagram.com/dogarfoodssajji",
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

export const BRANCHES: Branch[] = [
  {
    id: "tajpura",
    name: "Tajpura Branch",
    city: "Lahore",
    address: "Main Tajpura Road, near Tajpura Chowk, Lahore",
    phone: "+923284700999",
    phoneDisplay: "0328-4700999",
    whatsapp: "923284700999",
    mapUrl: "https://maps.google.com/?q=Tajpura+Lahore",
  },
  {
    id: "garhi-shahu",
    name: "Garhi Shahu Branch",
    city: "Lahore",
    address: "Garhi Shahu, near Railway Station, Lahore",
    phone: "+923264700999",
    phoneDisplay: "0326-4700999",
    whatsapp: "923264700999",
    mapUrl: "https://maps.google.com/?q=Garhi+Shahu+Lahore",
  },
  {
    id: "faisalabad",
    name: "Faisalabad Branch",
    city: "Faisalabad",
    address: "Main Susan Road, Faisalabad",
    phone: "+923095861668",
    phoneDisplay: "0309-5861668",
    whatsapp: "923095861668",
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
