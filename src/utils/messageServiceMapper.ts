import { OpsMessageI } from '../types/opsMessage';
import { Service } from '../types/types';
import { fetchExternalServices } from './servicesAPI';

/**
 * Maps service information (including teamId) to ops messages
 * Since backend doesn't include service details in affectedServices,
 * we need to fetch services separately and match by service IDs
 */
export const enrichMessagesWithServiceInfo = async (
  messages: OpsMessageI[],
  serviceIds: string[]
): Promise<OpsMessageI[]> => {
  try {
    // Fetch all external services
    const allServices = await fetchExternalServices();

    // Create a map for quick lookup
    const serviceMap = new Map<string, Service>();
    allServices.forEach(service => {
      if (service.id) {
        serviceMap.set(service.id, service);
      }
    });

    // Enrich messages with service information
    return messages.map(message => {
      // Find services for this message based on serviceIds that have messages
      const relevantServices = serviceIds
        .map(serviceId => serviceMap.get(serviceId))
        .filter((service): service is Service => service !== undefined);

      return {
        ...message,
        affectedServices: relevantServices
      };
    });
  } catch (error) {
    console.error('Failed to enrich messages with service info:', error);
    // Return original messages if enrichment fails
    return messages;
  }
};

/**
 * Check if a user can edit a specific message based on service team membership
 */
export const canUserEditMessage = (message: OpsMessageI, userId: string): boolean => {
  if (message.affectedServices.length === 0) {
    return false;
  }

  const firstService = message.affectedServices[0];

  // Check if service has teamId
  return Boolean(firstService.teamId);
};