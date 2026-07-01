import Link from "next/link";
import Thumb from "../ui/Thumb";
import { Icons } from "./Icons";
import { Service } from "../../lib/firestore/types";

interface ServiceCardProps {
  service: Service;
  businessName: string;
}

export default function ServiceCard({ service, businessName }: ServiceCardProps) {
  return (
    <Link href={`/jasa/${service.id}`} className="card product-card">
      <Thumb color={service.thumbColor || "#00C0A3"} label={service.name.slice(0, 3)} />
      <span className="badge" style={{ borderColor: "var(--aqua)", color: "var(--aqua)" }}>Jasa</span>
      
      <div className="body">
        <div className="cat-label" style={{ color: "var(--aqua)" }}>{service.category}</div>
        <h3>{service.name}</h3>
        <div className="owner">
          oleh <span style={{ color: "var(--primary)", fontWeight: 600 }}>{businessName}</span>
        </div>

        {/* Small metadata badges */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
          <span style={{ 
            fontSize: "10px", 
            backgroundColor: "var(--surface-2)", 
            color: "var(--primary)", 
            padding: "2px 8px", 
            borderRadius: "4px",
            fontWeight: 500
          }}>
            {service.serviceType}
          </span>
          <span style={{ 
            fontSize: "10px", 
            backgroundColor: service.isNegotiable ? "var(--secondary)" : "var(--surface-2)", 
            color: "var(--dark)", 
            padding: "2px 8px", 
            borderRadius: "4px",
            fontWeight: 600
          }}>
            {service.isNegotiable ? "Bisa Nego" : "Harga Pas"}
          </span>
        </div>
        
        <div className="price-row">
          <span className="price" style={{ fontSize: "15px", fontWeight: 700 }}>
            {service.priceEstimation}
          </span>
          <span className="clicks">
            <Icons.Eye />
            {service.clickCount} klik
          </span>
        </div>
      </div>
    </Link>
  );
}
