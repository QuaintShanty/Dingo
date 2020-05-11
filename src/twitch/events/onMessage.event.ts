import TwitchClient from '@twitch/twitch.client';
// import TwitchSettings from '@twitch/twitch.settings';
import { toParams } from '@utils/discord.utils';
import TwitchStreams from '@twitch/twitch.streams';
import { debug } from '@utils/essentials.utils';

interface ITwitchMessage {
  channel: string;
  nick: string;
  isNickMod: boolean;
  content: string;
}

interface ITwitchCommandInfo {
  options: string[];
}

const commands: Map<string, ITwitchCommandInfo> = new Map([
  [
    'funds',
    {
      options: ['watch', 'all']
    }
  ]
]);

TwitchClient.client.onMessage('PRIVMSG', (message) => {
  // Store the message info
  const msg: ITwitchMessage = {
    channel: message.params['target'].substr(1),
    nick: message.prefix!.nick,
    isNickMod:
      message.prefix!.nick === message.params['target'].substr(1) ||
      message.tags.get('user-type') === 'mod',
    content: message.params['message']
  };

  // Handle the command & params
  const tempVal = msg.content.indexOf(' ');
  const command = msg.content
    .substring(1, tempVal === -1 ? msg.content.length : tempVal)
    .toLowerCase();
  let params: string[] = [];

  if (msg.content.includes(' ')) {
    params = toParams(msg.content.substring(tempVal + 1, msg.content.length));
  }

  switch (command) {
    case 'commands':
      const response = [];

      for (const [key, value] of commands.entries()) {
        response.push(`${key} [${value.options.join('|')}]`);
      }

      TwitchClient.client.say(
        msg.channel,
        `Here's a list of the available commands: ${response.join(', ')}`
      );
      break;

    case 'funds':
      if (params.length <= 0) {
        // Handle default
      }

      switch (params[0]) {
        case 'watch':
          const isWatching = TwitchStreams.funds[msg.channel].watching;

          try {
            TwitchStreams.toggleFunds(msg.channel);

            TwitchClient.client.say(
              msg.channel,
              isWatching
                ? `Alright, I've put my watching on pause.`
                : `Yes, chief. I'm now watching for funds.`
            );
          } catch (e) {
            debug(e);
          }
          break;
      }
      break;
  }
});
