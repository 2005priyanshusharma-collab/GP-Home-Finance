// Import your existing configured supabase client from your lib folder
// Adjust the path below if your supabase client file has a different name (e.g., ./supabaseClient)
import { supabase } from './supabase' 

// 1. Agent: Request a new referral code
export async function requestReferralCode(agentId: string) {
  const { data, error } = await supabase
    .from('referral_codes')
    .insert([{ agent_id: agentId, status: 'pending' }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// 2. Admin: Approve and assign a unique uppercase string code to an agent
export async function approveAgentCode(requestId: string, uniqueCode: string) {
  const cleanCode = uniqueCode.trim().toUpperCase()
  
  const { data, error } = await supabase
    .from('referral_codes')
    .update({ 
      code: cleanCode, 
      status: 'active',
      approved_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// 3. Admin: Log a manual payout to an agent interface
export async function recordAgentPayout(agentId: string, amount: number, notes: string) {
  const { data, error } = await supabase
    .from('agent_payouts')
    .insert([{ agent_id: agentId, amount, notes }])
    .select()

  if (error) throw new Error(error.message)
  return data
}

// 4. Customer Submission: Associate a customer submission using an active code
export async function linkLeadToAgent(leadId: string, referralCode: string) {
  const { data: codeData, error: codeError } = await supabase
    .from('referral_codes')
    .select('id')
    .eq('code', referralCode.trim().toUpperCase())
    .eq('status', 'active')
    .single()

  if (codeError || !codeData) {
    return { success: false, message: "Invalid or inactive referral code." }
  }

  const { error: linkError } = await supabase
    .from('referral_links')
    .insert([{ code_id: codeData.id, lead_id: leadId }])

  if (linkError) {
    return { success: false, message: "Failed to anchor referral tracking." }
  }
  
  return { success: true }
}
// 5. Agent: Read the active code status and layout ledger data
export async function getAgentReferralStatus(agentId: string) {
  // Fetch code details
  const { data: codeData, error: codeError } = await supabase
    .from('referral_codes')
    .select('code, status')
    .eq('agent_id', agentId)
    .maybeSingle() // Use maybeSingle so it returns null cleanly if no request exists yet

  // Fetch payout history
  const { data: payoutsData, error: payoutsError } = await supabase
    .from('agent_payouts')
    .select('amount, paid_at, notes')
    .eq('agent_id', agentId)
    .order('paid_at', { ascending: false })

  if (codeError) console.error("Error reading code data:", codeError.message)
  if (payoutsError) console.error("Error reading payouts data:", payoutsError.message)

  return {
    referral: codeData || null, // Will contain { code, status } or null
    payouts: payoutsData || []  // Array of payouts
  }
}