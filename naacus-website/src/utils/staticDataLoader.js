/**
 * Static Data Loader
 * Fetches stable content from JSON files instead of hardcoded JS data
 */

export const loadStaticData = async (dataType) => {
  try {
    const response = await fetch(`/content/${dataType}.json`);
    if (!response.ok) throw new Error(`Failed to load ${dataType}`);
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${dataType}:`, error);
    return null;
  }
};

export const loadActivitiesData = () => loadStaticData('activities');
export const loadFaqData = () => loadStaticData('faq-data');
