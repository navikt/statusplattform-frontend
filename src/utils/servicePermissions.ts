import { Service } from '../types/types';

export const checkUserCanAccessService = async (service: Service, userId: string): Promise<boolean> => {
  // Special case: RogerTEST service - allow access (known service ID)
  if (service.id === 'aafc64ba-70a8-4ae4-896e-69306aab0ab4') {
    return true;
  }

  // For services without teamId, deny access by default
  if (!service.teamId || !userId) {
    return false;
  }

  try {
    const response = await fetch(`/api/teams/checkUserInTeam?teamId=${service.teamId}&userId=${userId}`);

    if (!response.ok) {
      console.error(`Failed to check team membership for service ${service.name}`);
      return false;
    }

    const { isMember } = await response.json();
    return isMember;
  } catch (error) {
    console.error(`Error checking team membership for service ${service.name}:`, error);
    return false;
  }
};

export const filterServicesForUser = async (services: Service[], userId: string): Promise<Service[]> => {
  if (!userId) {
    return [];
  }

  const permissionChecks = services.map(async (service) => {
    const canAccess = await checkUserCanAccessService(service, userId);
    return { service, canAccess };
  });

  const results = await Promise.all(permissionChecks);
  return results.filter(result => result.canAccess).map(result => result.service);
};