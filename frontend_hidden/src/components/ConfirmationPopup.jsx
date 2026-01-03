import "./ConfirmationPopup.css"
export default function ConfirmationPopup( {message, onConfirm, onCancel}){

    return (
        <div className="confirm-overlay">
        <div className="confirm-box">
            <p className="confirm-message">{message}</p>

            <div className="confirm-actions">
            <button className="confirm-btn danger" onClick={onConfirm}>
                Yes, continue
            </button>

            <button className="confirm-btn" onClick={onCancel}>
                Cancel
            </button>
            </div>
        </div>
        </div>

    );
}