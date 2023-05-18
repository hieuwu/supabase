// [Joshen] Probably need to centralize this value somewhere as it needs to be used
// by email notifications as well
export const USAGE_APPROACHING_THRESHOLD = 0.8

export const BILLING_BREAKDOWN_METRICS = [
  { key: 'db_size', name: 'Database space', units: 'bytes' },
  { key: 'db_egress', name: 'Database egress', units: 'bytes' },
  { key: 'monthly_active_users', name: 'Active users', units: 'absolute' },
  { key: 'monthly_active_sso_users', name: 'Active SSO users', units: 'absolute' },
  { key: 'realtime_peak_connection', name: 'Realtime peak connections', units: 'absolute' },
  { key: 'realtime_message_count', name: 'Realtime messages', units: 'absolute' },
  { key: 'func_invocations', name: 'Edge function invocations', units: 'absolute' },
  { key: 'func_count', name: 'Edge functions', units: 'absolute' },
  { key: 'storage_size', name: 'Storage space', units: 'bytes' },
  { key: 'storage_egress', name: 'Storage egress', units: 'bytes' },
  { key: 'storage_image_render_count', name: 'Asset transformations', units: 'absolute' },
]
