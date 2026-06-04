import React, { useState, useEffect } from 'react'
import { approveAgentCode, recordAgentPayout } from '../lib/referral'
import { supabase } from '../lib/supabase' // Used directly here to read aggregated state data

interface PendingRequest {
  id: string;
  agent_id: string;
  email?: string;
  requested_at: string;
}

interface AgentSummary {
  agent_id: string;
  agent_email: string;
  referral_code: string;
  total_customers_referred: number;
  total_amount_paid: number;
}

export default function AdminReferralConsole() {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([])
  const [allAgents, setAllAgents] = useState<AgentSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [inputCodes, setInputCodes] = useState<Record<string, string>>({})
  const [payoutForm, setPayoutForm] = useState({ agentId: '', amount: '', notes: '' })

  // Core administrative engine fetch cycle
  const fetchAdminMetrics = async () => {
    try {
      // 1. Fetch pending requests mapped with auth user email accounts
      const { data: requests, error: reqError } = await supabase
        .from('referral_codes')
        .select(`id, agent_id, requested_at`)
        .eq('status', 'pending')

      if (reqError) throw reqError

      // Fetch user profile emails directly from public summary configurations
      // Adjust this select call to pull from your public custom profiles table if tracking emails there
      setPendingRequests(requests || [])

      // 2. Fetch tracking summary metrics directly using a custom client select pipeline
      // For Vite clients, reading from a custom raw PostgreSQL View inside Supabase is best
      const { data: summaryData, error: sumError } = await supabase
        .from('admin_agent_referral_summary')
        .select('*')

      if (sumError) throw sumError
      setAllAgents(summaryData || [])

    } catch (err) {
      console.error("Critical error mapping admin metrics:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminMetrics()
  }, [])

  const handleApprove = async (requestId: string) => {
    const assignedCode = inputCodes[requestId]
    if (!assignedCode || assignedCode.trim() === '') {
      return alert('Please enter a custom uppercase referral alphanumeric sequence.')
    }
    
    try {
      await approveAgentCode(requestId, assignedCode)
      alert('Referral asset approved and published.')
      fetchAdminMetrics() // Hot-reload data metrics grid cleanly
    } catch (err) {
      alert('Failed to authorize code identifier.')
    }
  }

  const handlePayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { agentId, amount, notes } = payoutForm
    if (!agentId || !amount || Number(amount) <= 0) {
      return alert('Please specify a valid partner target and positive financial payout figure.')
    }

    try {
      await recordAgentPayout(agentId, Number(amount), notes)
      alert('Manual payout successfully balanced and logged to ledger.')
      setPayoutForm({ agentId: '', amount: '', notes: '' })
      fetchAdminMetrics()
    } catch (err) {
      alert('Failed to log system ledger balance entry.')
    }
  }

  if (loading) return <div style={{ padding: '24px', color: '#666' }}>Syncing administrative console arrays...</div>

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', background: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#111' }}>
        Admin Partner Analytics & Referral Console
      </h1>

      {/* Code Allocation Workflow Grid */}
      {pendingRequests.length > 0 && (
        <div style={{ border: '1px solid #fca5a5', padding: '16px', borderRadius: '8px', marginBottom: '32px', background: '#fffef1' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#dc2626', marginBottom: '12px' }}>
            Pending Agent Code Applications ({pendingRequests.length})
          </h2>
          {pendingRequests.map(req => (
            <div key={req.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #fee2e2' }}>
              <span style={{ fontSize: '14px', color: '#4b5563', fontFamily: 'monospace' }}>ID: {req.agent_id.substring(0,8)}...</span>
              <input 
                type="text" 
                placeholder="e.g. AGNT_MUMBAI05" 
                value={inputCodes[req.id] || ''}
                onChange={(e) => setInputCodes({ ...inputCodes, [req.id]: e.target.value })} 
                style={{ padding: '6px 12px', border: '1px solid #ccc', borderRadius: '4px', textTransform: 'uppercase' }} 
              />
              <button 
                onClick={() => handleApprove(req.id)} 
                style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
              >
                Issue and Activate
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Manual Balance Settlement Control Board */}
      <div style={{ marginBottom: '32px', background: '#fff', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <h3 style={{ fontWeight: 600, fontSize: '16px', marginBottom: '14px', color: '#111' }}>Record Manual Partner Disbursal Settlement</h3>
        <form onSubmit={handlePayoutSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select 
            value={payoutForm.agentId} 
            onChange={e => setPayoutForm({...payoutForm, agentId: e.target.value})} 
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
          >
            <option value="">-- Choose Target Agent Account --</option>
            {allAgents.map(a => (
              <option key={a.agent_id} value={a.agent_id}>
                {a.agent_email || `Agent UI (${a.referral_code || 'Pending Code'})`}
              </option>
            ))}
          </select>
          <input 
            type="number" 
            placeholder="Amount (INR)" 
            value={payoutForm.amount} 
            onChange={e => setPayoutForm({...payoutForm, amount: e.target.value})} 
            style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
          <input 
            type="text" 
            placeholder="Disbursal internal details (e.g. Loan Ref #MH-492)" 
            value={payoutForm.notes} 
            onChange={e => setPayoutForm({...payoutForm, notes: e.target.value})} 
            style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', minWidth: '300px' }} 
          />
          <button 
            type="submit" 
            style={{ background: '#111827', color: '#fff', padding: '8px 18px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
          >
            Commit Payout
          </button>
        </form>
      </div>

      {/* Master Core System Ledger Grid */}
      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '14px', color: '#111' }}>Master Agent Network Tracking Grid</h2>
      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '14px', color: '#4b5563', fontWeight: '600' }}>Agent User Identity</th>
              <th style={{ padding: '14px', color: '#4b5563', fontWeight: '600' }}>Assigned Network Identifier</th>
              <th style={{ padding: '14px', color: '#4b5563', fontWeight: '600' }}>Total Onboarded Applications</th>
              <th style={{ padding: '14px', color: '#4b5563', fontWeight: '600' }}>Cumulative Disbursed Capital</th>
            </tr>
          </thead>
          <tbody>
            {allAgents.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '20px', textPosition: 'center', color: '#999', fontStyle: 'italic' }}>
                  No ecosystem agent profiles map to this system view layout yet.
                </td>
              </tr>
            ) : (
              allAgents.map((agent) => (
                <tr key={agent.agent_id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '14px', fontSize: '14px', color: '#111' }}>
                    {agent.agent_email || `ID: ${agent.agent_id.substring(0,12)}...`}
                  </td>
                  <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: 600, color: agent.referral_code ? '#111' : '#9ca3af' }}>
                    {agent.referral_code || '[Unassigned Pending]'}
                  </td>
                  <td style={{ padding: '14px', color: '#2563eb', fontWeight: '600' }}>
                    {agent.total_customers_referred} Customer Connections
                  </td>
                  <td style={{ padding: '14px', color: '#16a34a', fontWeight: '600' }}>
                    ₹{Number(agent.total_amount_paid).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}