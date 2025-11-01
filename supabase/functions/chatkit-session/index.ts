import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const CHATKIT_WORKFLOW_ID = Deno.env.get('CHATKIT_WORKFLOW_ID')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateSessionRequestBody {
  workflow_id?: string
  workflow_version?: string
  user_id?: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate API key
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body
    let requestBody: CreateSessionRequestBody = {}
    try {
      requestBody = await req.json()
    } catch {
      // If no body, use defaults
    }

    const workflowId = requestBody.workflow_id || CHATKIT_WORKFLOW_ID
    const workflowVersion = requestBody.workflow_version
    const userId = requestBody.user_id || `anonymous-${Date.now()}`

    if (!workflowId) {
      return new Response(
        JSON.stringify({ error: 'workflow_id not provided and CHATKIT_WORKFLOW_ID not configured' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('[chatkit-session] Creating session', { workflowId, workflowVersion, userId })

    // Build workflow object
    const workflow: any = { id: workflowId }
    if (workflowVersion) {
      workflow.version = workflowVersion
    }

    // Call OpenAI ChatKit API
    const response = await fetch('https://api.openai.com/v1/chatkit/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'chatkit_beta=v1',
      },
      body: JSON.stringify({
        workflow,
        user: userId,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[chatkit-session] OpenAI API error', {
        status: response.status,
        data,
      })
      return new Response(
        JSON.stringify({
          error: 'Failed to create ChatKit session',
          details: data,
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('[chatkit-session] Session created successfully')

    return new Response(
      JSON.stringify({
        client_secret: data.client_secret,
        expires_after: data.expires_after,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('[chatkit-session] Unexpected error', error)
    return new Response(
      JSON.stringify({ error: 'Unexpected error creating session' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
