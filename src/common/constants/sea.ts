export enum CountryCode {
    FRANCE = 'FRA',
    SPAIN = 'ES',
    POLAND = 'POL',
    MALTA = 'MLT',
    GERMANY = 'DEU',
    CROATIA = 'HRV',
}

export interface IUniversity {
    key: string;
    domain: string;
    country: CountryCode;
}

// List of partner universities
export const PARTNER_UNIVERSITIES = [
    {
        key: 'univ-cadiz',
        domain: 'uca.es',
        country: CountryCode.SPAIN,
    },
    {
        key: 'univ-brest',
        domain: 'univ-brest.fr',
        country: CountryCode.FRANCE,
    },
    {
        key: 'univ-gdansk',
        domain: 'ug.edu.pl',
        country: CountryCode.POLAND,
    },
    {
        key: 'univ-malta',
        domain: 'um.edu.mt',
        country: CountryCode.MALTA,
    },
    {
        key: 'univ-kiel',
        domain: 'kms.uni-kiel.de',
        country: CountryCode.GERMANY,
    },
    {
        key: 'univ-split',
        domain: 'unist.hr',
        country: CountryCode.CROATIA,
    },
] as IUniversity[];
