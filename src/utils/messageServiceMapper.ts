import { OpsMessageI } from '../types/opsMessage';
import { Service } from '../types/types';
import { fetchExternalServices } from './servicesAPI';

/**
 * Enriches messages with full service details (including teamId) for services that are already in affectedServices
 * This only adds missing service details, it doesn't change which services are affected
 */
export const enrichMessagesWithServiceInfo = async (
  messages: OpsMessageI[],
  serviceIds: string[]
): Promise<OpsMessageI[]> => {
  try {
    // Fetch all external services to get full service details (including teamId)
    const allServices = await fetchExternalServices();

    // Create a map for quick lookup of full service details
    const serviceMap = new Map<string, Service>();
    allServices.forEach(service => {
      if (service.id) {
        serviceMap.set(service.id, service);
      }
    });

    // Enrich messages with complete service information
    return messages.map(message => {
      // Only enrich services that are already in the message's affectedServices
      const enrichedAffectedServices = message.affectedServices.map(affectedService => {
        const fullServiceDetails = serviceMap.get(affectedService.id);
        // Return full service details if available, otherwise keep original
        return fullServiceDetails || affectedService;
      });

      return {
        ...message,
        affectedServices: enrichedAffectedServices
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