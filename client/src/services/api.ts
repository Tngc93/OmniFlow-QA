import { Scenario, RealMetricsData } from '../types';

export const API_BASE = import.meta.env.VITE_API_BASE || 
  (typeof window !== 'undefined' && window.location.port === '5173' ? 'http://localhost:5000/api' : '/api');

export async function fetchScenarios(): Promise<Scenario[]> {
  try {
    const res = await fetch(`${API_BASE}/scenarios`);
    if (!res.ok) throw new Error('Failed to fetch scenarios');
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    return [];
  }
}

export async function fetchMetrics(): Promise<RealMetricsData | null> {
  try {
    const res = await fetch(`${API_BASE}/metrics`);
    if (!res.ok) throw new Error('Failed to fetch metrics');
    return await res.json();
  } catch (err) {
    console.error('Metrics Error:', err);
    return null;
  }
}

export async function runScenario(id: string, options?: { viewport?: string }): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/scenarios/${id}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options || {})
    });
    return res.ok;
  } catch (err) {
    console.error('Run Error:', err);
    return false;
  }
}

export async function createScenario(data: Partial<Scenario>): Promise<Scenario | null> {
  try {
    const res = await fetch(`${API_BASE}/scenarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create scenario');
    return await res.json();
  } catch (err) {
    console.error('Create Scenario Error:', err);
    return null;
  }
}

export async function fetchRuns(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/runs`);
    if (!res.ok) throw new Error('Failed to fetch runs');
    return await res.json();
  } catch (err) {
    console.error('Runs Error:', err);
    return [];
  }
}

