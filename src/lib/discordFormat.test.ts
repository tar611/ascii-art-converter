import { describe, expect, it } from 'vitest'
import { DISCORD_FREE_LIMIT, exceedsDiscordLimit, wrapForDiscord } from './discordFormat'

describe('wrapForDiscord', () => {
  it('wraps text in a triple-backtick code fence', () => {
    expect(wrapForDiscord('hello')).toBe('```\nhello\n```')
  })
})

describe('exceedsDiscordLimit', () => {
  it('returns false for text at or under the limit', () => {
    const text = 'a'.repeat(DISCORD_FREE_LIMIT)
    expect(exceedsDiscordLimit(text)).toBe(false)
  })

  it('returns true for text over the limit', () => {
    const text = 'a'.repeat(DISCORD_FREE_LIMIT + 1)
    expect(exceedsDiscordLimit(text)).toBe(true)
  })

  it('accepts a custom limit, e.g. for Nitro accounts', () => {
    const text = 'a'.repeat(3000)
    expect(exceedsDiscordLimit(text, 2000)).toBe(true)
    expect(exceedsDiscordLimit(text, 4000)).toBe(false)
  })
})
