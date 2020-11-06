'use strict';

export enum CountryCode {
    FRANCE = 'FR',
    SPAIN = 'ES',
    POLAND = 'PL',
    MALTA = 'MT',
    GERMANY = 'DE',
    CROATIA = 'HR',
}

export enum PartnerUniversity {
    CADIZ = 'univ-cadiz',
    BREST = 'univ-brest',
    GDANSK = 'univ-gdansk',
    MALTA = 'univ-malta',
    KIEL = 'univ-kiel',
    SPLIT = 'univ-split',
}

export enum PartnerUniversityDomain {
    CADIZ = 'uca.es',
    BREST = 'univ-brest.fr',
    GDANSK = 'ug.edu.pl',
    MALTA = 'um.edu.mt',
    KIEL = 'kms.uni-kiel.de',
    SPLIT = 'unist.hr',
}

export interface IUniversity {
    key: string;
    domain: string;
    country: CountryCode;
}

// List of partner universities
export const PARTNER_UNIVERSITIES = [
    {
        key: PartnerUniversity.CADIZ,
        domain: PartnerUniversityDomain.CADIZ,
        country: CountryCode.SPAIN,
    },
    {
        key: PartnerUniversity.BREST,
        domain: PartnerUniversityDomain.BREST,
        country: CountryCode.FRANCE,
    },
    {
        key: PartnerUniversity.GDANSK,
        domain: PartnerUniversityDomain.GDANSK,
        country: CountryCode.POLAND,
    },
    {
        key: PartnerUniversity.MALTA,
        domain: PartnerUniversityDomain.MALTA,
        country: CountryCode.MALTA,
    },
    {
        key: PartnerUniversity.KIEL,
        domain: PartnerUniversityDomain.KIEL,
        country: CountryCode.GERMANY,
    },
    {
        key: PartnerUniversity.SPLIT,
        domain: PartnerUniversityDomain.SPLIT,
        country: CountryCode.CROATIA,
    },
] as IUniversity[];
