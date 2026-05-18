import React, { useState } from 'react';

function ConfirmationPopup({ onClose, onConfirm }) {
    const [deleting, setDeleting] = useState(false);

    async function handleConfirm() {
        setDeleting(true);
        await onConfirm();
        setDeleting(false);
    }

    return (
        <div className="modal-overlay">
            <div className="confirmation-popup">
                <div className="confirmation-icon">⚠️</div>
                <h3>Delete Account</h3>
                <p>Are you sure you want to delete your account? This action cannot be undone. All your boards, columns and tasks will be permanently deleted.</p>
                <div className="confirmation-actions">
                    <button className="btn-cancel" onClick={onClose} disabled={deleting}>Cancel</button>
                    <button className="btn-danger" onClick={handleConfirm} disabled={deleting}>
                        {deleting ? "Deleting..." : "Delete Account"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationPopup;