import { useState, useEffect } from 'react'
import { requestReferralCode, getAgentReferralStatus } from '../lib/referral'

interface AgentReferralSectionProps {
  agentId: string;
}

export default function AgentReferralSection({ agentId }: AgentReferralSectionProps) {
  const [referral, setReferral] = useState<{ code: string | null; status: string } | null>(null)
  const [payouts, setPayouts] = useState<Array<{ amount: number; paid_at: string; notes: string }>>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Fetch the data on component mount
  useEffect(() => {
    async function loadReferralData() {
      try {
        const data = await getAgentReferralStatus(agentId)
        setReferral(data.referral)
        setPayouts(data.payouts)
      } catch (err) {
        console.error("Error loading agent data:", err)
      } finally {
        setLoading(false)
      }
    }
    if (agentId) loadReferralData()
  }, [agentId])

  const totalEarnings = payouts.reduce((sum, item) => sum + Number(item.amount), 0)

  const handleApply = async () => {
    setActionLoading(true)
    try {
      await requestReferralCode(agentId)
      // Optimistically update the UI to pending status
      setReferral({ code: null, status: 'pending' })
    } catch (err) {
      alert("Error processing your referral asset request. Please try again.")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '20px', color: '#666' }}>Loading partner portal...</div>

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', color: '#333' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Refer & Earn Program</h2>
      
      {/* State A: No Code Request Filed */}
      {!referral && (
        <div>
          <p style={{ color: '#555', marginBottom: '16px', lineHeight: '1.5' }}>
            Grow your network with GP Home Finance. Apply for a unique company tracking identifier to start getting paid for your client referrals.
          </p>
          <button 
            onClick={handleApply} 
            disabled={actionLoading} 
            style={{ background: '#0070f3', color: '#fff', padding: '10px 20px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: '500' }}
          >
            {actionLoading ? 'Submitting Application...' : 'Apply for Referral Code'}
          </button>
        </div>
      )}

      {/* State B: Code Pending Approval */}
      {referral && referral.status === 'pending' && (
        <div style={{ background: '#fef3c7', color: '#d97706', padding: '16px', borderRadius: '6px', border: '1px solid #fde68a' }}>
          ⏳ Your application for a referral tracking asset is pending verification from system administration.
        </div>
      )}

      {/* State C: Active Code & Analytics Ledger */}
      {referral && referral.status === 'active' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Your Active Referral Code:</span>
            <strong style={{ background: '#f3f4f6', padding: '6px 12px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '18px', border: '1px dashed #ccc', color: '#111' }}>
              {referral.code}
            </strong>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '6px', marginBottom: '24px' }}>
            <span style={{ fontSize: '14px', color: '#166534', fontWeight: '500' }}>Total Tracked Disbursed Earnings:</span>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#15803d', marginTop: '4px' }}>
              ₹{totalEarnings.toLocaleString('en-IN')}
            </div>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Payout History Ledger</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                <th style={{ padding: '10px', color: '#666' }}>Date</th>
                <th style={{ padding: '10px', color: '#666' }}>Amount</th>
                <th style={{ padding: '10px', color: '#666' }}>Internal Tracking Notes</th>
              </tr>
            </thead>
            <tbody>
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: '12px', textPosition: 'center', color: '#999', fontStyle: 'italic' }}>
                    No recorded payouts found. Settlements update dynamically once logged by administration.
                  </td>
                </tr>
              ) : (
                payouts.map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px' }}>{new Date(p.paid_at).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '10px', fontWeight: '600', color: '#111' }}>₹{p.amount.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px', color: '#666' }}>{p.notes || 'Manual Disbursal Settlement'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}