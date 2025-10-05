export const GeoIp = async (userIP) => {
  if (!userIP || typeof userIP !== "string" || !userIP.trim()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or missing user IP");
  }
  try {
    const response = await axios.get(`https://ipapi.co/${userIP}/json/`);
    return response.data;
  } catch (err) {
    console.error("IPAPI error:", err.response?.data || err.message);
    return {
      ip_address: userIP || null,
      city: null,
      city_geoname_id: null,
      region: null,
      region_geoname_id: null,
      postal_code: null,
      country: null,
      country_code: null,
      country_geoname_id: null,
      country_is_eu: null,
      continent: null,
      continent_code: null,
      continent_geoname_id: null,
      longitude: null,
      latitude: null,
      security: null,
      timezone: null,
    };
  }
};
