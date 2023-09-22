import {Ipify} from "./types/ipify";
import axios from "axios";
import {ZoneItem, ZonesResponse} from "./types/zones";
import {DNSAPIPatchResponse, DNSApiResponse, DNSRecord, DNSRecordUpdate} from "./types/dns";

require('dotenv').config();

/**
 * Just some basic cloudflare auth config data used in axios calls.
 */
const cfConfig = {
    headers: {
        Authorization: `Bearer ${process.env.CF_API_TOKEN}`
    }
};

/**
 * Lists the zones for the account.
 *
 * @link https://developers.cloudflare.com/api/operations/zones-get
 */
const getZones = async (): Promise<ZoneItem[]> => {
    const zoneRequest = await axios.get( 'https://api.cloudflare.com/client/v4/zones', cfConfig );

    const sites = process.env.CF_PROPERTIES.split(',');
    const zonesResponse = zoneRequest.data as ZonesResponse;
    return zonesResponse.result.filter( (zone) => sites.includes( zone.name ) );
};

/**
 * Gets the DNS Records.
 *
 * @link https://developers.cloudflare.com/api/operations/dns-records-for-a-zone-list-dns-records
 * @param zone
 */
const getDnsRecords = async ( zone: ZoneItem ): Promise<DNSApiResponse> => {
    const {id} = zone;

    const dnsRecords = await axios.get( `https://api.cloudflare.com/client/v4/zones/${id}/dns_records`, cfConfig );
    if ( dnsRecords.status !== 200 ) {
        throw new Error( `Ipify is failing with a status code ${dnsRecords.status}` );
    }

    return dnsRecords.data as DNSApiResponse;
}

/**
 * Patches a DNS record on Cloudflare with the configuration passed in.
 * @param record
 * @param zone
 * @param newRecord
 */
const patchDnsRecord = async ( record: DNSRecord, zone: ZoneItem, newRecord: DNSRecordUpdate ): Promise<DNSAPIPatchResponse> => {
    const dnsRequest = await axios.patch(
        `https://api.cloudflare.com/client/v4/zones/${zone.id}/dns_records/${record.id}`,
        newRecord,
        {
            headers: {
                ...cfConfig.headers,
                'Content-Type': 'application/json',
            }
        }
    )

    return dnsRequest.data as DNSAPIPatchResponse;
}

( async () => {
    const ipData = await axios.get( 'https://api.ipify.org?format=json' );
    if ( ipData.status !== 200 ) {
        throw new Error( `Ipify is failing with a status code ${ipData.status}` );
    }

    const {ip} = ipData.data as Ipify;
    const listedZones = await getZones() as ZoneItem[];

    // Make sure we only alter 'full' zone edits just in case these are 'partner hosted' setups.
    // @link https://developers.cloudflare.com/dns/zone-setups/
    const zones = listedZones.filter( zone => 'full' === zone?.type );

    if ( ! zones.length ) {
        return;
    }

    const dnsRecordPromises = zones.map( zone => getDnsRecords( zone ) );
    const results = await Promise.allSettled( dnsRecordPromises );

    results.forEach( ( result: PromiseSettledResult<DNSApiResponse>, index: number ) => {
        const zone = zones[index];
        if ( result.status === 'rejected' ) {
            throw Error( result.reason );
        }

        console.log( result.value.result[0].meta );
        /*
        TODO: Look at the meta, see if managed_by_XXX changes for jaycodesit.
         */
    } );
} )();