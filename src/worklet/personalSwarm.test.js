import { jest } from '@jest/globals'

const mockFlushed = jest.fn(() => new Promise(() => {}))
const mockJoin = jest.fn(() => ({ flushed: mockFlushed }))
const mockOn = jest.fn()
const mockDestroy = jest.fn().mockResolvedValue(undefined)

jest.mock('hyperswarm', () =>
  jest.fn().mockImplementation(() => ({
    join: mockJoin,
    on: mockOn,
    destroy: mockDestroy
  }))
)

jest.mock('./appDeps', () => ({
  getPersonalKeyPair: jest.fn().mockResolvedValue({
    publicKey: Buffer.alloc(32, 1)
  }),
  getVaultsInstance: jest.fn().mockReturnValue({
    store: {
      createKeyPair: jest.fn().mockResolvedValue({
        publicKey: Buffer.alloc(32, 2),
        secretKey: Buffer.alloc(64, 3)
      })
    }
  })
}))

jest.mock('./utils/swarm', () => ({
  getConfig: jest.fn().mockResolvedValue({ current: { blindRelays: [] } })
}))

jest.mock('./utils/workletLogger', () => ({
  workletLogger: { error: jest.fn(), info: jest.fn(), debug: jest.fn() }
}))

import { personalSwarmClose, personalSwarmInit } from './personalSwarm'

describe('personalSwarmInit', () => {
  afterEach(async () => {
    await personalSwarmClose()
    jest.clearAllMocks()
  })

  test('returns without waiting for DHT flushed', async () => {
    const result = await Promise.race([
      personalSwarmInit(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('personalSwarmInit waited on flushed')),
          100
        )
      )
    ])

    expect(mockJoin).toHaveBeenCalled()
    expect(mockFlushed).toHaveBeenCalled()
    expect(result.topic).toMatch(/^[0-9a-f]{64}$/)
  })
})
