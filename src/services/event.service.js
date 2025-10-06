import { GeoIp } from "../utils/geo.ip.js";
import { parseIp } from "../utils/parse.ip.js";

export const createEvent = async (event_name, event_type, visitor_id, user_ip, event_data = null) => {
  const user_data = await GeoIp(user_ip);

  const record_event_data = {
    event_name,
    event_type,
    visitor_id,
    user_ip,
    user_data,
    ...(event_data && { event_data }),
  };

  // console.log(JSON.stringify(record_event_data, null, 2));
  return record_event_data;
};
