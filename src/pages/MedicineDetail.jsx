import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getMedicine } from "../api";

function formatValue(value) {
  if (!Array.isArray(value) || value.length === 0) {
    return "";
  }

  return value.join(", ");
}

function InformationSection({ title, value }) {
  if (!value) {
    return null;
  }

  return (
    <section className="info-section">
      <h2>{title}</h2>
      <p>{value}</p>
    </section>
  );
}

function MedicineDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const previousQuery = searchParams.get("q") || "";

  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadMedicine() {
      try {
        setLoading(true);
        setError("");

        const result = await getMedicine(
          decodeURIComponent(id),
          controller.signal
        );

        if (!result) {
          setError("Medicine not found.");
          return;
        }

        setMedicine(result);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        setError(
          err.message || "Unable to load medicine details."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMedicine();

    return () => controller.abort();
  }, [id]);

  const backUrl = previousQuery
    ? `/?q=${encodeURIComponent(previousQuery)}`
    : "/";

  if (loading) {
    return (
      <main className="container">
        <div className="status" role="status">
          <div className="loader" />
          <h2>Loading medicine...</h2>
        </div>
      </main>
    );
  }

  if (error || !medicine) {
    return (
      <main className="container detail-container">
        <Link to={backUrl} className="back-link">
          ← Back to search
        </Link>

        <div className="status error">
          <h2>{error || "Medicine not found."}</h2>
        </div>
      </main>
    );
  }

  const openfda = medicine.openfda || {};

  return (
    <main className="container detail-container">
      <Link to={backUrl} className="back-link">
        ← Back to search results
      </Link>

      <article className="detail-card">
        <header className="detail-header">
          <p className="eyebrow">MEDICINE DETAILS</p>

          <h1>
            {formatValue(openfda.brand_name) || "Medicine"}
          </h1>
        </header>

        <div className="detail-grid">
          {formatValue(openfda.generic_name) && (
            <div className="detail-item">
              <span>Generic name</span>
              <strong>
                {formatValue(openfda.generic_name)}
              </strong>
            </div>
          )}

          {formatValue(openfda.manufacturer_name) && (
            <div className="detail-item">
              <span>Manufacturer</span>
              <strong>
                {formatValue(openfda.manufacturer_name)}
              </strong>
            </div>
          )}

          {formatValue(openfda.product_type) && (
            <div className="detail-item">
              <span>Product type</span>
              <strong>
                {formatValue(openfda.product_type)}
              </strong>
            </div>
          )}

          {formatValue(openfda.route) && (
            <div className="detail-item">
              <span>Route</span>
              <strong>{formatValue(openfda.route)}</strong>
            </div>
          )}

          {formatValue(openfda.application_number) && (
            <div className="detail-item">
              <span>Application number</span>
              <strong>
                {formatValue(openfda.application_number)}
              </strong>
            </div>
          )}

          {formatValue(openfda.product_ndc) && (
            <div className="detail-item">
              <span>Product NDC</span>
              <strong>
                {formatValue(openfda.product_ndc)}
              </strong>
            </div>
          )}
        </div>

        <InformationSection
          title="Description"
          value={formatValue(medicine.description)}
        />

        <InformationSection
          title="Indications & Usage"
          value={formatValue(medicine.indications_and_usage)}
        />

        <InformationSection
          title="Warnings"
          value={formatValue(medicine.warnings)}
        />

        <InformationSection
          title="Dosage & Administration"
          value={formatValue(medicine.dosage_and_administration)}
        />

        <InformationSection
          title="Active Ingredient"
          value={formatValue(medicine.active_ingredient)}
        />
      </article>
    </main>
  );
}

export default MedicineDetail;