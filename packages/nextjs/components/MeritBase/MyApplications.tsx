"use client";

import React, { useCallback, useEffect, useState } from 'react';

export const MyApplications = ({ address }: { address: string | undefined }) => {
  const [applications, setApplications] = useState<any[]>([]);

  const fetchApplications = useCallback(async () => {
    const res = await fetch('/api/meritbase/applications');
    const data = await res.json();
    if (data.ok) {
      setApplications(data.applications.filter((a: any) => a.applicant.toLowerCase() === (address || '').toLowerCase()));
    }
  }, [address]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold mb-2">My Applications</h3>
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul className="space-y-2">
          {applications.map(a => (
            <li key={a.id} className="border p-2 rounded">
              <div>Job: {a.jobId}</div>
              <div>Status: {a.status}</div>
              <div>Applied at: {new Date(a.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
