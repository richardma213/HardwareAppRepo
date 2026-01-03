import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {ReportCard} from "../pages/ReportCard.jsx";
import ConfirmationPopup from "../components/ConfirmationPopup.jsx";
const API_URL = process.env.REACT_APP_API_URL;
/**
 * Class SavedReports handles the save report page and any actions 
 * (Delete reports, Load reports)
 */
export default function SavedReports() {
  
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showConfirmPopup, setshowConfirmPopup] = useState(false);
  const[selectedReportId, setSelectedReportId] = useState(null);
  const [showConfirmPopupLoad, setshowConfirmPopupLoad] = useState(false);
  const[selectedReport, setselectedReport] = useState(null);
  
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/reports/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if(!res.ok){
        console.error("failed to delete report");
        return;
    }

    alert("successfully deleted report");
    setReports((reports) => {
        const new_reports = reports.filter(report => report._id !== id);
        return new_reports;
    })
  }

  // UseEffect to load a user's reports from database
  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/reports`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!Array.isArray(data)){
        setReports([]);
        setLoading(false);
        return 
      }
      setReports(data);
      setLoading(false);
    };

    fetchReports();
  }, []);

  if (loading) return <div>Loading reports…</div>;


  return (
   <div className="saved-reports-page">
    <h1 className="saved-title">Saved Reports</h1>

    {reports.length === 0 && (
        <p className="empty-state">You have no saved reports yet.</p>
    )}

    <div className="reports-list">
        {reports.map((report) => (
        <ReportCard
            key={report._id}
            report={report}

            onLoad={() => {
                setshowConfirmPopupLoad(true)
                setselectedReport(report)
              }
         
            }
    
            onDelete={() => {
                setshowConfirmPopup(true)
                setSelectedReportId(report._id)
              }
            }
            
        />
        ))}
        
    </div>
        {showConfirmPopup && (
          <ConfirmationPopup
          message = "Are you sure you want to delete this report?"
          onConfirm= {() => {
            handleDelete(selectedReportId)
            setshowConfirmPopup(false);
          }}
          onCancel={() => setshowConfirmPopup(false)}
          />
        )}

        {showConfirmPopupLoad && (
          <ConfirmationPopup
          message = "Are you sure you want to load? Your current report will be overridden."
          onConfirm={() => {
            setshowConfirmPopupLoad(false)
            navigate("/compare", {
              state: { report: selectedReport }
            })
          }
          }
          onCancel={() => setshowConfirmPopupLoad(false)}
          />
        )}
    <br/><br/>
    
  </div>

  );
}
