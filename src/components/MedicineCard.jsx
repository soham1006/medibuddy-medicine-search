import { memo } from "react";
import { useNavigate } from "react-router-dom";

function formatField(value) {
  if (!Array.isArray(value) || value.length === 0) {
    return "";
  }
  return value.join(", ");
}

function MedicineCard({ medicine, query }) {
  const navigate = useNavigate();
  const openfda = medicine.openfda || {};

  const brandName = formatField(openfda.brand_name);
  const genericName = formatField(openfda.generic_name);
  const manufacturer = formatField(openfda.manufacturer_name);
  const productType = formatField(openfda.product_type);
  const route = formatField(openfda.route);

  function openDetails() {
    navigate(
      `/medicine/${encodeURIComponent(
        medicine.id
      )}?q=${encodeURIComponent(query)}`
    );
  }

  return (
    <article className="medicine-card">
      <h3>{brandName || "Unknown medicine"}</h3>

      {genericName && (
        <div className="card-field">
          <span>Generic name</span>
          <strong>{genericName}</strong>
        </div>
      )}

      {manufacturer && (
        <div className="card-field">
          <span>Manufacturer</span>
          <strong>{manufacturer}</strong>
        </div>
      )}

      {productType && (
        <div className="card-field">
          <span>Product type</span>
          <strong>{productType}</strong>
        </div>
      )}

      {route && (
        <div className="card-field">
          <span>Route</span>
          <strong>{route}</strong>
        </div>
      )}

      <button
        type="button"
        className="details-button"
        onClick={openDetails}
      >
        View details →
      </button>
    </article>
  );
}

export default memo(MedicineCard);