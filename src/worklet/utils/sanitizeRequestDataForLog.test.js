import { sanitizeRequestDataForLog } from './sanitizeRequestDataForLog.js'

describe('sanitizeRequestDataForLog', () => {
  test('redacts record/ keyed payloads', () => {
    const result = sanitizeRequestDataForLog('ACTIVE_VAULT_ADD', {
      key: 'record/abc',
      data: { data: { password: 'x' }, folder: 'Secrets' }
    })
    expect(result.data.data).toBe('[REDACTED]')
    expect(result.data.folder).toBe('[REDACTED]')
  })

  test('redacts record-v2/ keyed payloads', () => {
    const result = sanitizeRequestDataForLog('ACTIVE_VAULT_ADD', {
      key: 'record-v2/abc',
      data: { data: { password: 'x', uris: [] }, folder: 'Secrets' }
    })
    expect(result.data.data).toBe('[REDACTED]')
    expect(result.data.folder).toBe('[REDACTED]')
  })
})
