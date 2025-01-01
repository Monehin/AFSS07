import { AiFillInstagram } from "react-icons/ai";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa";

export const platformOptions = [
  { id: "linkedin", label: "LinkedIn", icon: FaLinkedin, color: `#0077B5` },
  {
    id: "instagram",
    label: "Instagram",
    icon: AiFillInstagram,
    color: `#fccc63`,
  },
  {
    id: "x",
    label: "X (formerly Twitter)",
    icon: BsTwitterX,
    color: `#000000`,
  },
  { id: "youtube", label: "YouTube", icon: FaYoutube, color: `#FF0000` },
  { id: "facebook", label: "Facebook", icon: FaFacebook, color: `#0077B5` },
];
