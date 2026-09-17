// Discord renders plain pasted text in a proportional font, which breaks the
// column alignment ASCII art depends on. Wrapping it in a fenced code block
// forces Discord's client to render it monospaced instead.
export function wrapForDiscord(text: string): string {
  return '```\n' + text + '\n```'
}

// Free Discord accounts cap messages at 2000 characters; Nitro raises that
// to 4000. Anything longer isn't rejected — it gets silently turned into a
// .txt attachment by Discord's own client, which is the behavior we're
// trying to avoid by copying formatted text instead of downloading a file.
export const DISCORD_FREE_LIMIT = 2000
export const DISCORD_NITRO_LIMIT = 4000

export function exceedsDiscordLimit(discordText: string, limit: number = DISCORD_FREE_LIMIT): boolean {
  return discordText.length > limit
}
