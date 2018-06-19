import { TestBed, inject } from '@angular/core/testing';

import { ThemeService } from './theme.service';

// TODO: Add UT for ThemeService.
describe('ThemeService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ThemeService]
        });
    });

    it('should be created', inject([ThemeService], (service: ThemeService) => {
        expect(service).toBeTruthy();
    }));
});
