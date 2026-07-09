import { useEffect, useState, useCallback } from 'react';
import { connectSocket } from '../services/socket';

export const PHASE_LABELS = {
  pending: 'Upload Started',
  processing: 'Processing Images',
  uploading: 'Uploading to S3',
  completed: 'Completed',
  failed: 'Failed',
};

function phaseFromJob(data) {
  if (!data) return '';
  if (data.phase && PHASE_LABELS[data.phase]) return PHASE_LABELS[data.phase];
  if (data.phase) return data.phase;
  if (data.status && PHASE_LABELS[data.status]) return PHASE_LABELS[data.status];
  return '';
}

export function useImageJob(userId) {
  const [job, setJob] = useState(null);
  const [phase, setPhase] = useState('');

  useEffect(() => {
    if (!userId) return;

    const socket = connectSocket(userId);

    const onCreated = (data) => {
      setJob(data);
      setPhase(PHASE_LABELS.pending);
    };

    const onProgress = (data) => {
      setJob((prev) => ({ ...prev, ...data }));
      setPhase(phaseFromJob(data) || PHASE_LABELS.processing);
    };

    const onCompleted = (data) => {
      setJob((prev) => ({ ...prev, ...data, status: 'completed' }));
      setPhase(PHASE_LABELS.completed);
    };

    const onFailed = (data) => {
      setJob((prev) => ({ ...prev, ...data, status: 'failed' }));
      setPhase(PHASE_LABELS.failed);
    };

    socket.on('image-job-created', onCreated);
    socket.on('image-job-progress', onProgress);
    socket.on('image-job-completed', onCompleted);
    socket.on('image-job-failed', onFailed);

    return () => {
      socket.off('image-job-created', onCreated);
      socket.off('image-job-progress', onProgress);
      socket.off('image-job-completed', onCompleted);
      socket.off('image-job-failed', onFailed);
    };
  }, [userId]);

  const resetJob = useCallback(() => {
    setJob(null);
    setPhase('');
  }, []);

  const progressPercent =
    job?.totalImages > 0
      ? Math.round((job.processedImages / job.totalImages) * 100)
      : 0;

  return { job, phase, progressPercent, resetJob, setJob, setPhase };
}
