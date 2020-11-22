import { LanguageEntity } from './language.entity';

describe('Language entity', () => {
    it('should create language with no fields', () => {
        const language = new LanguageEntity();
        expect(language).toBeTruthy();
        expect(language.code).toBeUndefined();
        expect(language.profile).toBeUndefined();
    });
});
