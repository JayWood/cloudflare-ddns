/**
 * @link: https://developers.cloudflare.com/api/operations/dns-records-for-a-zone-list-dns-records
 */

export interface Meta {
    auto_added: boolean;
    source: string;
}

export interface Tag {
    owner: string;
}

export interface DNSRecord {
    content: string;
    name: string;
    proxied: boolean;
    type: string;
    comment: string;
    created_on: string;
    id: string;
    locked: boolean;
    meta: Meta;
    modified_on: string;
    proxiable: boolean;
    tags: Tag[];
    ttl: number;
    zone_id: string;
    zone_name: string;
}

export interface DNSRecordUpdate {
    content?: string;
    name?: string;
    proxied?: boolean;
    type?: string;
    comment?: string;
    created_on?: string;
    id?: string;
    locked?: boolean;
    meta?: Meta;
    modified_on?: string;
    proxiable?: boolean;
    tags?: Tag[];
    ttl?: number;
    zone_id?: string;
    zone_name?: string;
}

export interface DNSApiResponse {
    errors: any[];
    messages: any[];
    result: DNSRecord[];
    success: boolean;
    result_info: Record<string, number>;
}

export interface DNSAPIPatchResponse {
    errors: any[];
    messages: any[];
    result: DNSRecord;
    success: boolean;
}