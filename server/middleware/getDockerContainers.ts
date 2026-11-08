// import type definitions
import type { Request, Response } from 'express';

// import local files
import { getListOfDockerContainers } from '../tools/docker.js';
import { handleError } from '../utils/errors.js';
import logger from '../utils/logger.js';

const getPlatform = (info: any) => {
  let platform = '';

  if (info.ImageManifestDescriptor?.platform?.architecture) {
    platform += info.ImageManifestDescriptor.platform.architecture;
  }

  if (info.ImageManifestDescriptor?.platform?.os) {
    platform += `/${info.ImageManifestDescriptor.platform.os}`;
  }

  return platform || 'unknown';
};

const getAllDockerContainers = async (request: Request, response: Response) => {
  const { socketPath } = request.query;

  try {
    const containers = await getListOfDockerContainers(socketPath as string);

    if (!containers || !Array.isArray(containers) || containers.length === 0) {
      return response.status(200).json([]);
    }

    response.json(
      containers.map((info: any) => {
        return {
          id: info.Id,
          name: info.Names?.[0]?.replace(/^\//, ''),
          image: info.Image,
          platform: getPlatform(info),
        };
      })
    );
  } catch (error: any) {
    logger.error('Error getting Docker containers', {
      message: error.message,
      stack: error.stack,
    });
    handleError(error, response);
  }
};

export default getAllDockerContainers;
