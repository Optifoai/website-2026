import React from 'react';
import PropTypes from 'prop-types';

function ImageJobProgress({ phase, progressPercent, job, onClose }) {
  const status = job?.status || 'pending';
  const isDone = status === 'completed' || status === 'failed';

  return (
    <div className="image-job-progress-overlay">
      <div className="image-job-progress-card">
        <h3>{phase || 'Processing your car images'}</h3>

        {job?.totalImages > 0 && (
          <div className="progress mb-3" style={{ height: '8px' }}>
            <div
              className={`progress-bar ${status === 'failed' ? 'bg-danger' : 'bg-success'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        <p className="text-muted mb-2">
          {job?.processedImages ?? 0} / {job?.totalImages ?? 0} images
          {job?.currentImage ? ` — ${job.currentImage}` : ''}
        </p>

        <ul className="image-job-phases list-unstyled small">
          <li className={phase === 'Upload Started' || status === 'pending' ? 'active' : ''}>
            Upload Started
          </li>
          <li className={phase === 'Processing Images' ? 'active' : ''}>Processing Images</li>
          <li className={phase === 'Uploading to S3' ? 'active' : ''}>Uploading to S3</li>
          <li className={status === 'completed' ? 'active text-success' : ''}>Completed</li>
          <li className={status === 'failed' ? 'active text-danger' : ''}>Failed</li>
        </ul>

        {isDone && onClose && (
          <button type="button" className="btn btn-primary mt-2" onClick={onClose}>
            {status === 'completed' ? 'Go to Dashboard' : 'Close'}
          </button>
        )}
      </div>
    </div>
  );
}

ImageJobProgress.propTypes = {
  phase: PropTypes.string,
  progressPercent: PropTypes.number,
  job: PropTypes.object,
  onClose: PropTypes.func,
};

export default ImageJobProgress;
