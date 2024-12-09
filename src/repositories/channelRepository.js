import Channel from '../schema/channel.js';
import crudRepository from './crudRepository.js';

const channelRepository = {
  ...crudRepository(Channel),

  getChannelWithWorkspaceDetails: async (channelId) => {
    const response = await Channel.findById(channelId).populate('workspaceId');
    return response;
  }
};

export default channelRepository;
