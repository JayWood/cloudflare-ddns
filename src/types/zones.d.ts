
export interface Meta {
    cdn_only: boolean;
    custom_certificate_quota: number;
    dns_only: boolean;
    foundation_dns: boolean;
    page_rule_quota: number;
    phishing_detected: boolean;
    step: number;
}

export interface Owner {
    id: string;
    name: string;
    type: string;
}

export interface Account {
    id: string;
    name: string;
}

export interface ZoneItem {
    account: Account;
    activated_on: string;
    created_on: string;
    development_mode: number;
    id: string;
    meta: Meta;
    modified_on: string;
    name: string;
    original_dnshost: string;
    original_name_servers: string[];
    original_registrar: string;
    owner: Owner;
    vanity_name_servers: string[];
    type?: 'full'|'partial';
}

export interface ZoneInfo {
    count: number;
    page: number;
    per_page: number;
    total_count: number;
}

export interface ZonesResponse {
    errors: any[];
    messages: any[];
    success: boolean;
    result_info: ZoneInfo;
    result: ZoneItem[];
}