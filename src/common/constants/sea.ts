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

const partnerUniversityDomains = {
    CADIZ: /^(alum\.|gm\.|)uca\.es$/,
    BREST: /^(etudiant\.|)univ-brest\.fr$/,
    GDANSK: /^(studms\.|phdstud\.|)ug\.edu\.pl$/,
    MALTA: /^um\.edu\.mt$/,
    KIEL: /((.+\.)|^)uni-kiel\.de$/,
    SPLIT: /^(((uni|ef|ff|grad|kbf-|kif|mef|pf|prav|pmf)st)|(ktf-split)|(fesb)|(efst\.live)|(svkst)|(umas))(\.hr)$/,
};

export interface IUniversity {
    key: string;
    domains: any;
    country: CountryCode;
}

// List of partner universities
export const PARTNER_UNIVERSITIES: IUniversity[] = [
    {
        key: PartnerUniversity.CADIZ,
        domains: partnerUniversityDomains.CADIZ,
        country: CountryCode.SPAIN,
    },
    {
        key: PartnerUniversity.BREST,
        domains: partnerUniversityDomains.BREST,
        country: CountryCode.FRANCE,
    },
    {
        key: PartnerUniversity.GDANSK,
        domains: partnerUniversityDomains.GDANSK,
        country: CountryCode.POLAND,
    },
    {
        key: PartnerUniversity.MALTA,
        domains: partnerUniversityDomains.MALTA,
        country: CountryCode.MALTA,
    },
    {
        key: PartnerUniversity.KIEL,
        domains: partnerUniversityDomains.KIEL,
        country: CountryCode.GERMANY,
    },
    {
        key: PartnerUniversity.SPLIT,
        domains: partnerUniversityDomains.SPLIT,
        country: CountryCode.CROATIA,
    },
];
