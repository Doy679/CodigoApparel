export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  hoverImage?: string;
  isNew?: boolean;
  description: string;
  details: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "C•Corduroy Black-01",
    price: 799.00,
    category: "Tops",
    image: "/images/products/C-CB-01.jpg",
    hoverImage: "/images/products/C-CB-01.jpg",
    isNew: true,
    description: "Premium corduroy texture meets the signature black-on-black code, meticulously stitched.",
    details: ["Premium Corduroy Fabric", "High-density Stealth Black stitching", "Signature oversized fit"]
  },
  {
    id: "2",
    name: "C•Corduroy Brown -03",
    price: 799.00,
    category: "Tops",
    image: "/images/products/C-CBR-03.jpg",
    hoverImage: "/images/products/C-CBR-03.jpg",
    isNew: true,
    description: "Rooted in the hustle, grounded by the street. A deep earth tone for the steady and the solid.",
    details: ["Premium Corduroy Fabric", "Reinforced tonal stitching", "Signature oversized fit"]
  },
  {
    id: "3",
    name: "C•Corduroy White -02",
    price: 799.00,
    category: "Tops",
    image: "/images/products/C-CW-02.jpg",
    hoverImage: "/images/products/C-CW-02.jpg",
    isNew: true,
    description: "Pristine white corduroy featuring the high-density white-on-white stitched code.",
    details: ["Premium Corduroy Fabric", "High-density white-on-white stitching", "Signature oversized fit"]
  },
  {
    id: "4",
    name: "C•ACID WASH-01",
    price: 799.00,
    category: "Tops",
    image: "/images/products/C-AW-01.jpg",
    hoverImage: "/images/products/C-AW-01.jpg",
    isNew: true,
    description: "A little toxic. Signature acid-washed finish with meticulously stitched details.",
    details: ["Limited Edition Acid Wash", "Hand-finished texture", "Premium stitched detailing"]
  }
];
