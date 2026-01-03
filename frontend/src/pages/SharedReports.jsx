import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReportCard } from "../pages/ReportCard.jsx";
import ConfirmationPopup from "../components/ConfirmationPopup.jsx";
const API_URL = process.env.REACT_APP_API_URL;
const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;
/**
 * SharedReports displays all reports that were shared publicly.
 * Users can load them into the compare builder and delete them.
 */
export default function SharedReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showConfirmPopupLoad, setShowConfirmPopupLoad] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const navigate = useNavigate();

  // Fetch shared/public reports
  useEffect(() => {
    const fetchSharedReports = async () => {
      try {
        const res = await fetch(`${API_URL}/api/shared`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          setReports([]);
          setLoading(false);
          return;
        }

        setReports(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch shared reports:", err);
        setReports([]);
        setLoading(false);
      }
    };

    fetchSharedReports();
  }, []);

  

  // Delete shared report
  const handleDeleteShared = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/shared/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete shared report");
        return;
      }

      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Delete shared report error:", err);
    }
  };

  if (loading) return <div>Loading shared reports…</div>;

  return (
    <div className="saved-reports-page">
      <h1 className="saved-title">Shared Reports</h1>

      {reports.length === 0 && (
        <p className="empty-state">No shared reports available.</p>
      )}

      <div className="reports-list">
        {reports.map((report) => (
          <ReportCard
            key={report._id}
            report={report}
            shareLink={`${PUBLIC_URL}/shared/${report._id}`}
            onLoad={() => {
              setShowConfirmPopupLoad(true);
              setSelectedReport(report);
            }}
            onDelete={() => {
              setSelectedDeleteId(report._id);
              setShowConfirmDelete(true);
            }}
            hideDeleteButton={false}
          />

        ))}
      </div>

      {/* Load confirmation */}
      {showConfirmPopupLoad && (
        <ConfirmationPopup
          message="Load this shared report? Your current report will be overridden."
          onConfirm={() => {
            setShowConfirmPopupLoad(false);
            navigate("/compare", {
              state: { report: selectedReport },
            });
          }}
          onCancel={() => setShowConfirmPopupLoad(false)}
        />
      )}

      {/* Delete confirmation */}
      {showConfirmDelete && (
        <ConfirmationPopup
          message="Are you sure you want to delete this shared report?"
          onConfirm={() => {
            handleDeleteShared(selectedDeleteId);
            setShowConfirmDelete(false);
          }}
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}

      <br/> <br/> <br/>
    </div>
  );
}
