import { getListOfDockerContainers } from '../tools/docker.js';
import { handleError } from '../utils/errors.js';
import logger from '../utils/logger.js';

const getPlatform = (info) => {
  let platform = '';

  if (info.ImageManifestDescriptor?.platform?.architecture) {
    platform += info.ImageManifestDescriptor.platform.architecture;
  }

  if (info.ImageManifestDescriptor?.platform?.os) {
    platform += `/${info.ImageManifestDescriptor.platform.os}`;
  }

  return platform || 'unknown';
};

const getAllDockerContainers = async (request, response) => {
  try {
    const containers = await getListOfDockerContainers();
    response.json(
      containers.map((info) => {
        return {
          id: info.Id,
          name: info.Names?.[0]?.replace(/^\//, ''),
          image: info.Image,
          platform: getPlatform(info),
        };
      })
    );
  } catch (error) {
    logger.error('Error getting Docker containers', {
      message: error.message,
      stack: error.stack,
    });
    handleError(error, response);
  }
};

export default getAllDockerContainers;
