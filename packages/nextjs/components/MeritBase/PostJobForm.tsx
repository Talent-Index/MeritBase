"use client";

import React, { useState } from 'react';

export const PostJobForm = ({ onPosted }: { onPosted?: (job: any) => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fee, setFee] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [requirements, setRequirements] = useState('');

  const submit = async () => {
    const job = {
      employer: '0x0',
      title,
      description,
      fee: Number(fee) || 0,
      venue,
      date,
      requirements: requirements.split(',').map(s => s.trim()).filter(Boolean),
    };
    const res = await fetch('/api/meritbase/jobs', { method: 'POST', body: JSON.stringify(job) });
    const data = await res.json();
    if (onPosted) onPosted(data.job);
    setTitle(''); setDescription(''); setFee(''); setVenue(''); setDate(''); setRequirements('');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Post a Job</h3>
      <input className="input input-bordered w-full mb-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea className="textarea textarea-bordered w-full mb-2" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <input className="input input-bordered w-full mb-2" placeholder="Fee" value={fee} onChange={e => setFee(e.target.value)} />
      <input className="input input-bordered w-full mb-2" placeholder="Venue" value={venue} onChange={e => setVenue(e.target.value)} />
      <input className="input input-bordered w-full mb-2" placeholder="Date (ISO)" value={date} onChange={e => setDate(e.target.value)} />
      <input className="input input-bordered w-full mb-2" placeholder="Requirements (comma separated)" value={requirements} onChange={e => setRequirements(e.target.value)} />
      <div className="flex justify-end">
        <button className="btn btn-primary" onClick={submit}>Post</button>
      </div>
    </div>
  );
};
