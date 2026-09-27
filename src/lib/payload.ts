import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Returns a Payload instance using the local API. Safe to call from server
 * components, route handlers, and server actions.
 */
export const getPayloadClient = async () => getPayload({ config })
