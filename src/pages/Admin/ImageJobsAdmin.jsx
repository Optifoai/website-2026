import React, { useEffect, useState } from 'react';
import { getRequest, postRequest } from '../../services';
import { APICONFIG } from '../../Redux/ApiConfig';
import { notify } from '../../utils/helpers';

const TABS = ['pending', 'processing', 'completed', 'failed'];

function ImageJobsAdmin() {
  const [activeTab, setActiveTab] = useState('pending');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadJobs = async (status) => {
    setLoading(true);
    try {
      const res = await getRequest(
        `${APICONFIG.ADMIN_IMAGE_JOBS}?status=${status}&limit=50`
      );
      setJobs(res?.jobs || []);
    } catch (err) {
      notify('error', err?.message || 'Failed to load jobs');
    }
    setLoading(false);
  };

  const loadJobDetail = async (id) => {
    try {
      const res = await getRequest(`${APICONFIG.ADMIN_IMAGE_JOBS}/${id}`);
      setSelectedJob(res);
    } catch (err) {
      notify('error', err?.message || 'Failed to load job detail');
    }
  };

  useEffect(() => {
    loadJobs(activeTab);
  }, [activeTab]);

  const retryJob = async (id) => {
    try {
      await postRequest(`${APICONFIG.ADMIN_IMAGE_JOBS}/${id}/retry`, {});
      notify('success', 'Job queued for retry');
      loadJobs(activeTab);
    } catch (err) {
      notify('error', err?.message || 'Retry failed');
    }
  };

  const cancelJob = async (id) => {
    try {
      await postRequest(`${APICONFIG.ADMIN_IMAGE_JOBS}/${id}/cancel`, {});
      notify('success', 'Job cancelled');
      loadJobs(activeTab);
    } catch (err) {
      notify('error', err?.message || 'Cancel failed');
    }
  };

  return (
    <div className="container-fluid p-4">
      <h2>Image Job Queue</h2>

      <div className="nav nav-tabs mb-3">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`nav-link ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Car ID</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{String(job._id).slice(-8)}</td>
                <td>{job.carId}</td>
                <td>{job.status}</td>
                <td>{job.processedImages}/{job.totalImages}</td>
                <td>{new Date(job.created).toLocaleString()}</td>
                <td>
                  <button type="button" className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => loadJobDetail(job._id)}>Logs</button>
                  {job.status === 'failed' && (
                    <button type="button" className="btn btn-sm btn-warning me-1"
                      onClick={() => retryJob(job._id)}>Retry</button>
                  )}
                  {job.status === 'pending' && (
                    <button type="button" className="btn btn-sm btn-danger"
                      onClick={() => cancelJob(job._id)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedJob && (
        <div className="card mt-4">
          <div className="card-header d-flex justify-content-between">
            <span>Job logs — {selectedJob.carId}</span>
            <button type="button" className="btn btn-sm btn-secondary"
              onClick={() => setSelectedJob(null)}>Close</button>
          </div>
          <div className="card-body">
            <pre className="small">{JSON.stringify(selectedJob.logs || [], null, 2)}</pre>
            <h6>Items</h6>
            <ul>
              {(selectedJob.items || []).map((item) => (
                <li key={item._id}>
                  {item.imageName}: {item.status} {item.errorMessage || ''}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageJobsAdmin;
