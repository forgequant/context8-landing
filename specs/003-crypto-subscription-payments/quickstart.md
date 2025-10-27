# Quickstart: Crypto Subscription Payment System

**Feature**: 003-crypto-subscription-payments
**Audience**: Developers implementing this feature
**Time**: 30 minutes to understand, 4-6 hours to implement

## Prerequisites

- ✅ Existing Context8 frontend (React 19 + Vite + Tailwind)
- ✅ Supabase project with Auth configured
- ✅ Access to Supabase Dashboard (for SQL migrations)
- ✅ Static crypto wallet addresses (Ethereum, Polygon, BSC)
- ✅ Admin user email(s) to grant admin role

## Step 1: Database Setup (15 minutes)

### 1.1 Run Migration

Open Supabase Dashboard → SQL Editor → New Query

Copy entire content from `contracts/database.sql` and execute.

**Verify**:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_name IN ('subscriptions', 'payment_submissions');
```

### 1.2 Grant Admin Role

```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'your-admin@email.com';
```

## Step 2: Install Dependencies (2 minutes)

```bash
cd frontend-v2
npm install qrcode.react date-fns
```

## Step 3: Configure Wallet Addresses (5 minutes)

Create `frontend-v2/src/data/walletAddresses.ts`:

```typescript
import { WalletAddresses } from '../types/subscription'

export const WALLET_ADDRESSES: WalletAddresses = {
  ethereum: {
    usdt: '0x...', // Your Ethereum USDT address
    usdc: '0x...'  // Your Ethereum USDC address
  },
  polygon: {
    usdt: '0x...', // Your Polygon USDT address
    usdc: '0x...'  // Your Polygon USDC address
  },
  bsc: {
    usdt: '0x...', // Your BSC USDT address
    usdc: '0x...'  // Your BSC USDC address
  }
}
```

## Step 4: Create Type Definitions (3 minutes)

Copy `contracts/types.ts` to `frontend-v2/src/types/subscription.ts`

## Step 5: Build Components (3 hours)

### 5.1 Payment Modal

**File**: `frontend-v2/src/components/payment/PaymentModal.tsx`

**Key Features**:
- Chain selector (Ethereum/Polygon/BSC)
- Stablecoin selector (USDT/USDC)
- QR code display using `qrcode.react`
- Transaction hash input with validation
- Submit button with loading state

### 5.2 Admin Panel

**File**: `frontend-v2/src/pages/Admin.tsx`

**Key Features**:
- List pending payments (fetch from `payment_submissions`)
- Blockchain explorer links (Etherscan/Polygonscan/BSCScan)
- Approve/Reject buttons
- Verification notes input

### 5.3 Subscription Status

**File**: `frontend-v2/src/components/subscription/SubscriptionStatus.tsx`

**Key Features**:
- Current plan display
- Days remaining calculation
- Expiration warnings
- Renew button

## Step 6: Implement Hooks (1 hour)

### 6.1 useSubscription Hook

```typescript
// frontend-v2/src/hooks/useSubscription.ts
export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSubscription() {
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      setSubscription(data)
      setLoading(false)
    }
    fetchSubscription()
  }, [])

  return { subscription, loading }
}
```

### 6.2 usePaymentSubmissions Hook (Admin)

```typescript
// frontend-v2/src/hooks/usePaymentSubmissions.ts
export function usePaymentSubmissions() {
  const [submissions, setSubmissions] = useState<PaymentSubmissionWithUser[]>([])

  useEffect(() => {
    async function fetchSubmissions() {
      const { data } = await supabase
        .from('payment_submissions')
        .select('*, user:auth.users(email)')
        .eq('status', 'pending')
        .order('submitted_at', { ascending: true })

      setSubmissions(data)
    }
    fetchSubmissions()
  }, [])

  return { submissions, refetch: () => fetchSubmissions() }
}
```

## Step 7: Add Routing (5 minutes)

Update `frontend-v2/src/App.tsx`:

```typescript
<Routes>
  <Route path="/" element={<Landing />} />
  <Route path="/auth" element={<Auth />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
</Routes>
```

Create AdminRoute guard:
```typescript
function AdminRoute({ children }) {
  const { user } = useAuth()
  const isAdmin = user?.user_metadata?.is_admin === true

  if (!isAdmin) return <Navigate to="/dashboard" />
  return children
}
```

## Step 8: Update Dashboard (30 minutes)

Modify `frontend-v2/src/pages/Dashboard.tsx`:

```typescript
import { useSubscription } from '../hooks/useSubscription'
import { PaymentModal } from '../components/payment/PaymentModal'

export function Dashboard() {
  const { subscription } = useSubscription()
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  return (
    <div>
      <SubscriptionStatus subscription={subscription} />

      {subscription?.plan === 'free' && (
        <button onClick={() => setShowPaymentModal(true)}>
          Upgrade to Pro
        </button>
      )}

      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
    </div>
  )
}
```

## Step 9: Testing (1 hour)

### 9.1 Manual Test Flow

1. ✅ User logs in → sees Free plan
2. ✅ Click "Upgrade to Pro"
3. ✅ Select blockchain (e.g., Polygon)
4. ✅ QR code displays correct address
5. ✅ Submit transaction hash (valid format)
6. ✅ Admin sees pending payment
7. ✅ Admin clicks explorer link → verifies on-chain
8. ✅ Admin approves
9. ✅ User subscription activates
10. ✅ Dashboard shows Pro plan

### 9.2 Edge Cases

- ❌ Submit invalid tx hash format
- ❌ Submit duplicate tx hash
- ❌ Non-admin tries to access `/admin`
- ❌ Admin rejects payment → check error message

## Step 10: Deploy (15 minutes)

```bash
git add .
git commit -m "feat: crypto subscription payment system"
git push origin 003-crypto-subscription-payments

# Merge to main
# Vercel auto-deploys
```

**Post-Deploy**:
1. ✅ Run migration on production Supabase
2. ✅ Update production wallet addresses
3. ✅ Grant admin role to production user
4. ✅ Test full flow on production

## Troubleshooting

### Issue: "RLS policy prevents this operation"
**Solution**: Check user has correct `is_admin` flag or owns the record

### Issue: QR code not displaying
**Solution**: Check wallet address format (must be valid Ethereum address)

### Issue: Transaction hash rejected
**Solution**: Must be 0x + 64 hex characters (66 total)

### Issue: Admin panel empty
**Solution**: Verify user has `is_admin: true` in `raw_user_meta_data`

## Next Steps

After completing quickstart:
1. Run `/speckit.tasks` to generate detailed implementation tasks
2. Run `/speckit.implement` to execute tasks systematically
3. Monitor admin panel for first real payment
4. Set up monitoring for payment approval SLAs
