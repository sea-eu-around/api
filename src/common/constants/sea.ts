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

const partnerUniversityDomainRegexes = {
    CADIZ: [/uca\.es/],
    BREST: [/univ-brest\.fr/],
    GDANSK: [/ug\.edu\.pl/],
    MALTA: [/um\.edu\.mt/],
    KIEL: [/((.+\.)|^)uni-kiel\.de/],
    SPLIT: [/unist\.hr/],
};

export interface IUniversity {
    key: string;
    domainRegexes: any;
    country: CountryCode;
}

// List of partner universities
export const PARTNER_UNIVERSITIES: IUniversity[] = [
    {
        key: PartnerUniversity.CADIZ,
        domainRegexes: partnerUniversityDomainRegexes.CADIZ,
        country: CountryCode.SPAIN,
    },
    {
        key: PartnerUniversity.BREST,
        domainRegexes: partnerUniversityDomainRegexes.BREST,
        country: CountryCode.FRANCE,
    },
    {
        key: PartnerUniversity.GDANSK,
        domainRegexes: partnerUniversityDomainRegexes.GDANSK,
        country: CountryCode.POLAND,
    },
    {
        key: PartnerUniversity.MALTA,
        domainRegexes: partnerUniversityDomainRegexes.MALTA,
        country: CountryCode.MALTA,
    },
    {
        key: PartnerUniversity.KIEL,
        domainRegexes: partnerUniversityDomainRegexes.KIEL,
        country: CountryCode.GERMANY,
    },
    {
        key: PartnerUniversity.SPLIT,
        domainRegexes: partnerUniversityDomainRegexes.SPLIT,
        country: CountryCode.CROATIA,
    },
];
