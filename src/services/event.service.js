import { GeoIp } from "../utils/geo.ip.js";
import { parseIp } from "../utils/parse.ip.js";
import { pool } from "../utils/postgress.js";

export const createEvent = async (data) => {
  const user_data = await GeoIp(data.user_ip);
  const result = await saveEventPg({
    ...data,
    user_data,
  });
  return result;
};

const saveEventPg = async (data) => {
  const {
    event_name,
    event_type,
    visitor_id,
    user_ip,
    user_data,
    event_data,
    url,
    path,
    utm_params,
  } = data;

  // Extract user agent from request if available
  const user_agent = data.user_agent || null;

  // Map user_data to database schema
  const userDataMapping = {
    user_data_ip_address: user_data?.ip || null,
    user_data_city: user_data?.city || null,
    user_data_city_geoname_id: user_data?.city_geoname_id || null,
    user_data_region: user_data?.region || null,
    user_data_region_geoname_id: user_data?.region_geoname_id || null,
    user_data_postal_code: user_data?.postal || null,
    user_data_country: user_data?.country_name || null,
    user_data_country_code: user_data?.country_code || null,
    user_data_country_geoname_id: user_data?.country_geoname_id || null,
    user_data_country_is_eu: user_data?.in_eu || null,
    user_data_continent: user_data?.continent_name || null,
    user_data_continent_code: user_data?.continent_code || null,
    user_data_continent_geoname_id: user_data?.continent_geoname_id || null,
    user_data_longitude: user_data?.longitude || null,
    user_data_latitude: user_data?.latitude || null,
    user_data_security: user_data?.security || null,
    user_data_timezone: user_data?.timezone || null,
  };

  const query = `
    INSERT INTO public.events (
      event_type,
      event_name,
      event_data,
      url,
      path,
      user_ip,
      user_agent,
      visitor_id,
      utm_params,
      user_data_ip_address,
      user_data_city,
      user_data_city_geoname_id,
      user_data_region,
      user_data_region_geoname_id,
      user_data_postal_code,
      user_data_country,
      user_data_country_code,
      user_data_country_geoname_id,
      user_data_country_is_eu,
      user_data_continent,
      user_data_continent_code,
      user_data_continent_geoname_id,
      user_data_longitude,
      user_data_latitude,
      user_data_security,
      user_data_timezone
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
    ) RETURNING *;
  `;

  const values = [
    event_type,
    event_name,
    event_data ? JSON.stringify(event_data) : null,
    url || null,
    path || null,
    user_ip,
    user_agent ? JSON.stringify(user_agent) : null,
    visitor_id,
    utm_params ? JSON.stringify(utm_params) : null,
    userDataMapping.user_data_ip_address,
    userDataMapping.user_data_city,
    userDataMapping.user_data_city_geoname_id,
    userDataMapping.user_data_region,
    userDataMapping.user_data_region_geoname_id,
    userDataMapping.user_data_postal_code,
    userDataMapping.user_data_country,
    userDataMapping.user_data_country_code,
    userDataMapping.user_data_country_geoname_id,
    userDataMapping.user_data_country_is_eu,
    userDataMapping.user_data_continent,
    userDataMapping.user_data_continent_code,
    userDataMapping.user_data_continent_geoname_id,
    userDataMapping.user_data_longitude,
    userDataMapping.user_data_latitude,
    userDataMapping.user_data_security,
    userDataMapping.user_data_timezone,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error saving event to database:", error);
    throw error;
  }
};

export { saveEventPg };
